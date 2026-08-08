import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../util/axios";
import InlineAdd from "../util/InlineAdd";

interface Brand {
  id: number;
  brand: string;
}

interface Style {
  id: number;
  style: string;
}

function AddItem() {
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const brand_id = formData.get("brand");
    const style_id = formData.get("style");
    const size = formData.get("size") as string;
    const category = formData.get("cat") as string;
    const price_bought = formData.get("price_bought") as string;
    const price_sold = formData.get("price_sold") as string;
    const status = formData.get("status") as string;

    try {
      await api.post("/inventory/items", {
        name,
        brand_id,
        style_id,
        size,
        category,
        price_bought,
        price_sold,
        status,
      });
      navigate("/items", { state: { success: "Item added!" } });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Please login first");
        navigate("/login");
      } else {
        setError("Failed to create item");
      }
      console.error(err);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const brandsRes = await api.get("/inventory/brands");
        const stylesRes = await api.get("/inventory/styles");
        setBrands(brandsRes.data);
        setStyles(stylesRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const inputClass =
    "bg-card border border-border text-text-primary rounded-full px-5 py-3 w-full focus:outline-none focus:border-green-hover focus:ring-1 focus:ring-green-hover/30 placeholder-text-muted transition-all";
  const labelClass =
    "text-text-muted text-xs font-semibold uppercase tracking-widest";
  const sectionHeaderClass =
    "text-text-muted text-xs font-semibold uppercase tracking-widest border-b border-border-dark pb-3";

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen justify-center">
        <div className="pt-24">
          {/* Header */}
          <div className="bg-green-primary text-center px-8 py-8 border-b border-border">
            <h1 className="text-5xl font-black text-silver-primary tracking-wide">
              ADD ITEM
            </h1>
            <p className="text-silver-primary text-sm mt-2">
              Track your latest flip
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto px-8 py-10 flex flex-col gap-10 text-text-primary">
            {/* Item Details */}
            <div className="flex flex-col gap-6">
              <h2 className={sectionHeaderClass}>Item Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Item Name</label>
                  <input
                    name="name"
                    placeholder="Vintage Jacket"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Category</label>
                  <select name="cat" className={inputClass}>
                    <option value="hoodie">Hoodie</option>
                    <option value="shirt">Shirt</option>
                    <option value="pants">Pants</option>
                    <option value="jacket">Jacket</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Brand</label>
                  <select name="brand" className={inputClass}>
                    <option value="" disabled>
                      Select a brand
                    </option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brand}
                      </option>
                    ))}
                  </select>
                  <InlineAdd
                    label="Brand"
                    onAdd={async (value) => {
                      try {
                        const { data } = await api.post("/inventory/brands", {
                          brand: value,
                        });
                        setBrands((prev) => [...prev, data]);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Style</label>
                  <select name="style" className={inputClass}>
                    <option value="" disabled>
                      Select a style
                    </option>
                    {styles.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.style}
                      </option>
                    ))}
                  </select>
                  <InlineAdd
                    label="Style"
                    onAdd={async (value) => {
                      try {
                        const { data } = await api.post("/inventory/styles", {
                          style: value,
                        });
                        setStyles((prev) => [...prev, data]);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Size & Status */}
            <div className="flex flex-col gap-6">
              <h2 className={sectionHeaderClass}>Size & Status</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Size</label>
                  <select name="size" className={inputClass}>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Status</label>
                  <select name="status" className={inputClass}>
                    <option value="not_listed">Not Listed</option>
                    <option value="listed">Listed</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-6">
              <h2 className={sectionHeaderClass}>Pricing</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Purchase Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price_bought"
                    placeholder="25.00"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Sold Price{" "}
                    <span className="normal-case tracking-normal font-normal text-text-muted">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price_sold"
                    placeholder="Add when sold"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
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
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddItem;
