import { currenciesState } from "../state/currenciesState";
import { Currency } from "../models/currency";
import { CurrencyItem } from "./currencyItem";

export default class ItemList {
  currencies: Currency[] = [];
  hostElement: HTMLElement;
  searchBox: HTMLInputElement;

  constructor() {
    this.hostElement = document.querySelector(".list")! as HTMLElement;
    this.searchBox = document.querySelector(".search__input")! as HTMLInputElement;
    this.renderCurrencies();
    this.filterCurrencies();
  }

  // * MAP CURRENCY ARRAY - PART OF STANDARD AND FILTERED CURRENCIES RENDER
  createCurrency = (arr: Currency[]) => {
    this.hostElement.textContent = "";
    arr.map((item) => {
      const newItem = new CurrencyItem(
        item.code,
        item.title,
        item.averagePrice,
        currenciesState.checkForFavourite(item.code),
        item.yesterdayAveragePrice,
        item.difference,
        item.buyPrice,
        item.sellPrice
      );
      const currency = newItem.createElement();

      this.hostElement.appendChild(currency);
    });
  };

  // ! STANDARD RENDER ALL CURRENCIES
  renderCurrencies = () => {
    // * FLAG
    let isFilled = false;

    const interval = setInterval(() => {
      this.currencies = currenciesState.sortedCurrenciesArray;

      if (this.currencies.length > 0) {
        isFilled = true;
      }

      if (isFilled) {
        clearInterval(interval);
        this.searchBox.disabled = false;
        this.createCurrency(this.currencies);
      } else console.log();
    }, 50);
  };

  // ! RENDER FILTERED CURRENCIES
  filterCurrencies = () => {
    const interval = setInterval(() => {
      let isFilled = false;
      if (this.currencies.length > 0) isFilled = true;
      if (isFilled) {
        clearInterval(interval);

        // * SEARCHING
        this.searchBox.addEventListener("input", () => {
          const currentWord = this.searchBox.value.toUpperCase();

          const filteredCurrencies = this.currencies.filter((item) => {
            return (
              item.title.toUpperCase().includes(currentWord) ||
              item.code.toUpperCase().includes(currentWord)
            );
          });

          this.createCurrency(filteredCurrencies);
        });
      }
    }, 20);
  };
}
