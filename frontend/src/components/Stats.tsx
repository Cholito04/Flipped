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
  avg_profit_per_item: number;
  best_brand: string | null;
  best_brand_avg_profit: number | null;
  best_brand_total_sold: number | null;
  best_style: string | null;
  best_style_avg_profit: number | null;
  best_style_total_sold: number | null;
  best_store: string | null;
  best_store_avg_profit: number | null;
  best_store_total_sold: number | null;
}

function Stats() {
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

  const sectionHeader = (title: string) => (
    <div className="flex items-center gap-4 mb-4 mt-8">
      <h2 className="text-text-muted text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 border-t border-border" />
    </div>
  );

  const insightCard = (
    label: string,
    name: string | null,
    avgProfit: number | null,
    totalSold: number | null,
    emptyMsg: string,
  ) => (
    <div className={`${cardClass} text-left gap-3`}>
      <p className={labelClass}>{label}</p>
      {name ? (
        <>
          <p className="text-text-primary text-2xl font-black">{name}</p>
          <p className="text-text-muted text-xs">
            avg profit{" "}
            <span
              className={`font-bold ${avgProfit && avgProfit >= 0 ? "text-status-sold" : "text-red-400"}`}
            >
              ${avgProfit?.toFixed(2)}
            </span>
            {" · "}
            <span className="text-text-primary font-semibold">
              {totalSold} sales
            </span>
          </p>
        </>
      ) : (
        <p className="text-text-muted text-sm">{emptyMsg}</p>
      )}
    </div>
  );
  return (
    <div className="mx-auto p-10">
      <h1
        className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${styles.chrome}`}
      >
        Stats
      </h1>

      {error && (
        <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
      )}

      {stats && (
        <div className="mt-10">
          {/* Inventory */}
          {sectionHeader("Inventory")}
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
          {sectionHeader("Financials")}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={cardClass}>
              <p className={labelClass}>Total Invested</p>
              <p className={valueClass}>${stats.total_invested}</p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Total Revenue</p>
              <p className={valueClass}>${stats.total_revenue}</p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Avg Profit / Item</p>
              <p
                className={`text-4xl font-black ${stats.avg_profit_per_item >= 0 ? "text-status-sold" : "text-red-400"}`}
              >
                ${stats.avg_profit_per_item}
              </p>
            </div>
            <div className={cardClass}>
              <p className={labelClass}>Net Profit</p>
              <p
                className={`text-4xl font-black ${stats.total_profit >= 0 ? "text-status-sold" : "text-red-400"}`}
              >
                ${stats.total_profit}
              </p>
            </div>
          </div>

          {/* Performance */}
          {sectionHeader("Performance")}
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

          {/* Insights */}
          {sectionHeader("Insights")}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {insightCard(
              "Best Brand",
              stats.best_brand,
              stats.best_brand_avg_profit,
              stats.best_brand_total_sold,
              "Need 2+ sales of same brand",
            )}
            {insightCard(
              "Best Style",
              stats.best_style,
              stats.best_style_avg_profit,
              stats.best_style_total_sold,
              "Need 2+ sales of same style",
            )}
            {insightCard(
              "Best Store",
              stats.best_store,
              stats.best_store_avg_profit,
              stats.best_store_total_sold,
              "Need 2+ sales from same store",
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;
