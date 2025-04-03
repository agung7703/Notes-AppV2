class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .loader-container {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: var(--z-fixed);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .loader-image {
          width: 8rem;
          height: 8rem;
        }
      </style>
      <div class="loader-container">
        <img src="./assets/img/Loader.gif" alt="Loading..." class="loader-image">
      </div>
    `;
    this._loaderContainer = this.shadowRoot.querySelector(".loader-container");
  }

  show() {
    this._loaderContainer.style.display = "flex";
  }

  hide() {
    this._loaderContainer.style.display = "none";
  }
}

customElements.define("loading-indicator", LoadingIndicator);
