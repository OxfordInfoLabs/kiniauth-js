import Validation from "../framework/validation";
import ElementSpinner from "../framework/element-spinner";
import Api from "../framework/api";
import RequestParams from "../framework/request-params";

/**
 * Account activation component.
 */
export default class KaActivate extends HTMLElement {

    // Store success url
    private successUrl;

    constructor() {
        super();
        this.bind();
    }


    /**
     * Bind method
     */
    private bind() {

        // Resolve the success url, prioritising a passed request param, falling back to a data attribute or /
        this.successUrl = RequestParams.get().successUrl ? RequestParams.get().successUrl : (
            this.getAttribute("data-success-url") ? this.getAttribute("data-success-url") : "/");


        // Pick up sign in events.
        this.querySelector("[data-activate]").addEventListener("submit", (event) => {
            event.preventDefault();

            Validation.resetFields(this, ["code"]);

            if (this.validate()) {

                var code: HTMLInputElement = this.querySelector("[data-code-field]");

                // Grab submit button
                var submitButton: HTMLButtonElement = this.querySelector("[type='submit']");
                ElementSpinner.spinElement(submitButton);

                let api = new Api();

                api.activateAccount(code.value).then((response) => {
                    ElementSpinner.restoreElement(submitButton);
                    if (response.ok) {
                        window.location.href = this.successUrl;
                    } else {
                        response.json().then((json) => {

                            let message = json.validationErrors ? json.validationErrors.activationCode.errorMessage : json.message;

                            Validation.setFieldError(this, "code", true, message);
                        });
                    }
                });


            }


        });

    }


    /**
     * Validate method
     */
    private validate() {

        return Validation.validateRequiredFields(this, {
            "2fa": "A 2FA authentication code is required"
        });

    }

}
