import { Currency } from "../models/currency";

export class CurrenciesState {
  public currenciesArray: Currency[] = [];
  private static instance: CurrenciesState; // TO STATIC

  private constructor() {
    this.getData();
    this.createLocalStorage();
  }

  // * CREATE FAVOURITE LOCALSTORAGE
  createLocalStorage = () => {
    if (!localStorage.getItem("favouriteArray")) {
      localStorage.setItem("favouriteArray", JSON.stringify([]));
    } else console.log();
  };

  // * STATIC METHOD - PULL OUT STATE WITHOUT NEW CLASS INSTANCE
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new CurrenciesState();
    return this.instance;
  }

  // * ROUND NUMBERS - HELPER FUNCTION
  roundNumber = (number: number, multi: number) => {
    const myNum = number;
    const multiplier = multi;
    return Math.round(myNum * multiplier) / multiplier;
  };

  // ! MAIN FUNCTION - FETCHING DATA
  getData = async () => {
    //
    //   * FETCH ALL CURRENCIES TABLE FROM NBP
    await fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json")
      .then((res) => res.json())
      .then((data) => {
        data[0].rates.map((item: any) => {
          const roundedAveragePrice = this.roundNumber(item.mid, 10000);

          const newCurrency: Currency = {
            code: item.code,
            title: item.currency,
            averagePrice: roundedAveragePrice,
            favourite: 0,
            yesterdayAveragePrice: 0,
            difference: 0,
          };
          this.currenciesArray.push(newCurrency);
        });
      });

    //   * FETCH CURRENCIES TABLE WITH BID / ASK
    await fetch("https://api.nbp.pl/api/exchangerates/tables/c/?format=json")
      .then((response) => response.json())
      .then((data) => {
        data[0].rates.map((item: any) => {
          const roundedBuyPrice = this.roundNumber(item.bid, 10000);
          const roundedSellPrice = this.roundNumber(item.ask, 10000);

          const index = this.currenciesArray.findIndex(
            (curr: any) => curr.code === item.code
          );

          this.currenciesArray[index].buyPrice = roundedBuyPrice;
          this.currenciesArray[index].sellPrice = roundedSellPrice;
        });
      });

    //   * CURRENCIES OLD PRICE - FROM ONE RECORD BEFORE ACTUAL
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

          const roundedDifference = this.roundNumber(
            this.currenciesArray[index].difference,
            100
          );

          this.currenciesArray[index].difference = roundedDifference;
        });
      });
  };
}

export const currenciesState = CurrenciesState.getInstance();
