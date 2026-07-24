import styles from "../styles/cs.module.css";
import { useState, useEffect } from "react";
import api from "../util/axios";

interface stats {
  total_invested: number;
  total_revenue: number;
  total_profit: number;
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
      <div className="mx-auto p-10 ">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${styles.chrome}`}
        >
          Dashboard
        </h1>
        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}
        {stats && (
          <div className=" text-[#bbbcb8]  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10 ">
            <div className="flex flex-col text-center gap-2 bg-[#141c14] border border-[#2e4a2e] rounded-4xl p-6">
              <p className="text-[#8aaa62] text-m font-semibold uppercase tracking-widest">
                Total Invested
              </p>
              <p className="text-[#d4e8b0] text-4xl font-black">
                ${stats.total_invested}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-center bg-[#141c14] border border-[#2e4a2e] rounded-4xl p-6">
              <p className="text-[#8aaa62] text-m font-semibold uppercase tracking-widest">
                Total Revenue
              </p>
              <p className="text-[#d4e8b0] text-4xl font-black">
                ${stats.total_revenue}
              </p>
            </div>

            <div className="flex flex-col text-center gap-2 bg-[#141c14] border border-[#2e4a2e] rounded-4xl p-6">
              <p className="text-[#8aaa62] text-m font-semibold uppercase tracking-widest">
                Items Sold
              </p>
              <p className="text-[#d4e8b0] text-4xl font-black">—</p>
            </div>

            <div className="flex flex-col text-center gap-2 bg-[#141c14] border border-[#2e4a2e] rounded-4xl p-6">
              <p className="text-[#8aaa62] text-m font-semibold uppercase tracking-widest">
                Net Profit
              </p>
              <p
                className={`text-4xl font-black ${stats.total_profit >= 0 ? "text-[#8aaa62]" : "text-red-400"}`}
              >
                ${stats.total_profit}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
