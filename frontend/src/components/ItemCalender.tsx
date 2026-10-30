import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calander.css";
import api from "../util/axios";

interface Brand {
  id: number;
  brand: string;
}
interface Style {
  id: number;
  style: string;
}
interface Store {
  id: number;
  store: string;
}

interface Item {
  sold_at: string | null;
  id: number;
  brand: Brand;
  style: Style;
  store: Store;
  size: string;
  category: string;
  status: string;
  price_bought: string;
  price_sold: string | null;
  created_at: string;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
type Period = "day" | "week" | "month";

function sameDay(s: string | null, d: Date) {
  if (!s) return false;
  const t = new Date(s);
  return (
    t.getFullYear() === d.getFullYear() &&
    t.getMonth() === d.getMonth() &&
    t.getDate() === d.getDate()
  );
}

function getRange(date: Date, period: Period) {
  const start = new Date(date);
  const end = new Date(date);

  if (period === "day") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end] as const;
  }

  if (period === "week") {
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    const weekEnd = new Date(start);
    weekEnd.setDate(start.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return [start, weekEnd] as const;
  }

  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  end.setFullYear(start.getFullYear(), start.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return [start, end] as const;
}

function summarize(items: Item[], start: Date, end: Date) {
  const inRange = (s: string | null) => {
    if (!s) return false;
    const t = new Date(s);
    return t >= start && t <= end;
  };

  const bought = items.filter((i) => inRange(i.created_at));
  const sold = items.filter(
    (i) => i.status === "sold" && i.price_sold && inRange(i.sold_at),
  );

  const spent = bought.reduce(
    (s, i) => s + parseFloat(i.price_bought || "0"),
    0,
  );
  const earned = sold.reduce((s, i) => s + parseFloat(i.price_sold || "0"), 0);
  const profit = sold.reduce(
    (s, i) =>
      s + (parseFloat(i.price_sold || "0") - parseFloat(i.price_bought || "0")),
    0,
  );

  return {
    boughtCount: bought.length,
    soldCount: sold.length,
    spent,
    earned,
    profit,
  };
}

function PeriodSummary({ items, date }: { items: Item[]; date: Date }) {
  const [period, setPeriod] = useState<Period>("day");
  const [start, end] = getRange(date, period);
  const s = summarize(items, start, end);

  const stat = (label: string, value: string, color = "text-text-primary") => (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <p className="text-text-muted text-xs uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        {(["day", "week", "month"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all ${
              period === p
                ? "bg-green-primary text-silver-primary border-green-hover"
                : "text-text-muted border-border hover:text-text-primary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stat("Added", String(s.boughtCount))}
        {stat("Sold", String(s.soldCount))}
        {stat("Spent", `$${s.spent.toFixed(2)}`)}
        {stat("Earned", `$${s.earned.toFixed(2)}`)}
        {stat(
          "Profit",
          `$${s.profit.toFixed(2)}`,
          s.profit >= 0 ? "text-status-sold" : "text-red-400",
        )}
      </div>
    </div>
  );
}

function StoreRow({
  store,
  storeItems,
  mode,
}: {
  store: string;
  storeItems: Item[];
  mode: "bought" | "sold";
}) {
  const [open, setOpen] = useState(false);

  const spent = storeItems.reduce((s, i) => s + parseFloat(i.price_bought), 0);
  const earned = storeItems
    .filter((i) => i.price_sold)
    .reduce((s, i) => s + parseFloat(i.price_sold!), 0);
  const profit = earned - spent;

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* clickable bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-8 bg-card hover:bg-border/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <span
            className={`transition-transform duration-200 text-text-muted text-xs ${open ? "rotate-90" : ""}`}
          > </span>
          <span className="text-text-primary font-semibold text-m">
            {store}
          </span>
          <span className="text-text-muted text-m">
            {storeItems.length} item{storeItems.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex gap-6 text-m font-semibold">
          {mode === "bought" ? (
            <span className="text-text-muted">
              spent{" "}
              <span className="text-text-primary">${spent.toFixed(2)}</span>
            </span>
          ) : (
            <>
              <span className="text-text-muted">
                earned{" "}
                <span className="text-status-sold">${earned.toFixed(2)}</span>
              </span>
              <span className="text-text-muted">
                profit{" "}
                <span
                  className={profit >= 0 ? "text-status-sold" : "text-red-400"}
                >
                  ${profit.toFixed(2)}
                </span>
              </span>
            </>
          )}
        </div>
      </button>

      {/* dropdown */}
      {open && (
        <div className="border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {storeItems.map((item) => {
              const itemProfit = item.price_sold
                ? (
                    parseFloat(item.price_sold) - parseFloat(item.price_bought)
                  ).toFixed(2)
                : null;

              return (
                <div
                  key={item.id}
                  className="bg-bg border border-border rounded-xl p-4 flex flex-col gap-3"
                >
                  <div>
                    <p className="text-text-primary font-semibold">
                      {item.brand.brand} {item.category}
                    </p>
                    <p className="text-text-muted text-xs">
                      {item.style.style} · {item.size}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border w-fit ${
                      item.status === "sold"
                        ? "text-status-sold border-status-sold bg-status-sold/10"
                        : item.status === "listed"
                          ? "text-status-listed border-status-listed bg-status-listed/10"
                          : "text-status-unlisted border-status-unlisted bg-status-unlisted/10"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-text-muted text-xs uppercase tracking-widest">
                        Bought
                      </p>
                      <p className="text-text-primary font-semibold">
                        ${item.price_bought}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-muted text-xs uppercase tracking-widest">
                        Sold
                      </p>
                      <p className="text-text-primary font-semibold">
                        {item.price_sold ? `$${item.price_sold}` : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-muted text-xs uppercase tracking-widest">
                        Profit
                      </p>
                      <p
                        className={`font-bold ${
                          itemProfit === null
                            ? "text-text-muted"
                            : parseFloat(itemProfit) >= 0
                              ? "text-status-sold"
                              : "text-red-400"
                        }`}
                      >
                        {itemProfit !== null ? `$${itemProfit}` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivitySection({
  title,
  count,
  color,
  children,
}: {
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 mb-3"
      >
        <span
          className={`text-xs transition-transform ${open ? "rotate-90" : ""} ${color}`}
        ></span>
        <h2
          className={`text-xs font-semibold uppercase tracking-widest ${color}`}
        >
          {title} · {count}
        </h2>
        <div className="flex-1 border-t border-border" />
      </button>
      {open && <div className="flex flex-col gap-4">{children}</div>}
    </div>
  );
}

function ItemCalender() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [value, onChange] = useState<Value>(new Date());

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

  if (loading)
    return (
      <div className="text-text-primary text-center py-36">
        <h1 className="text-4xl">Loading...</h1>
      </div>
    );

  // single date select
  const selectedDate = value instanceof Date ? value : new Date();

  const boughtItems = items.filter((i) => sameDay(i.created_at, selectedDate));
  const soldItems = items.filter(
    (i) => i.status === "sold" && sameDay(i.sold_at, selectedDate),
  );

  const groupByStore = (list: Item[]) =>
    list.reduce<Record<string, Item[]>>((acc, item) => {
      const store = item.store?.store ?? "Unknown Store";
      (acc[store] ??= []).push(item);
      return acc;
    }, {});

  const boughtByStore = groupByStore(boughtItems);
  const soldByStore = groupByStore(soldItems);

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full px-10 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 pt-8 lg:pt-16">
          {/* Calendar */}
          <div className="w-full mt-20">
            <div className="mb-4">
              <h1 className="text-text-primary text-xl font-semibold">
                Select a date
              </h1>
              <p className="text-text-muted text-sm mt-1">
                Choose a date to view your activity
              </p>
            </div>

            <div className="calendar-wrapper">
              <Calendar
                onChange={onChange}
                value={value}
                showWeekNumbers
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;

                  const bought = items.some((i) => sameDay(i.created_at, date));
                  const sold = items.some(
                    (i) => i.status === "sold" && sameDay(i.sold_at, date),
                  );
                  if (!bought && !sold) return null;

                  return (
                    <div className="flex justify-center gap-1 mt-1">
                      {bought && (
                        <span className="w-1.5 h-1.5 rounded-full bg-status-listed" />
                      )}
                      {sold && (
                        <span className="w-1.5 h-1.5 rounded-full bg-status-sold" />
                      )}
                    </div>
                  );
                }}
              />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-listed" />{" "}
                Bought
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-sold" />{" "}
                Sold
              </span>
            </div>
          </div>

          {/* Activity */}
          <div className="w-full mt-20">
            <h1 className="text-text-primary text-xl font-semibold mb-9">
              {formattedDate}
            </h1>
            <PeriodSummary items={items} date={selectedDate} />
            {boughtItems.length === 0 && soldItems.length === 0 ? (
              <div className="border border-border rounded-2xl p-10 text-center">
                <p className="text-text-muted">
                  No activity on {formattedDate}.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {boughtItems.length > 0 && (
                  <ActivitySection
                    title="Bought"
                    count={boughtItems.length}
                    color="text-status-listed"
                  >
                    {Object.entries(boughtByStore).map(
                      ([store, storeItems]) => (
                        <StoreRow
                          key={store}
                          store={store}
                          storeItems={storeItems}
                          mode="bought"
                        />
                      ),
                    )}
                  </ActivitySection>
                )}
                {soldItems.length > 0 && (
                  <ActivitySection
                    title="Sold"
                    count={soldItems.length}
                    color="text-status-sold"
                  >
                    {Object.entries(soldByStore).map(([store, storeItems]) => (
                      <StoreRow
                        key={store}
                        store={store}
                        storeItems={storeItems}
                        mode="sold"
                      />
                    ))}
                  </ActivitySection>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCalender;
