/**
 * Initialiser for kiniauth
 */
import KaSignin from "./components/ka-signin";
import Configuration from "./framework/configuration";
import Ka2fa from "./components/ka-2fa";
import KaRecaptcha from "./components/ka-recaptcha";

export default class Kiniauth {

    constructor(params: any) {

        if (!params.endpoint) {
            alert("You must supply an endpoint for the Kiniauth web components");
        } else {
            Configuration.endpoint = params.endpoint;
        }

        if (params.recaptchaKey)
            Configuration.recaptchaKey = params.recaptchaKey;

        if (params.elementVisibilityFunction) {
            Configuration.elementVisibilityFunction = params.elementVisibilityFunction;
        }


        // Create the custom elements we need
        customElements.define('ka-recaptcha', KaRecaptcha);
        customElements.define('ka-signin', KaSignin);
        customElements.define("ka-2fa", Ka2fa);
    }

}



