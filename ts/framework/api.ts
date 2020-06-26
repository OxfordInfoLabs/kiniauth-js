import Configuration from '../configuration';
import Session from "./session";

/**
 * API methods for accessing backend via fetch
 */
export default class Api {

    /**
     * Login with username and password
     *
     * @param emailAddress
     * @param password
     * @param captcha
     *
     * @return Promise
     */
    public login(emailAddress, password, captcha?) {
        let url = '/guest/auth/login';
        const params: any = {
            emailAddress,
            password: encodeURIComponent(password)
        }

        if (captcha) {
            url += '?captcha=' + captcha;
        }

        return this.callAPI(url, params, 'POST');
    }


    /**
     * Logout API.
     */
    public logout() {
        return this.callAPI('/guest/auth/logout');
    }


    /**
     * Close active sessions
     */
    public closeActiveSessions() {
        return this.callAPI("/guest/auth/closeActiveSessions");
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
    public createNewAccount(emailAddress, name, accountName, password, captcha, username = null, customFields = {}) {
        return this.callAPI('/guest/registration/create?captcha=' + captcha, {
            ...{
                emailAddress: emailAddress,
                name: name,
                accountName: accountName,
                password: password,
                username: username
            }, ...customFields
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
     *
     * Get an invitation email for a code.
     *
     * @param invitationCode
     */
    public getInvitationDetails(invitationCode) {
        return this.callAPI('/guest/registration/invitation/' + invitationCode);
    }


    /**
     * Accept an invitation
     *
     * @param invitationCode
     * @param name
     * @param password
     */
    public acceptInvitation(invitationCode, name, password) {
        return this.callAPI('/guest/registration/invitation/' + invitationCode, {
            name: name,
            password: password
        }, 'POST');
    }


    /**
     * Request a password reset
     *
     * @param emailAddress
     */
    public requestPasswordReset(emailAddress, captcha) {
        return this.callAPI('/guest/auth/passwordReset?emailAddress=' + emailAddress + '&captcha=' + captcha);
    }


    /**
     * Reset the password using a reset code.
     *
     * @param newPassword
     * @param resetCode
     */
    public resetPassword(newPassword, resetCode, captcha) {
        return this.callAPI('/guest/auth/passwordReset?captcha=' + captcha, {
            newPassword: newPassword,
            resetCode: resetCode
        }, 'POST');
    }


    /**
     * Unlock user
     *
     * @param unlockCode
     */
    public unlockUser(unlockCode) {
        return this.callAPI('/guest/auth/unlockUser/' + unlockCode);
    }


    public getSessionData() {
        return this.callAPI('/guest/session')
            .then((response) => {
                if (response.ok) {
                    return response.text().then(function (text) {
                        let response = text ? JSON.parse(text) : {};
                        if (response.sessionId) {
                            document.cookie = "PHPSESSID=" + response.sessionId + ";path=/;domain=" + Configuration.endpoint;
                        }
                        return response;
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
        return this.callAPI('/account/contact/' + contactId, true)
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
        return this.callAPI('/account/contact/save', contact, 'POST', true);
    }

    /**
     * Call an API using fetch
     *
     * @param url
     * @param params
     * @param method
     */
    public callAPI(url: string, params: any = {}, method: string = 'GET', csrf: boolean = false) {

        if (csrf) {
            return Session.getSessionData().then(session => {
                return this.makeAPICall(url, params, method, session)
            });
        } else {
            return this.makeAPICall(url, params, method);
        }

    }

    private makeAPICall(url: string, params: any = {}, method: string = 'GET', sessionData = null): Promise<Response> {

        if (url.indexOf("local:") == 0) {
            url = url.substr(6);
        } else {

            if (url.indexOf("http") < 0)
                url = Configuration.endpoint + url;

        }


        var obj: any = {
            method: method,
            credentials: 'include'
        };

        if (sessionData) {
            obj.headers = {
                'X-CSRF-TOKEN': sessionData.csrfToken
            };
        }

        if (method != 'GET') {
            obj.body = JSON.stringify(params);
        }

        return fetch(url, obj);

    }


}
