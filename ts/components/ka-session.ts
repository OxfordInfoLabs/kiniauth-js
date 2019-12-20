import Configuration from "../configuration";
import Api from "../framework/api";
import Kiniauth from '../index';

export default class KaSession extends HTMLElement {

    private static sessionData: any;

    constructor() {
        super();

        let view = Kiniauth.kinibind.bind(this, {
            info: {}
        });

        // Update the session data.
        KaSession.getSessionData().then((sessionData) => {
            view.models.info = sessionData;
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
