import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../util/axios";

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

  async function addBrand() {
    const brand = prompt("Enter brand name");

    if (!brand) return;

    try {
      const { data } = await api.post("/inventory/brands", {
        brand,
      });

      setBrands((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  }
  async function addStyle() {
    const style = prompt("Enter style");

    if (!style) return;

    try {
      const { data } = await api.post("/inventory/styles", {
        style,
      });
      setStyles((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen flex items-center justify-center bg-[#090d09] px-4">
        <div className="bg-[#111811] border border-[#1e2a1e] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="bg-[#2a4a2a] text-center px-8 py-8 border-b border-[#1e2a1e]">
            <h1 className="text-4xl font-black text-[#d4e8b0] tracking-wide">
              ADD ITEM
            </h1>

            <p className="text-[#7d9267] text-sm mt-2">
              Track your latest flip
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-10 flex flex-col gap-6">
            {/* Item Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">
                Item Name
              </label>

              <input
                name="name"
                placeholder="Vintage Jacket"
                className="
                bg-[#0b100b]
                border border-[#1e2a1e]
                text-[#d4e8b0]
                rounded-xl
                px-4
                py-3
                w-full
                focus:outline-none
                focus:border-[#4d7a4d]
                focus:ring-2
                focus:ring-[#2f522f]/40
                transition-all
                placeholder-[#3a4a3a]
              "
                required
              />
            </div>
            {/* Brand */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">
                Brand
              </label>

              <select
                name="brand"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full"
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brand}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addBrand}
                  className="text-sm text-[#8aaa62] hover:text-[#d4e8b0]"
                >
                  + Add Brand
                </button>
              </div>
            </div>
            {/* Stlye */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">
                Style
              </label>

              <select
                name="style"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full"
              >
                {styles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.style}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addStyle}
                  className="text-sm text-[#8aaa62] hover:text-[#d4e8b0]"
                >
                  + Add Style
                </button>
              </div>
            </div>
            {/* Size */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">size</label>

              <select
                name="size"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">
                Category
              </label>
              <select
                name="cat"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full"
              >
                <option value="hoodie">Hoodie</option>
                <option value="shirt">Shirt</option>
                <option value="pants">Pants</option>
                <option value="jacket">Jacket</option>
                <option value="shoes">Shoes</option>
              </select>
            </div>
            {/* Bought Price */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">
                Purchase Price
              </label>

              <input
                type="number"
                step="0.01"
                name="price_bought"
                placeholder="25.00"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
                required
              />
            </div>

            {/* Sold Price */}
            <div className="flex flex-col gap-2">
              <label className="text-[#7d9267] text-sm font-medium">
                Sold Price
              </label>

              <input
                type="number"
                step="0.01"
                name="price_sold"
                placeholder="Add when sold"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
              />
            </div>
            <select
              name="status"
              className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full"
            >
              <option value="not_listed">Not Listed</option>
              <option value="listed">Listed</option>
              <option value="sold">Sold</option>
            </select>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b3d] transition-all mt-2">
              Add Item
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
export default AddItem;
