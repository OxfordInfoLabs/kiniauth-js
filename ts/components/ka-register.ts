import KaRecaptcha from "./ka-recaptcha";
import RequestParams from "../framework/request-params";
import Validation from "../framework/validation";
import ElementSpinner from "../framework/element-spinner";
import Api from "../framework/api";

/**
 * Register component
 */
export default class KaRegister extends HTMLElement {


    // Url for the activation screen.
    private activationUrl;

    // Register success url - once activation is complete
    private successUrl;


    // has recaptcha
    private recaptcha: KaRecaptcha = null;


    /**
     * Construct new element
     */
    constructor() {
        super();
        this.bind();
    }

    // Bind components.
    private bind() {

        // Resolve the success url, prioritising a passed request param, falling back to a data attribute or /
        this.successUrl = RequestParams.get().successUrl ? RequestParams.get().successUrl : (
            this.getAttribute("data-success-url") ? this.getAttribute("data-success-url") : "/");

        this.activationUrl = this.getAttribute("data-activation-url");
        if (!this.activationUrl) {
            alert("You must supply a data-activation-url attribute to ka-register for the follow on activation screen");
        }

        // Check for a recaptcha
        let recaptchas = this.getElementsByTagName("ka-recaptcha");
        if (recaptchas.length > 0) {
            this.recaptcha = <KaRecaptcha>recaptchas.item(0);
        }


        // Pick up sign in events.
        this.querySelector("[data-register]").addEventListener("submit", (event) => {
            event.preventDefault();

            Validation.resetFields(this, ["email", "name", "password", "accept", "recaptcha", "general"]);

            if (this.validate()) {

                var emailAddress: HTMLInputElement = this.querySelector("[data-email-field]");
                var accountName: HTMLInputElement = this.querySelector("[data-name-field]");
                var password: HTMLInputElement = this.querySelector("[data-password-field]");

                // Grab submit button
                var submitButton: HTMLButtonElement = this.querySelector("[type='submit']");
                ElementSpinner.spinElement(submitButton);

                let api = new Api();
                api.createNewAccount(emailAddress.value, accountName.value, password.value).then((response) => {
                    ElementSpinner.restoreElement(submitButton);

                    // If we get a successful response, forward to the activation URL.
                    if (response.ok) {
                        window.location.href = this.activationUrl + "?successUrl=" + this.successUrl;
                    } else {
                        response.json().then((json) => {
                            if (json.validationErrors) {

                                if (json.validationErrors.emailAddress) {
                                    Validation.setFieldError(this, "email", true, json.validationErrors.emailAddress.errorMessage);
                                }
                            } else {
                                Validation.setFieldError(this, "general", true, json.message);
                            }
                        });
                    }

                });

            }


        });


    }

    /**
     * Return a boolean indicating whether or not this is valid.
     */
    private validate() {

        let valid: boolean = true;

        valid = Validation.validatePasswordFields(this, {"password": "Passwords must be at least 8 characters with one number, one uppercase and one lowercase letter"});

        valid = Validation.validateRequiredFields(this,
            {
                "email": "The email address is required",
                "name": "The account name is required",
                "password": "A password is required",
                "accept": "you must accept the terms and conditions"
            }) && valid;

        valid = Validation.validateRecaptcha(this, "You must complete the Captcha") && valid;

        return valid;
    }

}
