import { Currency } from "../models/currency";
import { currenciesState } from "../state/currenciesState";

export default class Calculator {
  currenciesList: Currency[] = [];
  amountInput: HTMLInputElement;
  clearAmountBtn: HTMLButtonElement;
  select1Input: HTMLInputElement;
  invertBtn: HTMLButtonElement;
  select2Input: HTMLInputElement;
  submitBtn: HTMLButtonElement;
  scoreLeft: HTMLElement;
  scoreEqual: HTMLElement;
  scoreRight: HTMLElement;
  infoText: HTMLElement;
  amount: number;
  currency1Code: string;
  currency1Price: number;
  currency2Code: string;
  currency2Price: number;

  constructor() {
    this.amountInput = document.querySelector(".amount__input") as HTMLInputElement;
    this.clearAmountBtn = document.querySelector(".amount__clear") as HTMLButtonElement;
    this.select1Input = document.getElementById("select_one") as HTMLInputElement;
    this.invertBtn = document.querySelector(
      ".currencies__turn-over"
    ) as HTMLButtonElement;
    this.select2Input = document.getElementById("select_two") as HTMLInputElement;
    this.submitBtn = document.querySelector(".submit__btn") as HTMLButtonElement;
    this.scoreLeft = document.querySelector(".score__left") as HTMLElement;
    this.scoreEqual = document.querySelector(".score__equal") as HTMLElement;
    this.scoreRight = document.querySelector(".score__right") as HTMLElement;
    this.infoText = document.querySelector(".info__text") as HTMLElement;
    this.amount = 0;
    this.currency1Code = "";
    this.currency1Price = 0;
    this.currency2Code = "";
    this.currency2Price = 0;
    this.getAmount();
    this.clearAmount();
    this.addSelectOptions();
    this.chooseCurrencies();
    this.calculateCurrencies();
  }

  //   ! GET AMOUNT FROM NUMBER INPUT
  getAmount = () => {
    this.amountInput.addEventListener("input", () => {
      this.amount = parseInt(this.amountInput.value);
      if (!this.amountInput.value) this.amount = 0;
    });
  };

  // ! CLEAR AMOUNT INPUT VALUE
  clearAmount = () => {
    this.clearAmountBtn.addEventListener("click", () => {
      this.amountInput.value = "";
      this.amount = 0;
      console.log(this.amount);
    });
  };

  // ! ADD OPTIONS TO SELECTS
  addSelectOptions = () => {
    const interval = setInterval(() => {
      this.currenciesList = [
        {
          code: "PLN",
          title: "złoty polski",
          averagePrice: 1,
          favourite: 0,
          yesterdayAveragePrice: 0,
          difference: 0,
        },
        ...currenciesState.sortedCurrenciesArray,
      ];

      if (this.currenciesList.length > 1) {
        clearInterval(interval);

        // * MAP TO FIRST INPUT
        this.currenciesList.map((item) => {
          const option = document.createElement("option");
          option.value = item.code;
          option.textContent = `${item.code} - ${item.title}`;
          this.select1Input.appendChild(option);
        });

        // * MAP TO SECOND INPUT
        this.currenciesList.map((item) => {
          const option = document.createElement("option");
          option.value = item.code;
          option.textContent = `${item.code} - ${item.title}`;
          this.select2Input.appendChild(option);
        });
      }
    }, 30);
  };

  // * INVERT CURRENCIES - PART OF CHOOSE CURRENCIES
  invertCurrencies = () => {
    this.invertBtn.addEventListener("click", () => {
      let x = this.currency1Code;
      let y = this.currency2Code;
      if (this.currency1Code && this.currency2Code) {
        this.currency1Code = y;
        this.currency2Code = x;
        this.select1Input.value = this.currency1Code;
        this.select2Input.value = this.currency2Code;
        x = this.currency1Code;
        y = this.currency2Code;
      } else alert("Wybierz walutę!");
    });
  };

  // ! CHOOSE A CURRENCIES TO CALCULATION
  chooseCurrencies = () => {
    let isFilled = false;

    const interval = setInterval(() => {
      const options = this.select1Input.children;

      if (options.length > 2) isFilled = true;
      if (isFilled) {
        clearInterval(interval);

        this.select1Input.addEventListener("input", () => {
          this.currency1Code = this.select1Input.value;
        });
        this.select2Input.addEventListener("input", () => {
          this.currency2Code = this.select2Input.value;
        });

        this.invertCurrencies();
      }
    }, 30);
  };

  // * GET CURRENCIES PRICES - PART OF CALCULATE FUNCTION
  getCurrencyPrice = () => {
    const index1 = this.currenciesList.findIndex((item) => {
      return item.code === this.currency1Code;
    });
    const index2 = this.currenciesList.findIndex((item) => {
      return item.code === this.currency2Code;
    });

    this.currency1Price = this.currenciesList[index1].averagePrice;
    this.currency2Price = this.currenciesList[index2].averagePrice;
  };

  // ! CALCULATE CURRENCIES AND SHOW SHOW RESULT
  calculateCurrencies = () => {
    this.submitBtn.addEventListener("click", () => {
      if (this.currency1Code && this.currency2Code && this.amount) {
        this.getCurrencyPrice();
        //
        const unroundedScore = (this.amount * this.currency1Price) / this.currency2Price;
        const score = currenciesState.roundNumber(unroundedScore, 100);
        //
        this.scoreLeft.textContent = `${this.amount} ${this.currency1Code}`;
        this.scoreEqual.textContent = `=`;
        this.scoreRight.textContent = `${score} ${this.currency2Code}`;
        //
        const unroundedInfoScore = this.currency1Price / this.currency2Price;
        const infoScore = currenciesState.roundNumber(unroundedInfoScore, 10000);
        this.infoText.textContent = `1 ${this.currency1Code} = ${infoScore} ${this.currency2Code}, według średniego kursu NBP z dnia 22.01.2021`;
      } else alert("Uzupełnij dane!");
    });
  };
}
