import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "./axios";

interface Item {
  id: number;
  category: string;
  status: string;
  price_bought: string;
  price_sold: string | null;
  created_at: string;
  sold_at: string | null;
}

const COLORS = {
  sold: "#4ade80",
  listed: "#f5c563",
  unlisted: "#f16c6c",
  grid: "#3A3D40",
  tick: "#9ca1a6",
  card: "#1D1F21",
};

const tickStyle = { fill: COLORS.tick, fontSize: 12 };
const tooltipStyle = {
  contentStyle: {
    background: COLORS.card,
    border: `1px solid ${COLORS.grid}`,
    borderRadius: 12,
  },
  labelStyle: { color: COLORS.tick },
  itemStyle: { color: "#F2F3f3" },
};
const money = (v: unknown) => `$${Number(v).toFixed(2)}`;

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <p className="text-green-primary text-xs font-semibold uppercase tracking-widest">
        {title}
      </p>
      {subtitle && <p className="text-text-muted text-xs mt-1">{subtitle}</p>}
      <div className="h-64 mt-4">{children}</div>
    </div>
  );
}

function StatsCharts() {
  const [items, setItems] = useState<Item[]>([]);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    api
      .get("/inventory/items")
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, []);

  // spent / earned / cumulative profit per month
  const monthly = useMemo(() => {
    const now = new Date();
    const windowStart = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1),
      1,
    );

    const buckets = Array.from({ length: months }, (_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - (months - 1 - i),
        1,
      );
      return {
        key: monthKey(d),
        label: d.toLocaleDateString("en-US", { month: "short" }),
        spent: 0,
        earned: 0,
        profit: 0,
        cumulative: 0,
      };
    });
    const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));

    // profit from before the window, so the cumulative line starts at your real total
    let baseline = 0;

    for (const item of items) {
      const bought = parseFloat(item.price_bought || "0");
      const b = byKey[monthKey(new Date(item.created_at))];
      if (b) b.spent += bought;

      if (item.status === "sold" && item.price_sold && item.sold_at) {
        const sold = parseFloat(item.price_sold);
        const soldDate = new Date(item.sold_at);
        const sb = byKey[monthKey(soldDate)];
        if (sb) {
          sb.earned += sold;
          sb.profit += sold - bought;
        } else if (soldDate < windowStart) {
          baseline += sold - bought;
        }
      }
    }

    let running = baseline;
    for (const b of buckets) {
      running += b.profit;
      b.cumulative = Number(running.toFixed(2));
      b.spent = Number(b.spent.toFixed(2));
      b.earned = Number(b.earned.toFixed(2));
    }
    return buckets;
  }, [items, months]);

  // avg profit per sold item, by category
  const byCategory = useMemo(() => {
    const groups: Record<string, { total: number; count: number }> = {};
    for (const i of items) {
      if (i.status !== "sold" || !i.price_sold) continue;
      const g = (groups[i.category] ??= { total: 0, count: 0 });
      g.total += parseFloat(i.price_sold) - parseFloat(i.price_bought);
      g.count += 1;
    }
    return Object.entries(groups)
      .map(([category, g]) => ({
        category,
        avg: Number((g.total / g.count).toFixed(2)),
        count: g.count,
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [items]);

  const statusData = useMemo(
    () =>
      [
        {
          name: "Sold",
          value: items.filter((i) => i.status === "sold").length,
          color: COLORS.sold,
        },
        {
          name: "Listed",
          value: items.filter((i) => i.status === "listed").length,
          color: COLORS.listed,
        },
        {
          name: "Not listed",
          value: items.filter((i) => i.status === "not_listed").length,
          color: COLORS.unlisted,
        },
      ].filter((s) => s.value > 0),
    [items],
  );

  if (items.length === 0) {
    return (
      <p className="text-text-muted text-sm">
        Add some items to see your trends.
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[3, 6, 12].map((m) => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all ${
              months === m
                ? "bg-green-primary text-silver-primary border-green-hover"
                : "text-text-muted border-border hover:text-text-primary"
            }`}
          >
            {m} mo
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Profit over time"
          subtitle="Running total of profit from sold items"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={COLORS.sold}
                    stopOpacity={0.35}
                  />
                  <stop offset="100%" stopColor={COLORS.sold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke={COLORS.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(v) => [money(v), "Profit"]}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={COLORS.sold}
                strokeWidth={2}
                fill="url(#profitFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Spent vs earned"
          subtitle="Spent by date bought, earned by date sold"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} barGap={4}>
              <CartesianGrid
                stroke={COLORS.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(v, name) => [money(v), name]}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar
                dataKey="spent"
                name="Spent"
                fill={COLORS.listed}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="earned"
                name="Earned"
                fill={COLORS.sold}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg profit by category" subtitle="Per sold item">
          {byCategory.length === 0 ? (
            <p className="text-text-muted text-sm">
              Sell something to see this.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byCategory}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid
                  stroke={COLORS.grid}
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  {...tooltipStyle}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  formatter={(v, _n, p) => [
                    `${money(v)} · ${p.payload.count} sold`,
                    "Avg profit",
                  ]}
                />
                <Bar dataKey="avg" radius={[0, 6, 6, 0]}>
                  {byCategory.map((c) => (
                    <Cell
                      key={c.category}
                      fill={c.avg >= 0 ? COLORS.sold : COLORS.unlisted}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Inventory status"
          subtitle="Where your items are right now"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={3}
                stroke="none"
              >
                {statusData.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs text-text-muted -mt-6">
            {statusData.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: s.color }}
                />
                {s.name} · {s.value}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default StatsCharts;
