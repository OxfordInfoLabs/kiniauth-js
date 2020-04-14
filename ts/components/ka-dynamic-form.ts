import Kinivue from "../framework/kinivue";
import Vue from "vue";

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

        // Create the view
        this.view = new Kinivue({
            el: this.querySelector("form"),
            data: {
                data: {},
                errors: {},
                dateTime: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
                valid: false
            },
            methods: {
                set: (key, value) => {
                    this.setDataValue(key, value);
                }

            },
            updated: () => {
                this.validate(this.errorsGenerated);
            }

        });


        this.addEventListener("submit", (event) => {
            event.preventDefault();

            // Validate the form
            this.validate(true);

        })

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

            let dataValue = this.view.$data.data[field];

            // Now validate the value
            validations.forEach((validation) => {

                let fieldValid = true;

                switch (validation.trim()) {
                    case "required":
                        fieldValid = dataValue;
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
    }


    /**
     * Set data value ensuring all is bound
     */
    private setDataValue(key, value) {
        Vue.set(this.view.data, key, value);
    }

}
