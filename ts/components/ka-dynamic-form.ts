import Kinivue from "../framework/kinivue";
import Vue from "vue";
import RequestParams from "../util/request-params";
import KaSession from "./ka-session";

/**
 * Register component
 */
export default class KaDynamicForm extends HTMLElement {

    // Kinibind view
    private view;

    private errorsGenerated = false;


    // Construct a dynamic form dynamically
    constructor() {

        super();
        this.init();

    }

    // Initialise the dynamic form
    private init() {

        let store = this.getAttribute("data-store");

        // If a new form, clear storage and reload without new form
        if (RequestParams.get().newForm) {
            sessionStorage.removeItem(store);
            window.location.replace(window.location.href.replace(/[\?&]newForm=1/, ''));
            return;
        }


        let rawData = sessionStorage.getItem(store);
        let data = rawData ? JSON.parse(rawData) : {};


        KaSession.getSessionData().then(session => {

            let defaultDataString = this.getAttribute("data-default-data");
            if (defaultDataString) {
                let defaultData: any;
                eval("defaultData = " + defaultDataString);
                data = {...defaultData, ...data};
            }

            // Create the view
            this.view = new Kinivue({
                el: this.querySelector("form"),
                data: {
                    data: data,
                    errors: {},
                    dateTime: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
                    date: new Date().toDateString(),
                    valid: false,
                    session: session
                },
                methods: {
                    set: (key, value) => {
                        this.setDataValue(key, value);
                    },
                    toggleMulti: (key, setValue) => {

                        let values = [];

                        if (this.view.data[key]) {
                            values = this.view.data[key];
                        }
                        let existingValue = values.indexOf(setValue);
                        if (existingValue >= 0) {
                            values.splice(existingValue, 1);
                        } else {
                            values.push(setValue);
                        }


                        this.setDataValue(key, values);

                    },
                    numberOfWords: function (key) {
                        if (this.data[key]) {
                            return this.data[key].split(/\W/).length;
                        } else {
                            return 0;
                        }
                    }
                },
                updated: () => {
                    this.validate(this.errorsGenerated);
                }

            });

        });


        this.addEventListener("submit", (event) => {
            event.preventDefault();

            // Validate the form
            let valid = this.validate(true);

            // If valid process submission.
            if (valid) {
                this.processSubmission();
            }

        })

        // Do an initial validation to generate the valid flag
        this.validate(false);

    }


    // Process submission
    private processSubmission() {

        let data = this.view.data;

        if (this.getAttribute("data-submit-url")) {

        } else {

            // Store the data in session storage
            let store = this.getAttribute("data-store");
            sessionStorage.setItem(store, JSON.stringify(data));

            // Process success
            this.processSuccess();
        }

    }

    // Continue to next page
    private processSuccess() {

        if (this.getAttribute("data-success-url")) {
            window.location.href = this.getAttribute("data-success-url");
        }
    }

    // Validate the form
    private validate(generateErrors) {

        let valid = true;
        let errors = {};

        if (!this.view) {
            return false;
        }

        this.querySelectorAll("[data-validation]").forEach((item) => {
            let field = item.getAttribute("data-field");
            let validations = item.getAttribute("data-validation").split(",");

            let dataValue = this.view.data[field];

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

        if (generateErrors) {
            if (Object.keys(this.view.errors).length != Object.keys(errors).length) {
                this.view.errors = errors;
                this.errorsGenerated = true;
            }
        } else {

            if (Object.keys(this.view.errors).length != 0) {
                this.view.errors = {};
            }
        }

        if (valid != this.view.valid)
            this.view.valid = valid;

        return valid;
    }


    /**
     * Set data value ensuring all is bound
     */
    private setDataValue(key, value) {
        Vue.set(this.view.data, key, value);
    }

}
