import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../util/axios";
import styles from "../styles/cs.module.css";

function AddItem() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Clear previous errors

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price_bought = formData.get("price_bought") as string;
    const price_sold = formData.get("price_sold") as string;
    try {
      await api.post("/inventory/create-item", {
        name,
        price_bought,
        price_sold,
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
                placeholder="65.00"
                className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
                required
              />
            </div>

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
