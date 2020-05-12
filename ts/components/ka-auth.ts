/**
 * Authentication component evaluates a supplied boolean expression supplied as an attribute
 * and if the expression evaluates to false the configured redirect url is called.
 *
 * Expressions have access to two key variables:
 *
 * session - the returned session as used in ka-session.
 * request - the request parameters passed to the page.
 *
 */
import KaSession from "./ka-session";
import RequestParams from "../util/request-params";
import Configuration from "../configuration";

export default class KaAuth extends HTMLElement {

    constructor() {
        super();
        this.init();
    }


    // Perform main action
    private init() {

        if (!this.getAttribute("data-authorised") || !this.getAttribute("data-redirect-url")) {
            alert("Missing authorised expression or redirect url for auth component");
        } else {

            KaSession.getSessionData().then((session) => {
                let request = RequestParams.get();

                let expression = this.getAttribute("data-authorised");

                let valid = eval(expression);

                if (valid) {
                    Configuration.elementVisibilityFunction(this, true);
                } else {
                    window.location.href = this.getAttribute("data-redirect-url");
                }


            });
        }
    }

}
