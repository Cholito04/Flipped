import type { Item } from "./Types";

export const money = (n: number) => `$${n.toFixed(2)}`;

// null until the item has a sold price
export function itemProfit(item: Item): number | null {
  if (item.price_sold === null) return null;
  return Number(item.price_sold) - Number(item.price_bought);
}
