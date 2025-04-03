export class Policy extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="footer__policy">
            <a href="#" class="footer__link">Terms & Aggrement</a>
            <a href="#" class="footer__link">Privacy Policy</a>
        </div>
        <span class="footer__copy"
            >&copy; 2025 Website Notes App By <br />
            Agung Maulana Saputra - FC193D5Y1198</span
        >
          `;
  }
}

customElements.define("policy-el", Policy);
