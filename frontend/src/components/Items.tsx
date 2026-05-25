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
    <div className="w-full min-h-screen pl-10">
      <div className="mx-auto pt-40">
        <h1
          className={`lg:text-9xl text-6xl font-extrabold relative z-1 ${styles.chrome}`}
        >
          {" "}
          Items.
        </h1>
        {error && <p className="text-red-400 text-center text-xl">{error}</p>}
        <div>
          {items.length > 0 && (
            <div className="mt-10">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#1b1b1b] p-5 rounded-2xl border border-gray-700"
                >
                  <h2 className="text-2xl font-bold text-white">{item.name}</h2>

                  <div className="mt-4 text-gray-200">
                    <p>Price Bought: ${item.price_bought}</p>
                    <p>Price Sold: ${item.price_sold}</p>
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
