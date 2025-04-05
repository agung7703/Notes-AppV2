class FullNoteModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          /* Style untuk modal container */
          .modal {
            display: none;
            position: fixed;
            z-index: var(--z-fixed);
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
          }
  
          /* Style untuk modal content */
          .modal-content {
            background-color: var(--body-color);
            padding: 20px;
            border: 1px solid var(--black-color);
            border-radius: 10px;
            width: 80%;
            box-shadow: var(--shadow-medium);
            position: relative;
            top: 50%; /* Posisikan bagian atas elemen di tengah viewport */
            left: 50%; /* Posisikan bagian kiri elemen di tengah viewport */
            transform: translate(-50%, -50%);
          }
  
          /* Style untuk tombol close */
          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 247, 247, 0.8);
            border-radius: 50%;
            border: none;
          }
  
          .close-button:hover,
          .close-button:focus {
            background-color: rgb(112, 105, 105);
            color: black;
            text-decoration: none;
          }
  
          #modal-note-title {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1.8em;
            font-weight: bold;
          }
  
          #modal-note-body {
            white-space: pre-wrap;
            margin-bottom: 0;
          }
        </style>
        <div class="modal">
          <div class="modal-content">
            <button class="close-button">
              <img src="./src/assets/img/close-large-line.svg" alt="Close" style="width: 1.5rem; height: 1.5rem;">
            </button>
            <h3 id="modal-note-title"></h3>
            <p id="modal-note-body"></p>
          </div>
        </div>
      `;
    this._modal = this.shadowRoot.querySelector(".modal");
    this._closeButton = this.shadowRoot.querySelector(".close-button");
    this._modalTitle = this.shadowRoot.querySelector("#modal-note-title");
    this._modalBody = this.shadowRoot.querySelector("#modal-note-body");
  }

  connectedCallback() {
    this._closeButton.addEventListener("click", this.closeModal);
    window.addEventListener("click", this._handleOutsideClick);
  }

  disconnectedCallback() {
    this._closeButton.removeEventListener("click", this.closeModal);
    window.removeEventListener("click", this._handleOutsideClick);
  }

  openModal(title, body) {
    this._modalTitle.textContent = title;
    this._modalBody.textContent = body;
    this._modal.style.display = "block";
  }

  closeModal = () => {
    this._modal.style.display = "none";
  };

  _handleOutsideClick = (event) => {
    if (event.target === this._modal) {
      this.closeModal();
    }
  };
}

customElements.define("full-note-modal", FullNoteModal);
