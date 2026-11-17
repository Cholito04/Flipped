import type { ReactNode } from "react";
import type { Item } from "./Types";
import { money, itemProfit } from "./Format";

const STATUS_STYLES: Record<string, string> = {
  sold: "text-status-sold border-status-sold bg-status-sold/10",
  listed: "text-status-listed border-status-listed bg-status-listed/10",
  not_listed:
    "text-status-unlisted border-status-unlisted bg-status-unlisted/10",
};

const STATUS_LABELS: Record<string, string> = {
  sold: "Sold",
  listed: "Listed",
  not_listed: "Not listed",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border w-fit ${
        STATUS_STYLES[status] ?? STATUS_STYLES.not_listed
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function PriceCell({
  label,
  value,
  color = "text-text-primary",
  align = "left",
}: {
  label: string;
  value: string;
  color?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-text-muted text-xs uppercase tracking-widest">
        {label}
      </p>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  );
}

interface ItemCardProps {
  item: Item;
  // "full" is the main grid card, "compact" is for cards nested inside other cards
  variant?: "full" | "compact";
  // optional slot top-right, e.g. the ⋮ menu on the Items page
  actions?: ReactNode;
}

function ItemCard({ item, variant = "full", actions }: ItemCardProps) {
  const compact = variant === "compact";
  const profit = itemProfit(item);

  return (
    <div
      className={
        compact
          ? "bg-bg border border-border rounded-xl p-4 flex flex-col gap-3"
          : "bg-card border border-border rounded-2xl p-5 flex flex-col gap-4"
      }
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p
            className={`text-text-primary leading-tight ${
              compact ? "font-semibold" : "font-bold text-lg"
            }`}
          >
            {item.brand?.brand ?? "Unknown brand"} {item.category}
          </p>
          <p className={`text-text-muted ${compact ? "text-xs" : "text-sm"}`}>
            {item.style?.style ?? "Unknown style"} · {item.size}
          </p>
        </div>
        {actions}
      </div>

      <StatusBadge status={item.status} />

      <div className="flex justify-between items-end border-t border-border pt-3">
        <PriceCell label="Bought" value={money(Number(item.price_bought))} />
        <PriceCell
          label="Sold"
          value={
            item.price_sold !== null ? money(Number(item.price_sold)) : "—"
          }
          align="right"
        />
        <PriceCell
          label="Profit"
          value={profit !== null ? money(profit) : "—"}
          color={
            profit === null
              ? "text-text-muted"
              : profit >= 0
                ? "text-status-sold"
                : "text-red-400"
          }
          align="right"
        />
      </div>

      {!compact && item.status === "sold" && item.sell_time_days !== null && (
        <p className="text-text-muted text-xs">
          Sold in{" "}
          <span className="text-status-sold font-semibold">
            {item.sell_time_days}d
          </span>
        </p>
      )}
    </div>
  );
}

export default ItemCard;
