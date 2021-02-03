import { currenciesState } from "../state/currenciesState";
import { Currency } from "../models/currency";
import { CurrencyItem } from "./currencyItem";

export default class ItemList {
  currencies: Currency[] = currenciesState.currenciesArray;
  newCurrenciesArray: Currency[] = [];
  hostElement: HTMLElement;

  constructor() {
    this.getCurrenciesState(this.sortCurrenciesArray);
    this.hostElement = document.querySelector(".list")! as HTMLElement;
  }

  // * CHECK IF CURRENCY.CODE IS IN FAVOURITE
  checkForFavourite = (code: string) => {
    const favouriteArray = JSON.parse(localStorage.getItem("favouriteArray")!);
    const index = favouriteArray.findIndex((item: string) => item === code);
    if (index !== -1) {
      return 1;
    } else {
      return 0;
    }
  };

  // * SORT CURRENCIES - CALLBACK IN MAIN FUNCTION. IT SHOULD BE IN STATE BUT THERE STILL WAS DOWNLOADED UNSORTED ARRAY :(

  sortCurrenciesArray = () => {
    // * FAVOURITE AND WITH BUY/SELL PRICE
    const favouriteWithBuySellCurrencies = this.currencies.filter((item) => {
      return this.checkForFavourite(item.code) === 1 && item.buyPrice;
    });

    // * FAVOURITE WITHOUT BUY/SELL PRICE
    const favouriteWithoutBuySellCurrencies = this.currencies.filter((item) => {
      return this.checkForFavourite(item.code) === 1 && !item.buyPrice;
    });

    // * WITH BUY/SELL PRICE AND NOT FAVOURITE
    const withBuySellNotFavourite = this.currencies.filter((item) => {
      return this.checkForFavourite(item.code) === 0 && item.buyPrice;
    });

    // * WITHOUT BUY/SELL PRICE AND NOT FAVOURITE
    const withoutBuySellNotFavourite = this.currencies.filter((item) => {
      return this.checkForFavourite(item.code) === 0 && !item.buyPrice;
    });

    this.newCurrenciesArray = [
      ...favouriteWithBuySellCurrencies,
      ...favouriteWithoutBuySellCurrencies,
      ...withBuySellNotFavourite,
      ...withoutBuySellNotFavourite,
    ];
  };

  // ! MAIN FUNCTION
  getCurrenciesState = (sort: () => void) => {
    // * FLAG
    let isFilled = false;

    const interval = setInterval(() => {
      // * REQUIRED yesterdayAveragePrice !== 0 - SIGN THAT WE HAVE DATA FROM LAST FETCH
      let USDindex = this.currencies.findIndex((item) => {
        return item.code === "USD";
      });

      // * IF WE DONT HAVE CURRENCIES.LENGTH - WE DON'T HAVE SECOND PARAMETER
      if (
        this.currencies.length &&
        this.currencies[USDindex].yesterdayAveragePrice !== 0
      ) {
        isFilled = true;
      }

      if (isFilled) {
        clearInterval(interval);
        sort();

        this.newCurrenciesArray.map((item) => {
          const newItem = new CurrencyItem(
            item.code,
            item.title,
            item.averagePrice,
            this.checkForFavourite(item.code),
            item.yesterdayAveragePrice,
            item.difference,
            item.buyPrice,
            item.sellPrice
          );
          const currency = newItem.createElement();

          this.hostElement.appendChild(currency);
        });
      } else console.log();
    }, 30);
  };
}
