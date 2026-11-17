import { useState, useEffect, useMemo } from "react";
import style from "../styles/cs.module.css";
import api from "../util/axios";

import type { Item } from "../util/Types";
import ItemCard from "../util/ItemCard";
import { money } from "../util/Format";
import { useItemActions } from "../util/useItemActions";
import type { ReactNode } from "react";

type SortKey = "profit" | "items" | "spent" | "name";

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
    sellThrough: items.length ? (sold.length / items.length) * 100 : 0,
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
      <p className="text-text-muted text-xs uppercase tracking-widest">
        {label}
      </p>
      <p className={`font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}

function StoreCard({
  store,
  storeItems,
  isTop,
  menu,
}: {
  store: string;
  storeItems: Item[];
  isTop: boolean;
  menu: (item: Item) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const s = calcStats(storeItems);

  return (
    <div className="bg-card border border-border rounded-2xl">
      <div className="p-6">
        {/* name + profit */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h2 className="text-text-primary text-2xl font-black tracking-tight truncate">
              {store}
            </h2>
            <p className="text-text-muted text-sm mt-1">
              {s.count} item{s.count !== 1 ? "s" : ""} · {s.soldCount} sold
              {isTop && <span className="text-status-sold"> · top earner</span>}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p
              className={`text-3xl font-black tracking-tight ${
                s.profit >= 0 ? "text-status-sold" : "text-red-400"
              }`}
            >
              {money(s.profit)}
            </p>
            <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
              profit
            </p>
          </div>
        </div>

        {/* figures, one line, no boxes */}
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
        <div className="border-t border-border bg-bg/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {storeItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                variant="compact"
                actions={menu(item)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stores() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("profit");
  const [search, setSearch] = useState("");
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
            : "Failed to load stores",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const stores = useMemo(() => {
    const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
      const name = item.store?.store;
      if (!name) return acc;
      (acc[name] ??= []).push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, storeItems]) => ({
      name,
      items: storeItems,
      stats: calcStats(storeItems),
    }));
  }, [items]);

  const sorted = useMemo(() => {
    const list = stores.filter((s) =>
      s.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
    return list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "items") return b.stats.count - a.stats.count;
      if (sortBy === "spent") return b.stats.spent - a.stats.spent;
      return b.stats.profit - a.stats.profit;
    });
  }, [stores, sortBy, search]);

  // overall summary + the top earner (by profit, among all stores)
  const totals = useMemo(() => {
    const spent = stores.reduce((s, x) => s + x.stats.spent, 0);
    const profit = stores.reduce((s, x) => s + x.stats.profit, 0);
    const top = [...stores].sort((a, b) => b.stats.profit - a.stats.profit)[0];
    return {
      spent,
      profit,
      top: top && top.stats.profit > 0 ? top.name : null,
    };
  }, [stores]);

  if (loading)
    return (
      <div className="text-text-primary text-center py-36">
        <h1 className="text-4xl">Loading...</h1>
      </div>
    );

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "profit", label: "Profit" },
    { key: "items", label: "Most items" },
    { key: "spent", label: "Most spent" },
    { key: "name", label: "A–Z" },
  ];

  return (
    <div className="w-full min-h-screen px-6 pb-16">
      <div className="max-w-5xl mx-auto pt-20">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${style.chrome}`}
        >
          Stores
        </h1>

        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}

        {stores.length === 0 ? (
          <div className="mt-14 border border-border rounded-2xl p-10 text-center">
            <p className="text-text-muted">
              No stores yet. Add a store when you add an item and it will show
              up here.
            </p>
          </div>
        ) : (
          <>
            {/* summary strip */}
            <div className=" text-xl flex flex-wrap gap-y-4 mt-10 pb-8 border-b border-border">
              <Figure label="Stores" value={String(stores.length)} />
              <Figure label="Total spent" value={money(totals.spent)} />
              <Figure
                label="Total profit"
                value={money(totals.profit)}
                color={totals.profit >= 0 ? "text-status-sold" : "text-red-400"}
              />
              <Figure label="Top earner" value={totals.top ?? "—"} />
            </div>

            {/* controls */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mt-8">
              <div className="flex gap-2 flex-wrap">
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
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stores..."
                className="bg-card border border-border text-text-primary rounded-full px-5 py-2 text-sm w-full md:w-64 focus:outline-none focus:border-green-hover placeholder-text-muted"
              />
            </div>

            {/* store cards */}
            <div className="mt-6 flex flex-col gap-4">
              {sorted.map((s) => (
                <StoreCard
                  key={s.name}
                  store={s.name}
                  storeItems={s.items}
                  isTop={s.name === totals.top}
                  menu={menu}
                />
              ))}
              {sorted.length === 0 && (
                <p className="text-text-muted text-center py-10">
                  No stores match "{search}".
                </p>
              )}
            </div>
          </>
        )}
      </div>
      {modal}
    </div>
  );
}

export default Stores;
