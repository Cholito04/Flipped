import styles from "../styles/cs.module.css";
import { useState, useEffect } from "react";
import api from "../util/axios";

interface stats {
  total_invested: number;
  total_revenue: number;
  total_profit: number;
  items_sold: number;
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
        console.log(data);
        setStats(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Please login again");
        } else {
          setError("Failed to load stats");
        }
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-text-primary">
            <div className="flex flex-col text-center gap-2 bg-card border border-border rounded-4xl p-6">
              <p className="text-green-primary text-m font-semibold uppercase tracking-widest">
                Total Invested
              </p>
              <p className="text-text-primary text-4xl font-black">
                ${stats.total_invested}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-center bg-card border border-border rounded-4xl p-6">
              <p className="text-green-primary text-m font-semibold uppercase tracking-widest">
                Total Revenue
              </p>
              <p className="text-text-primary text-4xl font-black">
                ${stats.total_revenue}
              </p>
            </div>

            <div className="flex flex-col text-center gap-2 bg-card border border-border rounded-4xl p-6">
              <p className="text-green-primary text-m font-semibold uppercase tracking-widest">
                Items Sold
              </p>
              <p className="text-text-primary text-4xl font-black">
                {stats.items_sold}
              </p>
            </div>

            <div className="flex flex-col text-center gap-2 bg-card border border-border rounded-4xl p-6">
              <p className="text-green-primary text-m font-semibold uppercase tracking-widest">
                Net Profit
              </p>
              <p
                className={`text-4xl font-black ${stats.total_profit >= 0 ? "text-status-sold" : "text-red-400"}`}
              >
                ${stats.total_profit}
              </p>
            </div>

            <div className="flex flex-col text-center gap-2 bg-card border border-border rounded-4xl p-6">
              <p className="text-green-primary text-m font-semibold uppercase tracking-widest">
                Sell Rate
              </p>
              <p className="text-text-primary text-4xl font-black">
                {stats.sell_through_rate}%
              </p>
            </div>

            <div className="flex flex-col text-center gap-2 bg-card border border-border rounded-4xl p-6">
              <p className="text-green-primary text-m font-semibold uppercase tracking-widest">
                Avg Sell Time
              </p>
              <p className="text-text-primary text-4xl font-black">
                {stats.avg_sell_days !== null ? `${stats.avg_sell_days}d` : "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
