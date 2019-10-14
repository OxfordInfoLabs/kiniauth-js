/**
 * Sign in form component for Kini Auth based systems
 */
import Validation from "../framework/validation";
import Configuration from "../framework/configuration";
import ElementSpinner from "../framework/element-spinner";
import RequestParams from "../framework/request-params";

export default class KaSignin extends HTMLElement {

    private twoFactorURL = this.getAttribute("data-two-factor-url");

    /**
     * Construct new element
     */
    constructor() {
        super();
        this.bind();
    }

    // Bind components.
    private bind() {


        // Pick up sign in events.
        this.querySelector("[data-signin]").addEventListener("submit", (event) => {
            event.preventDefault();

            Validation.resetFields(this, ["email", "password", "general"]);

            if (this.validate()) {

                var emailAddress: HTMLInputElement = this.querySelector("[data-email-field]");
                var password: HTMLInputElement = this.querySelector("[data-password-field]");

                // Grab submit button
                var submitButton: HTMLButtonElement = this.querySelector("[type='submit']");
                ElementSpinner.spinElement(submitButton);

                fetch(Configuration.endpoint + "/guest/auth/login?emailAddress=" + emailAddress.value + "&password=" + password.value).then((response) => {
                    ElementSpinner.restoreElement(submitButton);
                    if (response.ok) {
                        var signinSuccessURL = RequestParams.get().signinSuccessURL ? RequestParams.get().signinSuccessURL : "/";

                        response.json().then((json) => {
                            if (json === 'REQUIRES_2FA') {
                                if (this.twoFactorURL) {
                                    window.location.href = this.twoFactorURL + '?signinSuccessURL=' + signinSuccessURL;
                                } else {
                                    alert("No 2FA URL has been configured for two factor logins");
                                }
                            } else {
                                window.location.href = signinSuccessURL;
                            }
                        });


                    } else {
                        response.json().then((json) => {
                            Validation.setFieldError(this, "general", true, json.message);
                        });
                    }
                });
            }

        });


    }


    // Validate components
    private validate(): boolean {

        var valid = true;

        valid = Validation.validateRequiredFields(this, {
            "email": "The email address is required",
            "password": "The password is required"
        });

        return valid;

    }


}
