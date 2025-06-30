export interface Signal {
  date: string; // ex: "2025-06-28"
  type: 'COMPRA' | 'VENDA';
  price: number;
}
