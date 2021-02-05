import { Currency } from "../models/currency";
import ItemList from "./ItemList";

export class CurrencyItem implements Currency {
  constructor(
    public code: string,
    public title: string,
    public averagePrice: number,
    public favourite: 0 | 1,
    public yesterdayAveragePrice: number,
    public difference: number,
    public buyPrice: number | undefined,
    public sellPrice: number | undefined
  ) {
    this.code = code;
    this.title = title;
    this.averagePrice = averagePrice;
    this.favourite = favourite;
    this.buyPrice = buyPrice;
    this.sellPrice = sellPrice;
    this.difference = difference;
    this.createElement();
    this.clickFavourite();
  }

  // *  LOCALSTORAGE FAVOURITE TRUE/FALSE
  clickFavourite = () => {
    const interval = setInterval(() => {
      // * BUTTON
      const favouriteBtn = document.getElementById(`btn_${this.code}`)!;
      // * FLAG IF BTN IS EXIST
      let isExist = false;

      if (favouriteBtn) {
        isExist = true;
      }

      if (isExist) {
        clearInterval(interval);

        favouriteBtn.addEventListener("click", () => {
          // * LOCALSTORAGE
          const favouriteArray = JSON.parse(localStorage.getItem("favouriteArray")!);
          // * INDEX IN LOCALSTORAGE WITH THIS.CODE
          const index = favouriteArray.findIndex((item: string) => item === this.code);

          if (index === -1) {
            favouriteArray.push(this.code);
            localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
          } else {
            favouriteArray.splice(index, 1);
            localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
          }
          const list = new ItemList();
          setTimeout(() => {
            list.renderCurrencies();
          }, 50);
        });
      }
    }, 20);
  };

  // * IF THERE IS BUY/SELL PRICE - HELPER TO MAIN FUNCTION
  slotPrice = (price: number | undefined) => {
    if (!price) return "&nbsp-&nbsp";
    else return price;
  };

  // * IF DIFFERENCE IS + / - HELPER TO MAIN FUNCTION
  differenceColor = (difference: number) => {
    if (difference < 0) return "red";
    if (difference > 0) return "green";
  };

  // * IF CURRENCY IS FAVOURITE - HELPER TO MAIN FUNCTION
  favouriteColor = (favourite: 0 | 1) => {
    if (favourite === 1) return "red";
  };

  // ! MAIN FUNCTION - CREATE CURRENCY DIV ELEMENT
  createElement = () => {
    const element = document.createElement("div");
    element.classList.add("item");
    element.innerHTML = `
      <!-- ITEM FLAG -->
      <div class="item__flag">
          <img src="./flag_icons/usa.png" alt="usa">
        </div>
        

        <!-- ITEM INFO -->
        <div class="item__info">
          <div class="item__info-code">${this.code}</div>
          <div class="item__info-name">${this.title}</div>
        </div>

        <!-- ITEM PRICES -->
        <div class="item__prices">
          <div class="item__prices-buy">Kupno:&nbsp<span>${this.slotPrice(
            this.buyPrice
          )}</span></div>
          <div class="item__prices-sell">Sprzedaż:&nbsp<span>${this.slotPrice(
            this.sellPrice
          )}</span></div>
        </div>

        <!-- ITEM AVERAGE -->
        <div class="item__average">
          <div class="item__average-rate">${this.averagePrice}</div>
          <div class="item__average-score ${this.differenceColor(this.difference)}">${
      this.difference
    }%</div>
        </div>

        <!-- ITEM FAVOURITE -->
        <div class="item__favourite">
          <button class="item__favourite-btn" id="btn_${this.code}">
            <span class="material-icons item__favourite-icon ${this.favouriteColor(
              this.favourite
            )} ">
              star
            </span>
          </button>
        </div>
      `;
    return element;
  };
}
