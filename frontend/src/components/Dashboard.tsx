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
          <div className=" text-[#bbbcb8]  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10 ">
            <div className="text-lg  flex flex-col text-center gap-4 rounded-xl p-10 bg-[#162416] border-2 border-[#395339] ">
              <h1 className="text-2xl">Invested</h1>
              <h1 className="text-4xl font-bold uppercase tracking-wide">
                ${stats.total_invested}
              </h1>
            </div>
            <div className="text-lg flex flex-col text-center gap-4 bg-[#162416] rounded-xl p-10 border-2 border-[#395339]">
              <h1 className="text-2xl">Total Profit</h1>
              <h1 className="text-4xl font-bold uppercase tracking-wide">
                ${stats.total_revenue}
              </h1>
            </div>
            <div className=" flex flex-col text-center gap-4 bg-[#162416]  rounded-xl p-10 border-2 border-[#395339]">
              <h1 className="text-2xl tracking-wide">Items Sold</h1>
              <p className="text-4xl font-bold uppercase tracking-wide">3</p>
            </div>
            <div className="flex flex-col text-center gap-4 bg-[#162416] rounded-xl p-10 border-2 border-[#395339]">
              <h1 className="text-2xl">Net Profit</h1>
              <p className="text-4xl font-bold uppercase tracking-wide">
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
