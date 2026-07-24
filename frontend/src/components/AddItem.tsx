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
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Clear previous errors

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
      navigate("/items", {
        state: { success: "Item added!" },
      });
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen justify-center bg-[#090d09]">
        <div className="pt-24">
          {/* Header */}
          <div className="bg-[#8aaa62] text-center px-8 py-8 border-b border-[#1e2a1e]">
            <h1 className="text-5xl font-black text-[#1e2a1e] tracking-wide">
              ADD ITEM
            </h1>

            <p className="text-[#1e2a1e] text-sm mt-2">
              Track your latest flip
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto px-8 py-10 flex flex-col gap-10">
            {" "}
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8aaa62] border-b border-[#1e2a1e] pb-3">
                Item Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Item Name
                  </label>

                  <input
                    name="name"
                    placeholder="Vintage Jacket"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none focus:border-[#6aaa4a] focus:ring-1 focus:ring-[#4a8a4a]/30 placeholder-[#3a5a3a] transition-all"
                    required
                  />
                </div>
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    name="cat"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                  >
                    <option value="hoodie">Hoodie</option>
                    <option value="shirt">Shirt</option>
                    <option value="pants">Pants</option>
                    <option value="jacket">Jacket</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>
                {/* Brand */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Brand
                  </label>

                  <select
                    name="brand"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                  >
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
                {/* Stlye */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Style
                  </label>

                  <select
                    name="style"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                  >
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
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8aaa62] border-b border-[#1e2a1e] pb-3">
                Size & Status
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {" "}
                {/* Size */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Size
                  </label>

                  <select
                    name="size"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Status
                  </label>
                  <select
                    name="status"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                  >
                    <option value="not_listed">Not Listed</option>
                    <option value="listed">Listed</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8aaa62] border-b border-[#1e2a1e] pb-3">
                Pricing
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Bought Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Purchase Price
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="price_bought"
                    placeholder="25.00"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none focus:border-[#6aaa4a] focus:ring-1 focus:ring-[#4a8a4a]/30 placeholder-[#3a5a3a] transition-all"
                    required
                  />
                </div>
                {/* Sold Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                    Sold Price{" "}
                    <span className="normal-case tracking-normal font-normal text-[#3a5a3a]">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="price_sold"
                    placeholder="Add when sold"
                    className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none focus:border-[#6aaa4a] focus:ring-1 focus:ring-[#4a8a4a]/30 placeholder-[#3a5a3a] transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-3 mt-2">
              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#8aaa62] text-[#1e2a1e] py-4 rounded-full font-black text-lg hover:bg-[#b7d592] transition-all"
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
