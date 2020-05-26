import RequestParams from "../util/request-params";
import Api from "../framework/api";
import KaRecaptcha from "./ka-recaptcha";
import Configuration from "../configuration";
import ElementSpinner from "../util/element-spinner";
import Kinibind from "../framework/kinibind";


/**
 * Register component
 */
export default class KaDynamicForm extends HTMLElement {

    // Kinibind view
    protected view;

    private errorsGenerated = false;


    // Construct a dynamic form dynamically
    constructor(extraData = {}, extraMethods = {}) {

        super();
        this.init(extraData, extraMethods);

    }

    // Initialise the dynamic form
    private init(extraData = {}, extraMethods = {}) {

        let store = this.getAttribute("data-store");

        // If a new form, clear storage and reload without new form
        if (RequestParams.get().newForm) {
            sessionStorage.removeItem(store);
            window.location.replace(window.location.href.replace(/[\?&]newForm=1/, ''));
            return;
        }


        let rawData = sessionStorage.getItem(store);
        let data = rawData ? JSON.parse(rawData) : {};


        let defaultDataString = this.getAttribute("data-default-data");
        if (defaultDataString) {
            let defaultData: any = JSON.parse(defaultDataString.trim());
            data = {...defaultData, ...data};
        }

        let model = {
            data: data,
            errors: {},
            serverErrors: {},
            dateTime: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
            date: new Date().toDateString(),
            valid: false
        };

        model = {...extraData, ...model};

        let methods = {
            setDataItem: (key, value) => {
                this.setDataItem(key, value);
            },
            toggleMulti: (key, setValue) => {

                let values = [];

                let data = this.view.getModelItem("data");

                if (data[key] instanceof Array) {
                    values = data[key];
                }
                let existingValue = values.indexOf(setValue);
                if (existingValue >= 0) {
                    values.splice(existingValue, 1);
                } else {
                    values.push(setValue);
                }

                this.setDataItem(key, values);

            }
        };

        model = {...model, ...extraMethods, ...methods};


        // Create the view
        this.view = new Kinibind(this,
            model
        );


        this.addEventListener("submit", (event) => {
            event.preventDefault();

            // Validate the form
            let valid = this.validate(true);

            // If valid process submission.
            if (valid) {
                this.processSubmission();
            }

        })

        // Add change and click listeners to keep valid in check.
        this.addEventListener("input", () => {
            this.validate(false);
        })

        this.addEventListener("click", () => {
            this.validate(false);
        })

        // Do an initial validation to generate the valid flag
        this.validate(false);

    }


    // Process submission
    protected processSubmission() {

        let data = this.view.getModelItem("data");

        let submitUrl = this.getAttribute("data-submit-url");

        let captcha = <KaRecaptcha>this.querySelector(Configuration.componentPrefix + "-recaptcha");
        if (captcha && captcha.getResponse()) {
            submitUrl += "?captcha=" + captcha.getResponse();
        }


        this.setButtonSpinStatus(true);


        if (submitUrl) {
            let api = new Api();
            api.callAPI(submitUrl, data, "POST").then((response) => {

                response.json().then((data) => {

                    // If OK response, continue
                    if (response.ok) {
                        this.processSuccess(data);
                    } else {

                        let serverErrors = {};

                        if (data.validationErrors) {
                            serverErrors = data.validationErrors;
                        } else {
                            serverErrors = {
                                "global": {
                                    "error": {
                                        "errorMessage": data.message
                                    }
                                }
                            };
                        }

                        let errorString = "The following unexpected errors occurred:\n";
                        for (var field in serverErrors) {
                            let typedErrors = serverErrors[field];
                            for (var type in typedErrors) {
                                errorString += "\n" + typedErrors[type]["errorMessage"];
                            }
                        }

                        alert(errorString);

                        this.setButtonSpinStatus(false);

                    }


                });


            });
        } else {

            // Store the data in session storage
            let store = this.getAttribute("data-store");
            sessionStorage.setItem(store, JSON.stringify(data));

            // Process success
            this.processSuccess();

        }


    }


    // Continue to next page
    private processSuccess(identifier = null) {

        let successUrl = this.getAttribute("data-success-url");

        if (successUrl) {
            window.location.href = successUrl + (identifier ? "?identifier=" + identifier : "");
        } else {
            this.setButtonSpinStatus(false);
        }
    }

    // Validate the form
    protected validate(generateErrors) {

        let valid = true;
        let errors = {};

        if (!this.view) {
            return false;
        }

        let data = this.view.getModelItem("data");


        this.querySelectorAll("[data-validation]").forEach((item) => {
            let field = item.getAttribute("data-field");
            let validations = item.getAttribute("data-validation").split(",");

            let dataValue = data[field];

            // Now validate the value
            validations.forEach((validation) => {

                let fieldValid = true;

                switch (validation.trim()) {
                    case "required":
                        fieldValid = fieldValid && (dataValue instanceof Array ? dataValue.length > 0 : dataValue);
                        break;
                    case "maxwords":
                        fieldValid = fieldValid && (!dataValue || dataValue.split(/\W/).length <= Number(item.getAttribute("data-max-words")));
                        break;
                }

                if (!fieldValid) errors[field] = validation;
                valid = valid && fieldValid;
            })

        });

        let captcha = <KaRecaptcha>this.querySelector(Configuration.componentPrefix + "-recaptcha");

        if (captcha && !captcha.getResponse()) {
            errors["recaptcha"] = "required";
            valid = false;
        }

        let modelErrors = this.view.getModelItem("errors");

        if (generateErrors) {
            if (Object.keys(modelErrors).length != Object.keys(errors).length) {
                this.view.setModelItem("errors", errors);
                this.errorsGenerated = true;
            }
        } else {

            if (Object.keys(modelErrors).length != 0) {
                this.view.setModelItem("errors", {});
            }
        }

        this.view.setModelItem("valid", valid);

        return valid;
    }


    private setButtonSpinStatus(spinning) {
        // Set spinning status
        this.querySelectorAll("[type='submit']").forEach((element: any) => {

            if (spinning) {
                ElementSpinner.spinElement(element);
            } else {
                ElementSpinner.restoreElement(element);
            }

        });
    }


    /**
     * Set a data item
     *
     * @param key
     * @param value
     */
    protected setDataItem(key, value) {
        let data = this.view.getModelItem("data");
        data[key] = value;
    }
}
