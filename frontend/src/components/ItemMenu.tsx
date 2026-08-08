import { useEffect, useState } from "react";

function ItemMenu({
  itemId,
  status,
  onDelete,
  onMarkSold,
  onEdit,
}: {
  itemId: number;
  status: string;
  onDelete: (id: number) => void;
  onMarkSold: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as Element).closest(`[data-menu-id="${itemId}"]`))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, itemId]);

  return (
    <div className="relative" data-menu-id={itemId}>
      <button
        onClick={() => setOpen(!open)}
        className="text-text-muted hover:text-text-primary px-2 py-1 rounded transition-all"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-card border border-border rounded-xl shadow-lg z-10">
          <button
            onClick={() => {
              onEdit(itemId);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-green-primary rounded-t-xl transition-all"
          >
            Edit
          </button>
          {status !== "sold" && (
            <button
              onClick={() => {
                onMarkSold(itemId);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-status-sold hover:bg-green-primary transition-all"
            >
              Mark as Sold
            </button>
          )}
          <button
            onClick={() => {
              onDelete(itemId);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-b-xl transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
export default ItemMenu;
