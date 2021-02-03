export interface Currency {
  code: string;
  title: string;
  averagePrice: number;
  favourite: 0 | 1;
  buyPrice?: number;
  sellPrice?: number;
  yesterdayAveragePrice: number;
  difference: number;
}
