import Api from "./api";

export default class Session {

    private static sessionData: any;

    /**
     * Get session data once
     */
    public static getSessionData(): Promise<any> {
        if (!this.sessionData) {
            let api = new Api();
            this.sessionData = api.getSessionData();
        }
        return this.sessionData;

    }

}
