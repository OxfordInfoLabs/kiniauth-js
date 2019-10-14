import Validation from "../framework/validation";
import ElementSpinner from "../framework/element-spinner";
import Configuration from "../framework/configuration";
import RequestParams from "../framework/request-params";

/**
 * Two factor authentication JS widget
 */
export default class Ka2fa extends HTMLElement {


    /**
     * Construct new element
     */
    constructor() {
        super();
        this.bind();
    }


    /**
     * Bind method
     */
    private bind() {
        // Pick up sign in events.
        this.querySelector("[data-2fa]").addEventListener("submit", (event) => {
            event.preventDefault();

            Validation.resetFields(this, ["2fa", "general"]);

            if (this.validate()) {

                var twoFA: HTMLInputElement = this.querySelector("[data-2fa-field]");

                // Grab submit button
                var submitButton: HTMLButtonElement = this.querySelector("[type='submit']");
                ElementSpinner.spinElement(submitButton);

                fetch(Configuration.endpoint + "/guest/auth/twoFactor?code=" + twoFA.value).then((response) => {
                    ElementSpinner.restoreElement(submitButton);
                    if (response.ok) {
                        var signinSuccessURL = RequestParams.get().signinSuccessURL ? RequestParams.get().signinSuccessURL : "/";
                        window.location.href = signinSuccessURL;
                    } else {
                        response.json().then((json) => {
                            Validation.setFieldError(this, "general", true, json.message);
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
