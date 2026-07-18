import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/cs.module.css";
import api from "../util/axios";
import ItemMenu from "./ItemMenu";

interface Brand {
  id: number;
  brand: string;
}

interface Style {
  id: number;
  style: string;
}

interface Item {
  id: number;
  name: string;
  brand: Brand;
  style: Style;
  size: string;
  category: string;
  status: string;
  price_bought: string;
  price_sold: string | null;
  created_at: string;
}

function Items() {
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleDelete(id: number) {
    try {
      await api.delete(`/inventory/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete item");
    }
  }
  useEffect(() => {
    async function fetchitems() {
      try {
        const { data } = await api.get("/inventory/items");
        console.log(data);
        setItems(data);
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
      <div className="max-w-500 mx-auto pt-20">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${styles.chrome}`}
        >
          {" "}
          Items
        </h1>
        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}
        <div className="mt-14 space-y-3">
          {items.length === 0 && (
            <div className="text-center text-[#5a6e4a] mt-20">
              No items yet — start by adding your first flip.
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-10  max-w-500">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#162416] p-5 mx-auto mt-5 rounded-2xl border border-[#395339] flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-[#d4e8b0]">
                      {item.name}
                    </h2>
                  </div>
                  <div className="text-center">
                    <p className="text-[#5a6e4a] text-xs">Brand</p>
                    <p className="font-semibold text-[#d4e8b0]">
                      {item.brand.brand}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#5a6e4a] text-xs">Style</p>
                    <p className="font-semibold text-[#d4e8b0]">
                      {item.style.style}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#5a6e4a] text-xs">Size</p>
                    <p className="font-semibold text-[#d4e8b0]">{item.size}</p>
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
                      {item.price_sold ? `$${item.price_sold}` : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#5a6e4a]">Status</p>

                    <p
                      className={`text-center font-semibold ${
                        item.status === "sold"
                          ? "text-[#8aaa62]"
                          : item.status === "listed"
                            ? "text-yellow-400"
                            : "text-[#da7373]"
                      }`}
                    >
                      {item.status}
                    </p>
                  </div>
                  <ItemMenu itemId={item.id} onDelete={handleDelete} />
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
