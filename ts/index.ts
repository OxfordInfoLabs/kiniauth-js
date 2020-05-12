/**
 * Initialiser for kiniauth
 */
import '@webcomponents/custom-elements';
import KaSignin from './components/ka-signin';
import Configuration from './configuration';
import Ka2fa from './components/ka-2fa';
import KaRecaptcha from './components/ka-recaptcha';
import KaRegister from './components/ka-register';
import KaActivate from './components/ka-activate';
import KaPasswordReset from './components/ka-password-reset';
import KaNewPassword from './components/ka-new-password';
import KaSession from './components/ka-session';
import KaContact from './components/ka-contact';
import KaInvitation from './components/ka-invitation';
import KaSignout from './components/ka-signout';
import KaDynamicForm from "./components/ka-dynamic-form";
import KaBind from "./components/ka-bind";
import KaAuth from "./components/ka-auth";

export default class Kiniauth {

    constructor(params: any) {

        if (!params.endpoint) {
            alert('You must supply an endpoint for the Kiniauth web components');
        } else {
            Configuration.endpoint = params.endpoint;
        }

        if (params.recaptchaKey)
            Configuration.recaptchaKey = params.recaptchaKey;

        if (params.componentPrefix)
            Configuration.componentPrefix = params.componentPrefix ? params.componentPrefix : "ka";

        if (params.elementVisibilityFunction) {
            Configuration.elementVisibilityFunction = params.elementVisibilityFunction;
        }

        this.bindElements();

    }


    public bindElements() {

        // Create the custom elements we need
        customElements.define('ka-bind', KaBind);
        customElements.define('ka-recaptcha', KaRecaptcha);
        customElements.define('ka-signin', KaSignin);
        customElements.define('ka-signout', KaSignout);
        customElements.define('ka-2fa', Ka2fa);
        customElements.define('ka-password-reset', KaPasswordReset);
        customElements.define('ka-new-password', KaNewPassword);
        customElements.define('ka-register', KaRegister);
        customElements.define('ka-activate', KaActivate);
        customElements.define('ka-session', KaSession);
        customElements.define('ka-auth', KaAuth);
        customElements.define('ka-contact', KaContact);
        customElements.define('ka-invitation', KaInvitation);
        customElements.define('ka-dynamic-form', KaDynamicForm);
    }


}



