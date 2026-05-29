import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/cs.module.css";
import api from "../util/axios";

interface Items {
  id: string;
  name: string;
  price_bought: string;
  price_sold: string;
  store: string | null;
  created_at: string;
}

function Items() {
  const [error, setError] = useState<string | null>(null);
  const [items, setitems] = useState<Items[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchitems() {
      try {
        const { data } = await api.get("/inventory/items");
        console.log(data);
        setitems(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Please login again");
        } else {
          setError("Failed to load items");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchitems();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-36">
        <h1 className="text-4xl">Loading items...</h1>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen px-6">
      <div className="max-w-7xl mx-auto pt-32">
        <h1
          className={`lg:text-9xl text-6xl font-extrabold relative z-1 ${styles.chrome} text-center`}
        >
          {" "}
          Items.
        </h1>
        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}
        <div className="mt-14 space-y-4">
          {items.length === 0 && (
            <div className="text-center text-[#5a6e4a] mt-20">
              No items yet — start by adding your first flip.
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-10  max-w-7xl">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#162416] p-5 mx-auto mt-5 rounded-2xl border border-[#395339] flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-[#d4e8b0]">
                      {item.name}
                    </h2>
                  </div>
                  <div className="text-center">
                    <p className="text-[#5a6e4a] text-xs">Bought</p>
                    <p className="font-semibold text-[#d4e8b0]">
                      ${item.price_bought}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[#5a6e4a] text-xs">Sold</p>
                    <p className="font-semibold text-[#d4e8b0]">
                      ${item.price_sold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#5a6e4a]">Status</p>

                    <p
                      className={
                        Number(item.price_sold) > Number(item.price_bought)
                          ? "text-green-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      {Number(item.price_sold) > Number(item.price_bought)
                        ? "Profit"
                        : "Loss"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-10 p-10 text-center">
        <Link
          to="/additem"
          className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b3d] transition-all"
        >
          Add New Item
        </Link>
      </div>
    </div>
  );
}
export default Items;
