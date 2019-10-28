import Validation from "../framework/validation";
import KaRecaptcha from "./ka-recaptcha";
import ElementSpinner from "../util/element-spinner";
import FieldValue from "../util/field-value";

/**
 * Standard form implementation.
 *
 * Expects a single form with a submit button and one or more fields marked up with data attributes of format data-NAME-field
 * where name is a unique identifier for the field.
 *
 * If an error is expected there should be a matching container with attribute of format data-NAME-error which will be populated
 * if a validation error is detected with the field.
 *
 */
export default abstract class StandardForm extends HTMLElement {

    /**
     * Array of fields defined for this form
     */
    private fields = {};

    /**
     * Boolean indicator for auto render captchas.
     */
    private autoRenderCaptchas: boolean;

    // has recaptcha
    private recaptcha: KaRecaptcha = null;


    constructor(fields = {}, autoRenderCaptchas = true) {
        super();

        this.fields = fields;
        this.autoRenderCaptchas = autoRenderCaptchas;

        this.bind();
    }


    // Bind the components
    private bind() {

        // Check we have a form
        let forms = this.getElementsByTagName("form");
        if (forms.length == 0) {
            alert("Missing form for " + this.tagName);
        } else {

            // Check for a recaptcha
            let recaptchas = this.getElementsByTagName("ka-recaptcha");
            if (recaptchas.length > 0) {
                this.recaptcha = <KaRecaptcha>recaptchas.item(0);

                if (this.autoRenderCaptchas)
                    this.recaptcha.render();
            }

            // Bind submit on the first element
            forms.item(0).addEventListener("submit", (event) => {

                // Block standard form submissions.
                event.preventDefault();

                // Reset all fields initially
                Validation.resetFields(this, Object.keys(this.fields));

                // Validate fields next.
                if (this.validate()) {

                    // Grab submit button
                    var submitButton: HTMLButtonElement = this.querySelector("[type='submit']");
                    ElementSpinner.spinElement(submitButton);


                    // get all field values
                    let fieldValues = {};
                    Object.keys(this.fields).forEach((fieldName) => {
                        let field = <HTMLElement>this.querySelector("[data-" + fieldName + "-field]");
                        if (field) {
                            fieldValues[fieldName] = FieldValue.get(field);
                        }
                    });


                    // Submit the form
                    this.submitForm(fieldValues).then((response) => {

                        ElementSpinner.restoreElement(submitButton);

                        response.json().then((jsonData) => {

                            if (response.ok) {
                                this.success(jsonData);
                            } else {
                                if (this.recaptcha)
                                    this.recaptcha.render();
                                this.failure(jsonData);
                            }

                        });

                    }).catch((response) => {

                        response.json().then((jsonData) => {
                            if (this.recaptcha)
                                this.recaptcha.render();
                            this.failure(jsonData);
                        });

                    });

                }


            });

        }


    }


    /**
     * Validate fields - can be overridden.
     */
    public validate(): boolean {

        let valid = true;

        // Itrerate through all fields
        Object.keys(this.fields).forEach((fieldName) => {

            // Iterate through each validator
            Object.keys(this.fields[fieldName]).forEach((validator) => {

                let validatorData = this.fields[fieldName][validator];

                let identifiers = {};
                identifiers[fieldName] = validatorData;

                switch (validator) {
                    case "required":
                        valid = Validation.validateRequiredFields(this, identifiers) && valid;
                        break;
                    case "password":
                        valid = Validation.validatePasswordFields(this, identifiers) && valid;
                        break;

                    case "email":
                        valid = Validation.validateEmailFields(this, identifiers) && valid;
                        break;
                    case "equals":
                        valid = Validation.validateEqualsFields(this, fieldName, validatorData.otherField, validatorData.message);
                }

            });
        });


        if (this.recaptcha && this.recaptcha.isRendered()) {
            valid = Validation.validateRecaptcha(this, "You must complete the Captcha") && valid;
        }

        return valid;

    }


    /**
     * Submit form called by the framework with form values for convenience.
     * Should normally make an API call and return the result.
     *
     * @param fieldValues
     */
    public abstract submitForm(fieldValues): Promise<any>;


    /**
     * On success, the JSON response is returned
     *
     * @param jsonResponse
     */
    public abstract success(jsonResponse);


    /**
     * On failure, teh JSON response is returned
     *
     * @param jsonResponse
     */
    public abstract failure(jsonResponse);
}
