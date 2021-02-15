export default class Loader {
  loader: HTMLDivElement;
  constructor() {
    this.loader = document.querySelector(".loader") as HTMLDivElement;
    this.loadApp();
  }

  loadApp = () => {
    window.addEventListener("load", () => {
      this.loader.classList.add("loaded");
    });
  };
}
