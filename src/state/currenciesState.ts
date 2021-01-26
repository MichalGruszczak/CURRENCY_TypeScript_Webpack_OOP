import { Currency } from "../models/currency";

export class CurrenciesState {
  public currenciesArray: Currency[] = [];
  private static instance: CurrenciesState; // TO STATIC

  private constructor() {
    this.getData();
  }

  // STATIC METHOD - PULL OUT STATE WITHOUT NEW CLASS INSTANCE
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new CurrenciesState();
    return this.instance;
  }

  // MAIN FUNCTION - FETCHING DATA
  getData = async () => {
    //
    //   FETCH ALL CURRENCIES TABLE FROM NBP
    await fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json")
      .then((res) => res.json())
      .then((data) => {
        data[0].rates.map((item: any) => {
          const newCurrency: Currency = {
            code: item.code,
            title: item.currency,
            averagePrice: item.mid,
            favourite: false,
            yesterdayAveragePrice: 0,
            difference: 0,
          };
          this.currenciesArray.push(newCurrency);
        });
      });

    //   FETCH CURRENCIES TABLE WITH BID / ASK
    await fetch("https://api.nbp.pl/api/exchangerates/tables/c/?format=json")
      .then((response) => response.json())
      .then((data) => {
        data[0].rates.map((item: any) => {
          const index = this.currenciesArray.findIndex(
            (curr: any) => curr.code === item.code
          );

          this.currenciesArray[index].buyPrice = item.bid;
          this.currenciesArray[index].sellPrice = item.ask;
        });
      });

    //   CURRENCIES OLD PRICE - FROM ONE RECORD BEFORE ACTUAL
    await fetch("https://api.nbp.pl/api/exchangerates/tables/a/last/2/?format=json")
      .then((response) => response.json())
      .then((data) => {
        data[0].rates.map((item: any) => {
          const index = this.currenciesArray.findIndex(
            (curr: any) => curr.code === item.code
          );

          this.currenciesArray[index].yesterdayAveragePrice = item.mid;

          this.currenciesArray[index].difference =
            ((this.currenciesArray[index].averagePrice -
              this.currenciesArray[index].yesterdayAveragePrice) /
              this.currenciesArray[index].yesterdayAveragePrice) *
            100;
          // ROUND DIFFERENCE TO X.XX
          const myNum = this.currenciesArray[index].difference;
          const multiplier = 100;
          const a: number = Math.round(myNum * multiplier) / multiplier;

          this.currenciesArray[index].difference = a;
        });
      });
  };
}

export const currenciesState = CurrenciesState.getInstance();
