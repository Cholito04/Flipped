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
          className="text-sm text-green-primary hover:text-green-hover transition-all"
        >
          + Add {label}
        </button>
      ) : (
        <div className="flex gap-2 items-center mt-1">
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
            className="bg-card border border-border text-text-primary rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-hover placeholder-text-muted"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="text-green-primary hover:text-text-primary text-sm font-bold px-1 transition-all"
          >
            ✓
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setValue("");
            }}
            className="text-text-muted hover:text-red-400 text-sm px-1 transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
export default InlineAdd;
