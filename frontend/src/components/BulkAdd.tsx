import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../util/axios";
import InlineAdd from "../util/InlineAdd";

interface Brand { id: number; brand: string; }
interface Style { id: number; style: string; }
interface Store { id: number; store: string; }
interface Row {
  key: number;
  brand_id: string;
  style_id: string;
  size: string;
  category: string;
}

function BulkAdd() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState("");
  const [status, setStatus] = useState("not_listed");
  const [totalPaid, setTotalPaid] = useState("");

  const keyRef = useRef(1);
  const newRow = (from?: Row): Row => ({
    key: keyRef.current++,
    brand_id: from?.brand_id ?? "",
    style_id: from?.style_id ?? "",
    size: from?.size ?? "M",
    category: from?.category ?? "hoodie",
  });
  const [rows, setRows] = useState<Row[]>(() => [newRow()]);

  useEffect(() => {
    async function load() {
      try {
        const [b, s, st] = await Promise.all([
          api.get("/inventory/brands"),
          api.get("/inventory/styles"),
          api.get("/inventory/stores"),
        ]);
        setBrands(b.data);
        setStyles(s.data);
        setStores(st.data);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  // new rows copy the previous row, so a bin of similar items is quick to fill
  function setCount(n: number) {
    const count = Math.max(1, Math.min(500, n || 1));
    setRows((prev) =>
      count > prev.length
        ? [...prev, ...Array.from({ length: count - prev.length }, () => newRow(prev[prev.length - 1]))]
        : prev.slice(0, count),
    );
  }

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }

  function fillFromFirst() {
    setRows((prev) => prev.map((r) => ({ ...prev[0], key: r.key })));
  }

  const perItem =
    totalPaid !== "" && Number(totalPaid) >= 0
      ? (Number(totalPaid) / rows.length).toFixed(2)
      : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!storeId) return setError("Pick a store");
    if (totalPaid === "") return setError("Enter the total you paid");
    if (rows.some((r) => !r.brand_id || !r.style_id))
      return setError("Every item needs a brand and a style");

    try {
      await api.post("/inventory/items/bulk", {
        store_id: Number(storeId),
        status,
        total_price: totalPaid,
        items: rows.map(({ brand_id, style_id, size, category }) => ({
          brand_id: Number(brand_id),
          style_id: Number(style_id),
          size,
          category,
        })),
      });
      navigate("/items");
    } catch (err: any) {
      setError(err.response?.data?.detail ?? "Failed to create items");
      console.error(err);
    }
  }

  const inputClass =
    "bg-card border border-border text-text-primary rounded-full px-5 py-3 w-full focus:outline-none focus:border-green-hover focus:ring-1 focus:ring-green-hover/30 placeholder-text-muted transition-all";
  const labelClass = "text-text-muted text-xs font-semibold uppercase tracking-widest px-4";
  const sectionHeaderClass =
    "text-text-muted text-xs font-semibold uppercase tracking-widest border-b border-border-dark mb-5 pb-2";

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen">
        <div className="pt-24">
          <div className="bg-green-primary text-center px-8 py-8 border-b border-border">
            <h1 className="text-5xl font-black text-silver-primary tracking-wide">BULK ADD</h1>
            <p className="text-silver-primary text-sm mt-2">Wholesale lots and bins priced by weight</p>
          </div>

          <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-10 text-text-primary">
            {/* Shared details */}
            <div>
              <h2 className={sectionHeaderClass}>Purchase</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Store</label>
                  <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className={inputClass}>
                    <option value="" disabled>Select a store</option>
                    {stores.map((s) => <option key={s.id} value={s.id}>{s.store}</option>)}
                  </select>
                  <InlineAdd
                    label="Store"
                    onAdd={async (value) => {
                      try {
                        const { data } = await api.post("/inventory/stores", { store: value });
                        setStores((prev) => [...prev, data]);
                      } catch (err) { console.error(err); }
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                    <option value="not_listed">Not Listed</option>
                    <option value="listed">Listed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Total Paid</label>
                  <input
                    type="number" step="0.01" min="0"
                    value={totalPaid}
                    onChange={(e) => setTotalPaid(e.target.value)}
                    placeholder="16.00"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Number of Items</label>
                  <input
                    type="number" min="1" max="500"
                    value={rows.length}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>

                {perItem && (
                  <p className="col-span-2 text-center text-text-muted text-sm">
                    ≈ <span className="text-text-primary font-semibold">${perItem}</span> per item
                  </p>
                )}
              </div>
            </div>

            {/* Item rows */}
            <div>
              <div className="flex items-center justify-between border-b border-border-dark mb-5 pb-2">
                <h2 className="text-text-muted text-xs font-semibold uppercase tracking-widest">
                  Items · {rows.length}
                </h2>
                <button
                  type="button"
                  onClick={fillFromFirst}
                  className="text-xs text-green-primary hover:text-green-hover transition-all"
                >
                  Copy item 1 to all
                </button>
              </div>

              <div className="flex gap-6 mb-5 text-sm">
                <InlineAdd
                  label="Brand"
                  onAdd={async (value) => {
                    try {
                      const { data } = await api.post("/inventory/brands", { brand: value });
                      setBrands((prev) => [...prev, data]);
                    } catch (err) { console.error(err); }
                  }}
                />
                <InlineAdd
                  label="Style"
                  onAdd={async (value) => {
                    try {
                      const { data } = await api.post("/inventory/styles", { style: value });
                      setStyles((prev) => [...prev, data]);
                    } catch (err) { console.error(err); }
                  }}
                />
              </div>

              <div className="flex flex-col gap-4">
                {rows.map((row, i) => (
                  <div key={row.key} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-muted text-xs font-semibold uppercase tracking-widest">
                        Item {i + 1}
                      </span>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.key)}
                          className="text-text-muted hover:text-red-400 text-sm transition-all"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <select value={row.category} onChange={(e) => updateRow(row.key, { category: e.target.value })} className={inputClass}>
                        {["hoodie", "shirt", "pants", "jacket", "shoes"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <select value={row.brand_id} onChange={(e) => updateRow(row.key, { brand_id: e.target.value })} className={inputClass}>
                        <option value="" disabled>Brand</option>
                        {brands.map((b) => <option key={b.id} value={b.id}>{b.brand}</option>)}
                      </select>
                      <select value={row.style_id} onChange={(e) => updateRow(row.key, { style_id: e.target.value })} className={inputClass}>
                        <option value="" disabled>Style</option>
                        {styles.map((s) => <option key={s.id} value={s.id}>{s.style}</option>)}
                      </select>
                      <select value={row.size} onChange={(e) => updateRow(row.key, { size: e.target.value })} className={inputClass}>
                        {["XS", "S", "M", "L", "XL", "XXL"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCount(rows.length + 1)}
                className="mt-4 w-full border border-dashed border-border text-text-muted hover:text-text-primary hover:border-green-hover rounded-2xl py-3 text-sm transition-all"
              >
                + Add another item
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-green-primary text-silver-primary py-4 rounded-full font-black text-lg hover:bg-green-hover transition-all"
              >
                Add {rows.length} Item{rows.length !== 1 ? "s" : ""}
              </button>
              <Link to="/additem" className="text-center text-text-muted hover:text-text-primary text-sm transition-all">
                Adding a single item instead?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default BulkAdd;