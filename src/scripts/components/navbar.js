export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="nav container grid">
            <h1 class="nav__title">Notes App</h1>
        </div>
        `;
  }
}

customElements.define("navbar-el", Navbar);
