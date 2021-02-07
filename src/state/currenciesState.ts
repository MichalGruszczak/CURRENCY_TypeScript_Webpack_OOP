import { Currency } from "../models/currency";

export class CurrenciesState {
  public currenciesArray: Currency[] = [];
  public sortedCurrenciesArray: Currency[] = [];
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

  // * ROUND NUMBERS - PART OF MAIN
  roundNumber = (number: number, multi: number) => {
    const myNum = number;
    const multiplier = multi;
    return Math.round(myNum * multiplier) / multiplier;
  };

  // * CHECK FOR FAVOURITE - PART OF SORT
  checkForFavourite = (code: string) => {
    const favouriteArray = JSON.parse(localStorage.getItem("favouriteArray")!);
    const index = favouriteArray.findIndex((item: string) => item === code);
    if (index !== -1) {
      return 1;
    } else {
      return 0;
    }
  };

  // * SORT - PART OF MAIN
  sortCurrenciesArray = () => {
    // * FAVOURITE AND WITH BUY/SELL PRICE
    const favouriteWithBuySellCurrencies = this.currenciesArray.filter((item) => {
      return this.checkForFavourite(item.code) === 1 && item.buyPrice;
    });

    // * FAVOURITE WITHOUT BUY/SELL PRICE
    const favouriteWithoutBuySellCurrencies = this.currenciesArray.filter((item) => {
      return this.checkForFavourite(item.code) === 1 && !item.buyPrice;
    });

    // * WITH BUY/SELL PRICE AND NOT FAVOURITE
    const withBuySellNotFavourite = this.currenciesArray.filter((item) => {
      return this.checkForFavourite(item.code) === 0 && item.buyPrice;
    });

    // * WITHOUT BUY/SELL PRICE AND NOT FAVOURITE
    const withoutBuySellNotFavourite = this.currenciesArray.filter((item) => {
      return this.checkForFavourite(item.code) === 0 && !item.buyPrice;
    });

    this.sortedCurrenciesArray = [
      ...favouriteWithBuySellCurrencies,
      ...favouriteWithoutBuySellCurrencies,
      ...withBuySellNotFavourite,
      ...withoutBuySellNotFavourite,
    ];
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

    // * YESTERDAY AVERAGE PRICE !== 0 IS SIGN THAT WE HAVE LAST FETCH AND WE CAN SORT ARRAY
    let isFilled = false;
    const interval = setInterval(() => {
      let USDindex = this.currenciesArray.findIndex((item) => {
        return item.code === "USD";
      });

      if (
        this.currenciesArray.length &&
        this.currenciesArray[USDindex].yesterdayAveragePrice !== 0
      ) {
        isFilled = true;
      }

      if (isFilled) {
        clearInterval(interval);
        this.sortCurrenciesArray();
      }
    });
  };
}

export const currenciesState = CurrenciesState.getInstance();
