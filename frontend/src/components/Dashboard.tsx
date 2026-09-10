import styles from "../styles/cs.module.css";
import { useState, useEffect } from "react";
import api from "../util/axios";

interface stats {
  total_invested: number;
  total_revenue: number;
  total_profit: number;
  items_sold: number;
  total_items: number;
  sell_through_rate: number;
  avg_sell_days: number | null;
}

function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get("/inventory/stats");
        setStats(data);
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? "Please login again"
            : "Failed to load stats",
        );
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  const cardClass =
    "flex flex-col text-center gap-2 bg-card border border-border rounded-2xl p-6";
  const labelClass =
    "text-green-primary text-xs font-semibold uppercase tracking-widest";
  const valueClass = "text-text-primary text-4xl font-black";
  return (
    <div className="mx-auto p-10">
      <h1
        className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${styles.chrome}`}
      >
        Dashboard
      </h1>

      {error && (
        <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
      )}

      {stats && (
        <div className="mt-10">
          {/* Inventory */}
          <div className="flex items-center gap-4 mb-4  mt-5">
            <h2 className="text-text-muted text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
              Inventory
            </h2>
            <div className="flex-1 border-t border-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className={cardClass}>
              <p className={labelClass}>Total Items</p>
              <p className={valueClass}>{stats.total_items}</p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Items Sold</p>
              <p className={valueClass}>{stats.items_sold}</p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Sell Rate</p>
              <p className={valueClass}>{stats.sell_through_rate}%</p>
            </div>
          </div>

          {/* Financials */}
          <div className="flex items-center gap-4 mb-4  mt-5">
            <h2 className="text-text-muted text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
              Financials
            </h2>
            <div className="flex-1 border-t border-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={cardClass}>
              <p className={labelClass}>Total Invested</p>
              <p className={valueClass}>${stats.total_invested}</p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Total Revenue</p>
              <p className={valueClass}>${stats.total_revenue}</p>
            </div>
            <div className={`${cardClass} sm:col-span-2`}>
              <p className={labelClass}>Net Profit</p>
              <p
                className={`text-4xl font-black ${stats.total_profit >= 0 ? "text-status-sold" : "text-red-400"}`}
              >
                ${stats.total_profit}
              </p>
            </div>
          </div>

          {/* Performance */}
          <div className="flex items-center gap-4 mb-4  mt-5">
            <h2 className="text-text-muted text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
              Performance
            </h2>
            <div className="flex-1 border-t border-border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={cardClass}>
              <p className={labelClass}>Avg Sell Time</p>
              <p className={valueClass}>
                {stats.avg_sell_days !== null ? `${stats.avg_sell_days}d` : "—"}
              </p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Unsold Items</p>
              <p className={valueClass}>
                {stats.total_items - stats.items_sold}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
