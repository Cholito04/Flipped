import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import api from "./axios";
import type { Brand, Style, Store, Item } from "./Types";
import ItemMenu from "../components/ItemMenu";
import EditItemModel from "./EditItemModel";

export function useItemActions(
  setItems: Dispatch<SetStateAction<Item[]>>,
  setError?: (message: string) => void,
) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [sellMode, setSellMode] = useState(false);

  function openEdit(item: Item, sell: boolean) {
    setSellMode(sell);
    setEditingItem(item);
  }

  function closeModal() {
    setEditingItem(null);
    setSellMode(false);
  }
  useEffect(() => {
    async function loadMeta() {
      try {
        const [b, s, st] = await Promise.all([
          api.get("/inventory/brands"),
          api.get("/inventory/styles"),
          api.get("/inventory/stores"),
        ]);
        setBrands(b.data);
        setStyles(s.data);
        setStores(st.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  function merge(updated: Item) {
    setItems((prev) =>
      prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)),
    );
  }

  async function setStatus(id: number, status: "sold" | "listed") {
    try {
      const { data } = await api.patch(`/inventory/items/${id}`, { status });
      merge(data);
    } catch {
      setError?.("Failed to update item");
    }
  }

  async function remove(id: number) {
    try {
      await api.delete(`/inventory/items/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError?.("Failed to delete item");
    }
  }

  // drop this into any ItemCard's `actions` prop
  const menu = (item: Item) => (
    <ItemMenu
      itemId={item.id}
      status={item.status}
      onDelete={remove}
      onMarkSold={() => openEdit(item, true)}
      onMarkListed={(id) => setStatus(id, "listed")}
      onEdit={() => openEdit(item, false)}
    />
  );

  const modal = editingItem && (
    <EditItemModel
      item={editingItem}
      brands={brands}
      styles={styles}
      stores={stores}
      sellMode={sellMode}
      onClose={closeModal}
      onSave={merge}
    />
  );

  return { menu, modal };
}
