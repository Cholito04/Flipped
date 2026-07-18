import { useEffect } from "react";
import { useState } from "react";

function ItemMenu({
  itemId,
  onDelete,
}: {
  itemId: number;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as Element).closest(`[data-menu-id="${itemId}"]`)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, itemId]);

  return (
    <div className="relative" data-menu-id={itemId}>
      <button
        onClick={() => setOpen(!open)}
        className="text-[#5a6e4a] hover:text-[#d4e8b0] px-2 py-1 rounded transition-all"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-[#1e341e] border border-[#395339] rounded-xl shadow-lg z-10">
          <button
            disabled
            className="w-full text-left px-4 py-2 text-sm text-[#5a6e4a] cursor-not-allowed"
          >
            Edit (soon)
          </button>
          <button
            onClick={() => {
              onDelete(itemId);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a1a1a] rounded-b-xl transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemMenu;
