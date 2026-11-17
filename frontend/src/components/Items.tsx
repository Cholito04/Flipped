import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "../styles/cs.module.css";
import api from "../util/axios";
import { useItemActions } from "../util/useItemActions";

import type { Item } from "../util/Types";
import ItemCard from "../util/ItemCard";

function Items() {
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { menu, modal } = useItemActions(setItems, setError);
  // items fetch — reruns when filters change
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const itemsRes = await api.get("/inventory/items", {
          params: {
            ...(statusFilter && { status: statusFilter }),
            ...(categoryFilter && { category: categoryFilter }),
          },
        });
        setItems(itemsRes.data);
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? "Please login again"
            : "Failed to load items",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [statusFilter, categoryFilter]);

  if (loading) {
    return (
      <div className="text-text-primary text-center py-36">
        <h1 className="text-4xl">Loading items...</h1>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen px-6">
      <div className="mx-auto pt-20">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${style.chrome}`}
        >
          Items
        </h1>

        {/* filters */}
        <div className="flex gap-3 mt-8 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card border border-border text-text-primary rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-hover"
          >
            <option value="">All Statuses</option>
            <option value="not_listed">Not Listed</option>
            <option value="listed">Listed</option>
            <option value="sold">Sold</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-card border border-border text-text-primary rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-hover"
          >
            <option value="">All Categories</option>
            <option value="hoodie">Hoodie</option>
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="jacket">Jacket</option>
            <option value="shoes">Shoes</option>
          </select>
          {(statusFilter || categoryFilter) && (
            <button
              onClick={() => {
                setStatusFilter("");
                setCategoryFilter("");
              }}
              className="text-text-muted hover:text-red-400 text-sm px-4 py-2 transition-all"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 text-center text-red-400 text-lg">{error}</div>
        )}

        <div className="mt-10">
          {items.length === 0 && (
            <div className="text-center text-text-muted mt-20">
              No items yet — start by adding your first flip.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} actions={menu(item)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 p-10">
        <div className="flex gap-10 items-center justify-center">
          <Link
            to="/additem"
            className="bg-green-primary text-text-primary border border-green-hover px-6 py-3 rounded-xl font-semibold hover:bg-green-hover transition-all"
          >
            Add New Item
          </Link>

          <Link
            to="/bulkadd"
            className="bg-green-primary text-text-primary border border-green-hover px-6 py-3 rounded-xl font-semibold hover:bg-green-hover transition-all"
          >
            Bulk Add Items
          </Link>
        </div>
        {modal}
      </div>
    </div>
  );
}
export default Items;
