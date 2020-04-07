import Api from "../framework/api";
import Kinivue from "../framework/kinivue";

export default class KaSession extends HTMLElement {

    private static sessionData: any;

    constructor() {

        super();

        let view = new Kinivue({
            el: this.querySelector(".vue-wrapper"),
            data: {
                info: {}
            }
        });

        // Update the session data.
        KaSession.getSessionData().then((sessionData) => {
            sessionData.response = 1;

            view.$data.info = sessionData;
        });


    }

    /**
     * Get session data once
     */
    private static getSessionData(): Promise<any> {
        if (!KaSession.sessionData) {
            let api = new Api();
            KaSession.sessionData = api.getSessionData();
        }
        return KaSession.sessionData;

    }
}
