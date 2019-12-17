import KaRecaptcha from "./ka-recaptcha";
import RequestParams from "../util/request-params";
import Validation from "../framework/validation";
import ElementSpinner from "../util/element-spinner";
import Api from "../framework/api";
import StandardForm from "./standard-form";

/**
 * Register component
 */
export default class KaRegister extends StandardForm {


    // Url for the activation screen.
    private activationUrl;

    // Register success url - once activation is complete
    private successUrl;


    /**
     * Construct new element
     */
    constructor() {
        super({
            "email": {
                email: "You must supply a valid email address",
                required: "The email address is required"
            },
            "name": {
                required: "Your name is required"
            },
            "accountname": {
                required: "The account name is required"
            },
            "password": {
                password: "Passwords must be at least 8 characters with one number, one uppercase and one lowercase letter",
                required: "A password is required"
            },
            "accept": {
                required: "you must accept the terms and conditions"
            }
        });


        // Resolve the success url, prioritising a passed request param, falling back to a data attribute or /
        this.successUrl = RequestParams.get().successUrl ? RequestParams.get().successUrl : (
            this.getAttribute("data-success-url") ? this.getAttribute("data-success-url") : "/");

        this.activationUrl = this.getAttribute("data-activation-url");
        if (!this.activationUrl) {
            alert("You must supply a data-activation-url attribute to ka-register for the follow on activation screen");
        }


    }


    public submitForm(fieldValues: any): Promise<any> {
        let api = new Api();
        return api.createNewAccount(fieldValues.email, fieldValues.name,  fieldValues.accountName, fieldValues.password);
    }

    public success(jsonResponse: any) {
        window.location.href = this.activationUrl + "?successUrl=" + this.successUrl;
    }

    public failure(jsonResponse: any) {
        if (jsonResponse.validationErrors) {

            if (jsonResponse.validationErrors.emailAddress) {
                Validation.setFieldError(this, "email", true, jsonResponse.validationErrors.emailAddress.email.errorMessage);
            }
        } else {
            Validation.setFieldError(this, "password", true, jsonResponse.message);
        }
    }


}
