import Configuration from '../configuration';

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
        return this.callAPI('/guest/auth/login?emailAddress=' + emailAddress + '&password=' + password);
    }


    /**
     * Supply two factor code where accounts require it.
     *
     * @param code
     */
    public twoFactor(code) {
        return this.callAPI('/guest/auth/twoFactor?code=' + code);
    }


    /**
     * Create a new account
     *
     * @param emailAddress
     * @param accountName
     * @param password
     */
    public createNewAccount(emailAddress, accountName, password) {
        return this.callAPI('/guest/registration/create', {
            emailAddress: emailAddress,
            accountName: accountName,
            password: password
        }, 'POST');
    }


    /**
     * Activate an account using a code
     *
     * @param activationCode
     */
    public activateAccount(activationCode) {
        return this.callAPI('/guest/registration/activate/' + activationCode);
    }


    /**
     * Request a password reset
     *
     * @param emailAddress
     */
    public requestPasswordReset(emailAddress) {
        return this.callAPI('/guest/auth/passwordReset?emailAddress=' + emailAddress);
    }


    /**
     * Reset the password using a reset code.
     *
     * @param newPassword
     * @param resetCode
     */
    public resetPassword(newPassword, resetCode) {
        return this.callAPI('/guest/auth/passwordReset', { newPassword: newPassword, resetCode: resetCode }, 'POST');
    }

    public getSessionData() {
        return this.callAPI('/guest/session')
            .then((response) => {
                if (response.ok) {
                    return response.text().then(function (text) {
                        return text ? JSON.parse(text) : {}
                    })
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                return data;
            });
    }

    public getContact(contactId) {
        return this.callAPI('/account/contact/' + contactId)
            .then((response) => {
                if (response.ok) {
                    return response.text().then(function (text) {
                        return text ? JSON.parse(text) : {}
                    })
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                return data;
            });
    }

    public saveContact(contact) {
        return this.callAPI('/account/contact/save', contact, 'POST');
    }

    /**
     * Call an API using fetch
     *
     * @param url
     * @param params
     * @param method
     */
    private callAPI(url: string, params: any = {}, method: string = 'GET') {

        url = Configuration.endpoint + url;

        var obj: any = {
            method: method,
            credentials: 'include'
        };

        if (method != 'GET') {
            obj.body = JSON.stringify(params);
        }

        return fetch(url, obj);

    }

}
