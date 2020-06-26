/**
 * Simple close sessions component.
 */
import Api from "../framework/api";
import RequestParams from "../util/request-params";

export default class KaCloseSessions extends HTMLElement {

    // Constructor
    constructor() {
        super();
        this.init();
    }

    // Init method
    private init() {

        this.querySelector("[data-close-sessions]").addEventListener("click", (event) => {
            event.preventDefault();

            let api = new Api();
            api.closeActiveSessions().then(result => {

                if (result.ok) {

                    result.json().then(value => {
                        if (value == "LOGGED_IN") {
                            window.location.href = RequestParams.get()["signinSuccessURL"];
                        } else if (value == "REQUIRES_2FA"){
                            window.location.href = RequestParams.get()["twoFactorURL"];
                        }
                    });

                } else {
                    result.json().then(value => {
                        this.querySelector("[data-error-message]").innerHTML = value.message;
                    });
                }
            });

        });

    }

}
