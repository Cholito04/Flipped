import { useState, useEffect, useMemo } from "react";
import style from "../styles/cs.module.css";
import api from "../util/axios";
import type { Item } from "../util/Types";
import ItemCard from "../util/ItemCard";
import { useItemActions } from "../util/useItemActions";
import type { ReactNode } from "react";

type SortKey = "newest" | "profit" | "spent" | "items";

const money = (n: number) => `$${n.toFixed(2)}`;

function dayKey(s: string) {
  const d = new Date(s);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseDayKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function calcStats(items: Item[]) {
  const sold = items.filter((i) => i.status === "sold" && i.price_sold);
  const spent = items.reduce((s, i) => s + parseFloat(i.price_bought), 0);
  const earned = sold.reduce((s, i) => s + parseFloat(i.price_sold!), 0);
  const soldCost = sold.reduce((s, i) => s + parseFloat(i.price_bought), 0);
  const profit = earned - soldCost;

  return {
    count: items.length,
    soldCount: sold.length,
    spent,
    earned,
    profit,
    inStock: spent - soldCost,
    avgProfit: sold.length ? profit / sold.length : null,
  };
}
function Figure({
  label,
  value,
  color = "text-text-primary",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="px-5 first:pl-0 border-l border-border first:border-l-0">
      <p className="text-text-muted text-sm uppercase tracking-wide">{label}</p>
      <p className={`text-m font-medium mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function TripCard({
  dayKeyStr,
  tripItems,
  isBest,
  menu,
}: {
  dayKeyStr: string;
  tripItems: Item[];
  isBest: boolean;
  menu: (item: Item) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const s = calcStats(tripItems);
  const date = parseDayKey(dayKeyStr);

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayLabel = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const itemsByStore = tripItems.reduce<Record<string, Item[]>>(
    (groups, item) => {
      const storeName = item.store?.store ?? "Unknown store";

      (groups[storeName] ??= []).push(item);

      return groups;
    },
    {},
  );

  const stores = [
    ...new Set(tripItems.map((i) => i.store?.store).filter(Boolean)),
  ] as string[];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6">
        {/* date + profit */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-text-muted text-xs uppercase tracking-widest">
              {weekday}
            </p>
            <h2 className="text-text-primary text-2xl font-black tracking-tight mt-1">
              {dayLabel}
            </h2>
            <p className="text-text-muted text-sm mt-1">
              {s.count} item{s.count !== 1 ? "s" : ""} · {s.soldCount} sold
              {isBest && <span className="text-status-sold"> · best trip</span>}
            </p>
            {stores.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {stores.map((store) => (
                  <span
                    key={store}
                    className="
          inline-flex items-center gap-2
          rounded-md border border-border
          bg-bg/50 px-2.5 py-1
          text-xs text-text-muted
        "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-status-listed" />
                    {store}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            <p
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                s.profit >= 0 ? "text-status-sold" : "text-red-400"
              }`}
            >
              {money(s.profit)}
            </p>
            <p className="text-text-muted text-xs mt-1">profit</p>
          </div>
        </div>

        {/* figures */}
        <div className="flex flex-wrap gap-y-3 mt-6 pt-5 border-t border-border">
          <Figure label="Spent" value={money(s.spent)} />
          <Figure label="Earned" value={money(s.earned)} />
          <Figure
            label="In stock"
            value={money(s.inStock)}
            color="text-status-listed"
          />
          <Figure
            label="Avg / flip"
            value={s.avgProfit !== null ? money(s.avgProfit) : "—"}
            color={
              s.avgProfit !== null && s.avgProfit < 0
                ? "text-red-400"
                : "text-text-primary"
            }
          />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="mt-5 text-sm text-text-muted hover:text-text-primary underline underline-offset-4 decoration-border hover:decoration-green-hover transition-all"
        >
          {open ? "Hide items" : `Show items (${s.count})`}
        </button>
      </div>

      {/* dropdown */}
      {open && (
        <div className="border-t border-border bg-bg/30 p-5 space-y-6">
          {Object.entries(itemsByStore).map(([storeName, storeItems]) => (
            <section key={storeName}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  {storeName}
                </h3>

                <span className="text-xs text-text-muted">
                  {storeItems.length} item
                  {storeItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {storeItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    variant="compact"
                    actions={menu(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function monthKey(dayKeyStr: string) {
  return dayKeyStr.slice(0, 7); // YYYY-MM
}

function formatMonth(key: string) {
  const [year, month] = key.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function Trips() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const { menu, modal } = useItemActions(setItems, setError);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await api.get("/inventory/items");
        setItems(res.data);
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? "Please login again"
            : "Failed to load activity",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const trips = useMemo(() => {
    const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
      (acc[dayKey(item.created_at)] ??= []).push(item);
      return acc;
    }, {});
    return Object.entries(grouped).map(([key, tripItems]) => ({
      key,
      items: tripItems,
      stats: calcStats(tripItems),
    }));
  }, [items]);

  const sorted = useMemo(() => {
    const list = [...trips];
    return list.sort((a, b) => {
      if (sortBy === "profit") return b.stats.profit - a.stats.profit;
      if (sortBy === "spent") return b.stats.spent - a.stats.spent;
      if (sortBy === "items") return b.stats.count - a.stats.count;
      return b.key.localeCompare(a.key); // newest first
    });
  }, [trips, sortBy]);

  const tripsByMonth = useMemo(() => {
    return sorted.reduce<Record<string, typeof sorted>>((groups, trip) => {
      const month = monthKey(trip.key);

      (groups[month] ??= []).push(trip);

      return groups;
    }, {});
  }, [sorted]);

  const totals = useMemo(() => {
    const spent = trips.reduce((s, t) => s + t.stats.spent, 0);
    const profit = trips.reduce((s, t) => s + t.stats.profit, 0);
    const best = [...trips].sort((a, b) => b.stats.profit - a.stats.profit)[0];
    return {
      spent,
      profit,
      bestKey: best && best.stats.profit > 0 ? best.key : null,
    };
  }, [trips]);

  if (loading)
    return (
      <div className="text-text-primary text-center py-36">
        <h1 className="text-4xl">Loading...</h1>
      </div>
    );

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "newest", label: "Newest" },
    { key: "profit", label: "Profit" },
    { key: "spent", label: "Most spent" },
    { key: "items", label: "Most items" },
  ];
  return (
    <div className="w-full min-h-screen px-6 pb-16">
      <div className="max-w-5xl mx-auto pt-20">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${style.chrome}`}
        >
          Trips
        </h1>

        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}

        {trips.length === 0 ? (
          <div className="mt-14 border border-border rounded-2xl p-10 text-center">
            <p className="text-text-muted">
              No trips yet. Add some items and each day you buy will show up
              here.
            </p>
          </div>
        ) : (
          <>
            {/* summary strip */}
            <div className=" flex flex-wrap gap-y-4 mt-10 pb-8 border-b border-border">
              <Figure label="Trips" value={String(trips.length)} />
              <Figure label="Total spent" value={money(totals.spent)} />
              <Figure
                label="Total profit"
                value={money(totals.profit)}
                color={totals.profit >= 0 ? "text-status-sold" : "text-red-400"}
              />
              <Figure
                label="Avg / trip"
                value={money(totals.profit / trips.length)}
                color={
                  totals.profit >= 0 ? "text-text-primary" : "text-red-400"
                }
              />
            </div>

            {/* sort */}
            <div className="flex gap-2 flex-wrap mt-8">
              {sortOptions.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setSortBy(o.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all ${
                    sortBy === o.key
                      ? "bg-green-primary text-silver-primary border-green-hover"
                      : "text-text-muted border-border hover:text-text-primary"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* trip cards */}
            <div className="mt-8 space-y-10">
              {Object.entries(tripsByMonth).map(([month, monthTrips]) => (
                <section key={month}>
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">
                      {formatMonth(month)}
                    </h2>

                    <span className="text-xs text-text-muted">
                      {monthTrips.length} trips
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {monthTrips.map((t) => (
                      <TripCard
                        key={t.key}
                        dayKeyStr={t.key}
                        tripItems={t.items}
                        isBest={t.key === totals.bestKey}
                        menu={menu}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
      {modal}
    </div>
  );
}

export default Trips;
