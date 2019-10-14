/**
 * Initialiser for kiniauth
 */
import KaSignin from "./components/ka-signin";
import Configuration from "./framework/configuration";
import Ka2fa from "./components/ka-2fa";

export default class Kiniauth {

    constructor(params: any) {

        if (!params.endpoint) {
            alert("You must supply an endpoint for the Kiniauth web components");
        } else {
            Configuration.endpoint = params.endpoint;
        }

        if (params.elementVisibilityFunction) {
            Configuration.elementVisibilityFunction = params.elementVisibilityFunction;
        }
    }

}

// Create the custom elements we need
customElements.define('ka-signin', KaSignin);
customElements.define("ka-2fa", Ka2fa);

