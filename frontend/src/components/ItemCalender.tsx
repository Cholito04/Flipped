import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calander.css";
import style from "../styles/cs.module.css";
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

function DayRow({ date, dayItems }: { date: string; dayItems: Item[] }) {
  const [open, setOpen] = useState(false);

  const spent = dayItems.reduce(
    (sum, i) => sum + parseFloat(i.price_bought),
    0,
  );
  const earned = dayItems
    .filter((i) => i.status === "sold" && i.price_sold)
    .reduce((sum, i) => sum + parseFloat(i.price_sold!), 0);
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
          >
            <h1></h1>
          </span>
          <span className="text-text-primary font-semibold text-m">{date}</span>
          <span className="text-text-muted text-m">
            {dayItems.length} item{dayItems.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex gap-6 text-m font-semibold">
          <span className="text-text-muted">
            spent <span className="text-text-primary">${spent.toFixed(2)}</span>
          </span>
          {earned > 0 && (
            <span className="text-text-muted">
              earned{" "}
              <span className="text-status-sold">${earned.toFixed(2)}</span>
            </span>
          )}
          <span className="text-text-muted">
            profit{" "}
            <span
              className={
                profit >= 0 && earned > 0
                  ? "text-status-sold"
                  : "text-status-unlisted"
              }
            >
              ${profit.toFixed(2)}
            </span>
          </span>
        </div>
      </button>

      {/* dropdown */}
      {open && (
        <div className="border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {dayItems.map((item) => {
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

  const selectedItems = items.filter((item) => {
    const itemDate = new Date(item.created_at);

    return (
      itemDate.getFullYear() === selectedDate.getFullYear() &&
      itemDate.getMonth() === selectedDate.getMonth() &&
      itemDate.getDate() === selectedDate.getDate()
    );
  });

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full min-h-screen px-6 grid grid-cols-2">
      <div className="Sample">
        <header>
          <h1 className="text-text-primary">Select a date</h1>
        </header>

        <div className="Sample__container">
          <main className="Sample__container__content">
            <Calendar onChange={onChange} value={value} showWeekNumbers />
          </main>
        </div>
      </div>

      <div className="mx-auto pt-20">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${style.chrome}`}
        >
          Activity
        </h1>

        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}

        <div className="mt-14">
          {selectedItems.length > 0 ? (
            <DayRow date={formattedDate} dayItems={selectedItems} />
          ) : (
            <div className="border border-border rounded-2xl p-10 text-center">
              <p className="text-text-muted">No activity on {formattedDate}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCalender;
