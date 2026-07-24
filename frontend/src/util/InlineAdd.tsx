import { useState } from "react";

function InlineAdd({
  label,
  onAdd,
}: {
  label: string;
  onAdd: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-[#8aaa62] hover:text-[#d4e8b0] transition-all"
        >
          + Add {label}
        </button>
      ) : (
        <div className="flex gap-2 items-center mt-1 rounded-2xl">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
              if (e.key === "Escape") {
                setOpen(false);
                setValue("");
              }
            }}
            placeholder={`New ${label.toLowerCase()}...`}
            className="bg-[#0b100b] border border-[#3d6b3d] text-[#d4e8b0] rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#4d7a4d] placeholder-[#3a4a3a]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="text-[#8aaa62] hover:text-[#d4e8b0] text-sm font-bold px-1 transition-all"
          >
            ✓
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setValue("");
            }}
            className="text-[#5a4a4a] hover:text-red-400 text-sm px-1 transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
export default InlineAdd;
