export class ScrollUp extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.scrollUp = this.scrollUp.bind(this);
    window.addEventListener("scroll", this.scrollUp);
  }

  render() {
    this.innerHTML = `
        <a href="#" class="scrollup" id="scroll-up">
            <i class="ri-arrow-up-line"></i>
        </a>
    `;
  }

  scrollUp() {
    const scrollUpButton = document.getElementById("scroll-up");

    if (window.scrollY >= 150) {
      scrollUpButton.classList.add("show-scroll");
    } else {
      scrollUpButton.classList.remove("show-scroll");
    }
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.scrollUp);
  }
}

customElements.define("scroll-up", ScrollUp);
