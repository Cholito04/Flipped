export interface Brand {
  id: number;
  brand: string;
}
export interface Style {
  id: number;
  style: string;
}
export interface Store {
  id: number;
  store: string;
}

export interface Item {
  id: number;
  brand: Brand;
  style: Style;
  store: Store | null;
  size: string;
  category: string;
  status: string;
  price_bought: string;
  price_sold: string | null;
  created_at: string;
  sold_at: string | null;
  sell_time_days: number | null;
}
