import Configuration from "../configuration";
import * as kinibind from '../../node_modules/kinibind/dist/kinibind';
import Api from "../framework/api";

export default class KaSession extends HTMLElement {

    private static sessionData: any;

    constructor(){
        super();

        if (!KaSession.sessionData) {
            let view = kinibind.bind(this, {
                info: {}
            });
            let api = new Api();
            api.getSessionData().then(data => {
                KaSession.sessionData = data;
                view.models.info = data;
            })
        } else {
            kinibind.bind(this, {
                info: KaSession.sessionData
            });
        }
    }
}
