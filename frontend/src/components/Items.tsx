import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "../styles/cs.module.css";
import api from "../util/axios";
import ItemMenu from "./ItemMenu";
import EditItemModel from "../util/EditItemModel";

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
  sell_time_days: number | null;
}

function Items() {
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // initial load for brands/styles — runs once
  useEffect(() => {
    async function fetchMeta() {
      try {
        const [brandsRes, stylesRes, storeRes] = await Promise.all([
          api.get("/inventory/brands"),
          api.get("/inventory/styles"),
          api.get("/inventory/stores"),
        ]);
        setBrands(brandsRes.data);
        setStyles(stylesRes.data);
        setStores(storeRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMeta();
  }, []);

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

  async function handleMarkSold(id: number) {
    try {
      const { data } = await api.patch(`/inventory/items/${id}`, {
        status: "sold",
      });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
      );
    } catch {
      setError("Failed to update item");
    }
  }

  function handleSave(updated: any) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updated.id ? { ...item, ...updated } : item,
      ),
    );
  }

  async function handleMarkListed(id: number) {
    try {
      const { data } = await api.patch(`/inventory/items/${id}`, {
        status: "listed",
      });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
      );
    } catch {
      setError("Failed to update item");
    }
  }
  async function handleDelete(id: number) {
    try {
      await api.delete(`/inventory/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete item");
    }
  }

  function handleEdit(id: number) {
    setEditingItem(items.find((i) => i.id === id) || null);
  }

  function getProfit(item: Item): string | null {
    if (!item.price_sold) return null;
    const profit = parseFloat(item.price_sold) - parseFloat(item.price_bought);
    return profit.toFixed(2);
  }

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
            {items.map((item) => {
              const profit = getProfit(item);
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-text-primary font-bold text-lg leading-tight">
                        {item.brand.brand} {item.category}
                      </p>
                      <p className="text-text-muted text-sm">
                        {item.style.style}
                      </p>
                    </div>
                    <ItemMenu
                      itemId={item.id}
                      status={item.status}
                      onDelete={handleDelete}
                      onMarkSold={handleMarkSold}
                      onMarkListed={handleMarkListed}
                      onEdit={handleEdit}
                    />
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

                  <div className="flex justify-between items-end border-t border-border pt-3">
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
                        className={`font-bold ${profit === null ? "text-text-muted" : parseFloat(profit) >= 0 ? "text-status-sold" : "text-red-400"}`}
                      >
                        {profit !== null ? `$${profit}` : "—"}
                      </p>
                    </div>
                  </div>

                  {item.status === "sold" && item.sell_time_days !== null && (
                    <p className="text-text-muted text-xs">
                      Sold in{" "}
                      <span className="text-status-sold font-semibold">
                        {item.sell_time_days}d
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 p-10 text-center">
        <Link
          to="/additem"
          className="bg-green-primary text-text-primary border border-green-hover px-6 py-3 rounded-xl font-semibold hover:bg-green-hover transition-all"
        >
          Add New Item
        </Link>
      </div>

      {editingItem && (
        <EditItemModel
          item={editingItem}
          brands={brands}
          styles={styles}
          stores={stores}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
export default Items;
