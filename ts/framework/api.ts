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
     * Create a new account
     *
     * @param emailAddress
     * @param accountName
     * @param password
     */
    public createNewAccount(emailAddress, accountName, password) {
        return this.callAPI(Configuration.endpoint + "/guest/registration/create", {
            emailAddress: emailAddress,
            accountName: accountName,
            password: password
        }, "POST");
    }


    /**
     * Activate an account using a code
     *
     * @param activationCode
     */
    public activateAccount(activationCode) {
        return this.callAPI(Configuration.endpoint + "/guest/registration/activate/" + activationCode);
    }


    /**
     * Call an API using fetch
     *
     * @param url
     * @param params
     * @param method
     */
    private callAPI(url: string, params: any = {}, method: string = "GET") {

        var obj: any = {
            method: method,
            credentials: "include"
        };

        if (method != "GET") {
            obj.body = JSON.stringify(params);
        }

        return fetch(url, obj);

    }

}
