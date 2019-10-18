/**
 * Sign in form component for Kini Auth based systems
 */
import Validation from "../framework/validation";
import Configuration from "../configuration";
import ElementSpinner from "../util/element-spinner";
import RequestParams from "../util/request-params";
import Api from "../framework/api";
import KaRecaptcha from "./ka-recaptcha";
import StandardForm from "./standard-form";

export default class KaSignin extends StandardForm {


    private twoFactorURL = this.getAttribute("data-two-factor-url");

    /**
     * Construct new element
     */
    constructor() {
        super({
            "email": {
                required: "The email address is required"
            },
            "password": {
                required: "A password is required"
            }
        },false);
    }


    public submitForm(fieldValues: any): Promise<any> {
        let api = new Api();
        return api.login(fieldValues.email, fieldValues.password);
    }

    public success(jsonResponse: any) {

        var signinSuccessURL = RequestParams.get().signinSuccessURL ? RequestParams.get().signinSuccessURL : "/";

        if (jsonResponse === 'REQUIRES_2FA') {
            if (this.twoFactorURL) {
                window.location.href = this.twoFactorURL + '?signinSuccessURL=' + signinSuccessURL;
            } else {
                alert("No 2FA URL has been configured for two factor logins");
            }
        } else {
            window.location.href = signinSuccessURL;
        }


    }

    public failure(jsonResponse: any) {
        Validation.setFieldError(this, "password", true, jsonResponse.message);
    }


}
