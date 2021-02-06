export default class Header {
  tableBtn: HTMLButtonElement;
  calculatorBtn: HTMLButtonElement;
  tableSection: HTMLElement;
  calculatorSection: HTMLElement;

  constructor() {
    (this.tableBtn = document.getElementById("header__table")! as HTMLButtonElement),
      (this.calculatorBtn = document.getElementById(
        "header__calculator"
      )! as HTMLButtonElement),
      (this.tableSection = document.getElementById("main__table")! as HTMLElement),
      (this.calculatorSection = document.getElementById(
        "main__calculator"
      )! as HTMLElement),
      this.renderActive();
  }

  //   * NAV BUTTONS
  renderActive = () => {
    this.tableBtn.addEventListener("click", () => {
      this.tableSection.classList.add("active");
      this.calculatorSection.classList.remove("active");
    });
    this.calculatorBtn.addEventListener("click", () => {
      this.calculatorSection.classList.add("active");
      this.tableSection.classList.remove("active");
    });
  };
}
