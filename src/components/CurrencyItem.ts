import { Currency } from "../models/currency";
import { newItemList } from "./ItemList";
import { Chart } from "chart.js";

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
    this.showChart();
  }

  // !  LOCALSTORAGE FAVOURITE TRUE/FALSE
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

          setTimeout(() => {
            newItemList.renderCurrencies();
          }, 50);
        });
      }
    }, 20);
  };

  // * IF THERE IS BUY/SELL PRICE - PART OF MAIN FUNCTION
  slotPrice = (price: number | undefined) => {
    if (!price) return "&nbsp-&nbsp";
    else return price;
  };

  // * IF DIFFERENCE IS + / - PART OF MAIN FUNCTION
  differenceColor = (difference: number) => {
    if (difference < 0) return "red";
    if (difference > 0) return "green";
  };

  // * IF CURRENCY IS FAVOURITE - PART OF MAIN FUNCTION
  favouriteColor = (favourite: 0 | 1) => {
    if (favourite === 1) return "red";
  };

  // ! MAIN FUNCTION - CREATE CURRENCY DIV ELEMENT
  createElement = () => {
    const element = document.createElement("div");
    element.classList.add("item");
    element.innerHTML = `

    <!-- * CHARTS MODAL -->
    <aside class="modal" id="modal_${this.code}">
      <div class="modal__window" id="modal_window_${this.code}">
        <button class="modal__close" id="modal__close_${this.code}">
         <span class="material-icons">
            close
          </span>
        </button>

        <canvas id="myChart_${this.code}" class="modal__chart"></canvas>


      </div>
    </aside>


      <!-- ITEM FLAG -->
      <div class="item__flag">
          <img class="item__img" src="./flag_icons/${this.code}.png" alt="${this.code}">
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
          <button class="item__average-score ${this.differenceColor(
            this.difference
          )}" id='chartBtn_${this.code}'>${this.difference}%</button>
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

  // * DRAW CHART - PART OF CHART MODAL OPEN/CLOSE FUNCTION
  drawChart = (dates: string[], ratings: number[]) => {
    const canvas = <HTMLCanvasElement>document.getElementById(`myChart_${this.code}`);
    const ctx = canvas.getContext("2d")!;
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: `Ostatnie 60 notowań ${this.code}`,
            data: ratings,
            backgroundColor: ["blue"],
            borderColor: ["darkblue"],
            pointBackgroundColor: "transparent",
            borderWidth: 1,
            fill: false,
            lineTension: 0.4,
          },
        ],
      },
      options: {
        legend: { labels: { fontColor: "black" } },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
                fontColor: "black",
              },
              gridLines: {
                color: "rgba(178, 178, 178, 1)",
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: false,
                fontColor: "black",
              },
              gridLines: {
                color: "rgba(178, 178, 178, 1)",
              },
            },
          ],
        },
      },
    });
    return myChart;
  };

  // ! CHART MODAL OPEN/CLOSE
  showChart = () => {
    const interval = setInterval(() => {
      //
      let isExist = false;
      //
      const chartBtn: HTMLElement = document.getElementById(`chartBtn_${this.code}`)!;
      const chartModal: HTMLElement = document.getElementById(`modal_${this.code}`)!;
      const chartModalClose: HTMLElement = document.getElementById(
        `modal__close_${this.code}`
      )!;
      //
      if (chartBtn) isExist = true;
      if (isExist) {
        clearInterval(interval);
        //
        chartBtn.addEventListener("click", async () => {
          let dates: string[] = [];
          let ratings: number[] = [];
          await fetch(
            `http://api.nbp.pl/api/exchangerates/rates/a/${this.code}/last/60/?format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              data.rates.map((rate: any) => {
                dates.push(rate.effectiveDate);
              });

              data.rates.map((rate: any) => {
                ratings.push(rate.mid);
              });
            });
          this.drawChart(dates, ratings);
          chartModal.classList.add("active");
        });

        chartModalClose.addEventListener("click", () => {
          chartModal.classList.remove("active");
        });
      }
    }, 30);
  };
}
