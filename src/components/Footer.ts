import { currenciesState } from "../state/currenciesState";

export default class Footer {
  footerInfo: HTMLElement;
  constructor() {
    this.footerInfo = document.querySelector(".footer__info") as HTMLElement;
    this.printDate();
  }

  //   ! WAIT FOR FETCH DATE AND PRINT
  printDate = () => {
    const interval = setInterval(() => {
      let isFilled = false;
      const date = currenciesState.ratingDate;
      if (date) isFilled = true;
      if (isFilled) {
        clearInterval(interval);
        this.footerInfo.textContent = `Dane na podstawie kursów NBP z dnia ${currenciesState.ratingDate}`;
      }
    }, 30);
  };
}
