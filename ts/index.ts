/**
 * Initialiser for kiniauth
 */
import KaSignin from "./components/ka-signin";
import Configuration from "./configuration";
import Ka2fa from "./components/ka-2fa";
import KaRecaptcha from "./components/ka-recaptcha";
import KaRegister from "./components/ka-register";
import KaActivate from "./components/ka-activate";
import KaPasswordReset from "./components/ka-password-reset";
import KaNewPassword from "./components/ka-new-password";
import KaSession from './components/ka-session';
import * as kinibind from '../node_modules/kinibind/dist/kinibind';
import KaContact from './components/ka-contact';
import KaInvitation from "./components/ka-invitation";
import KaSignout from "./components/ka-signout";

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


        // Bind elements - designed to be overridden if required in sub projects
        this.bindElements();

    }


    public bindElements() {

        kinibind._prefix = "ka";
        kinibind._fullPrefix = "ka-";
        kinibind._visibilityCallback = Configuration.elementVisibilityFunction;

        // Create the custom elements we need
        customElements.define('ka-recaptcha', KaRecaptcha);
        customElements.define('ka-signin', KaSignin);
        customElements.define('ka-signout', KaSignout);
        customElements.define("ka-2fa", Ka2fa);
        customElements.define("ka-password-reset", KaPasswordReset);
        customElements.define("ka-new-password", KaNewPassword);
        customElements.define("ka-register", KaRegister);
        customElements.define("ka-activate", KaActivate);
        customElements.define("ka-session", KaSession);
        customElements.define("ka-contact", KaContact);
        customElements.define("ka-invitation", KaInvitation);
    }


}



