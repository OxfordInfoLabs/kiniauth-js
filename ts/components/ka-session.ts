import Configuration from "../configuration";
import * as kinibind from '../../node_modules/kinibind/dist/kinibind';
import Api from "../framework/api";

export default class KaSession extends HTMLElement {

    private static sessionData: any;

    constructor() {
        super();

        let view = kinibind.bind(this, {
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
