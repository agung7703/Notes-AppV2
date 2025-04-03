import "../CSS/styles.css";
import Utils from "./utils.js";
import Form from "./form.js";
import "./components/navbar.js";
import "./components/scroll-up.js";
import "./components/policy.js";

async function init() {
  const navbar = document.createElement("navbar");
  document.body.prepend(navbar);

  const scrollUp = document.createElement("scrollUp");
  document.body.appendChild(scrollUp);

  const policy = document.createElement("policy");
  document.body.appendChild(policy);

  const textarea = document.querySelector("#note-body");
  textarea.addEventListener("input", (e) => {
    textarea.style.height = "59px";
    textarea.style.height = `${e.target.scrollHeight}px`;
  });

  const utils = new Utils();
  const form = new Form(utils);

  form.init();
  utils.setFormInstance(form);
  await utils.getNotes();
}

init();
