/**
 * Recaptcha component if being used.
 */
import Configuration from "../framework/configuration";

export default class KaRecaptcha extends HTMLElement {

    // Static instance index
    private static instanceIndex = 0;

    // Instance id
    private instanceId;

    // Rendered flag
    private rendered = false;

    /**
     * Constructor
     */
    constructor() {

        super();

        if (Configuration.recaptchaKey) {

            KaRecaptcha.instanceIndex++;
            this.instanceId = "recaptcha_" + KaRecaptcha.instanceIndex;

            if (KaRecaptcha.instanceIndex == 1)
                this.loadScript();
        } else {
            alert("You need to configure a recaptcha key to use the ka-recaptcha component");
        }
    }


    /**
     * Render this recaptcha instance.
     */
    public render() {
        if (!this.rendered) {
            let instance = document.createElement("div");
            instance.id = this.instanceId;
            this.appendChild(instance);

            if (!window["grecaptcha"]) {
                setTimeout(() => {
                    this.render()
                }, 500);
            } else {
                window["grecaptcha"].render(this.instanceId, {
                    'sitekey': Configuration.recaptchaKey
                });
            }

            this.rendered = true;
        } else {
            window["grecaptcha"].reset();
        }
    }


    /**
     * Check whether or not this recaptcha is completed.
     */
    public getResponse(): string {
        return window["grecaptcha"].getResponse();
    }


    // Load the script
    private loadScript() {

        let script: HTMLScriptElement = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://www.google.com/recaptcha/api.js";

        document.getElementsByTagName("body")[0].appendChild(script);

    }


}
