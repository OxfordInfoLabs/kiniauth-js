import Configuration from "./configuration";

/**
 * API methods for accessing backend via fetch
 */
export default class Api {

    /**
     * Login with username and password
     *
     * @param username
     * @param password
     *
     * @return Promise
     */
    public login(emailAddress, password) {
        return this.callAPI(Configuration.endpoint + "/guest/auth/login?emailAddress=" + emailAddress + "&password=" + password);
    }


    /**
     * Supply two factor code where accounts require it.
     *
     * @param code
     */
    public twoFactor(code) {
        return this.callAPI(Configuration.endpoint + "/guest/auth/twoFactor?code=" + code);
    }


    /**
     * Call an API using fetch
     *
     * @param url
     * @param params
     * @param method
     */
    private callAPI(url: string, params: any = {}, method: string = "GET") {

        return fetch(url, {
            method: method,
            credentials: "include"
        });

    }

}
