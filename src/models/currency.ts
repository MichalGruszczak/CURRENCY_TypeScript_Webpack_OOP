export interface Currency {
  code: string;
  title: string;
  averagePrice: number;
  favourite: boolean;
  buyPrice?: number;
  sellPrice?: number;
  yesterdayAveragePrice: number;
  difference: number;
}
