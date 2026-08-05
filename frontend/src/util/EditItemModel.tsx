import { useState } from "react";
import api from "../util/axios";

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
  brand: Brand;
  style: Style;
  size: string;
  category: string;
  price_bought: number | string;
  price_sold?: number | string | null;
  status: string;
}

function EditItemModal({
  item,
  brands,
  styles,
  onClose,
  onSave,
}: {
  item: Item;
  brands: Brand[];
  styles: Style[];
  onClose: () => void;
  onSave: (updated: Item) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      size: formData.get("size") as string,
      category: formData.get("cat") as string,
      price_bought: formData.get("price_bought") as string,
      price_sold: (formData.get("price_sold") as string) || null,
      status: formData.get("status") as string,
      brand_id: Number(formData.get("brand")),
      style_id: Number(formData.get("style")),
    };

    try {
      const { data } = await api.patch(`/inventory/items/${item.id}`, payload);
      onSave(data);
      onClose();
    } catch {
      setError("Failed to update item");
    }
  }

  return (
    // backdrop
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#0f140f] border border-[#2e4a2e] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* header */}
        <div className="bg-[#8aaa62] text-center px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#0a0f0a] tracking-wide">
            EDIT ITEM
          </h2>
          <button
            onClick={onClose}
            className="text-[#0a0f0a] font-bold text-xl hover:opacity-60"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-8 flex flex-col gap-5">
            {/* Brand */}
            <div className="flex flex-col gap-2">
              <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                Brand
              </label>
              <select
                name="brand"
                defaultValue={item.brand.id}
                className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div className="flex flex-col gap-2">
              <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                Style
              </label>
              <select
                name="style"
                defaultValue={item.style.id}
                className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
              >
                {styles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.style}
                  </option>
                ))}
              </select>
            </div>

            {/* Size & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                  Size
                </label>
                <select
                  name="size"
                  defaultValue={item.size}
                  className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                >
                  {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                  Category
                </label>
                <select
                  name="cat"
                  defaultValue={item.category}
                  className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
                >
                  {["hoodie", "shirt", "pants", "jacket", "shoes"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                  Purchase Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price_bought"
                  defaultValue={item.price_bought}
                  className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none placeholder-[#3a5a3a]"
                  required
                />
              </div>
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
                  defaultValue={item.price_sold ?? ""}
                  className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none placeholder-[#3a5a3a]"
                  placeholder="—"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-[#8aaa62] text-xs font-semibold uppercase tracking-widest">
                Status
              </label>
              <select
                name="status"
                defaultValue={item.status}
                className="bg-[#141c14] border border-[#2e4a2e] text-[#d4e8b0] rounded-full px-5 py-3 w-full focus:outline-none"
              >
                <option value="not_listed">Not Listed</option>
                <option value="listed">Listed</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#8aaa62] text-[#0a0f0a] py-4 rounded-full font-black text-lg hover:bg-[#b7d592] transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;
