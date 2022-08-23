import validator from "validator";

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector('input[name="password"]');
    let error = false;

    if (!validator.isEmail(emailInput.value)) {
      //alert("E-mail is invalid!");
      let p = document.createElement("p");
      let errorMsg = document.createTextNode("Invalid e-mail.");
      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert", "alert-danger", "my-3");
      emailInput.after(p);
      error = true;
    }

    if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      //alert("The password must be between 3 and 50 characters long.");
      let p = document.createElement("p");
      let errorMsg = document.createTextNode(
        "The password must be between 3 and 50 characters long."
      );
      p.appendChild(errorMsg);
      p.classList.add("erro");
      p.classList.add("alert", "alert-danger", "my-3");
      passwordInput.after(p);
      error = true;
    }

    if (!error) el.submit();
  }
}
