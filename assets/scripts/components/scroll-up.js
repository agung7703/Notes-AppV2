export class ScrollUp extends HTMLElement {
  constructor() {
    super();
    this.render();
    // Bind the scrollUp method to the current context
    this.scrollUp = this.scrollUp.bind(this);
    // Add scroll event listener
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
    // If screen height is greater than 350px, show the scroll up button
    if (window.scrollY >= 150) {
      scrollUpButton.classList.add("show-scroll");
    } else {
      scrollUpButton.classList.remove("show-scroll");
    }
  }

  // Optionally, you can also remove the event listener when the element is removed
  disconnectedCallback() {
    window.removeEventListener("scroll", this.scrollUp);
  }
}

customElements.define("scroll-up", ScrollUp);
