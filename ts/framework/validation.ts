/**
 * Validation utility classes.
 */
import Configuration from "./configuration";
import KaRecaptcha from "../components/ka-recaptcha";

export default class Validation {

    /**
     * Reset multiple fields for validation within the containing element by identifiers using the convention pattern
     *
     * @param containingElement
     * @param identifiers
     */
    static resetFields(containingElement: Element, identifiers: string[]) {

        identifiers.forEach((item) => {
            this.setFieldError(containingElement, item, false, "");
        });

    }


    /**
     * Validate required fields
     *
     * @param containingElement
     * @param identifiers
     */
    static validateRequiredFields(containingElement: Element, identifiers: any) {

        let valid: boolean = true;

        Object.keys(identifiers).forEach((item) => {
            var element: Element = containingElement.querySelector("[data-" + item + "-field]");
            if (element instanceof HTMLInputElement) {
                let elementValid: boolean = (element.value != null && element.value.length > 0);
                if (!elementValid) {
                    this.setFieldError(containingElement, item, true, identifiers[item]);
                }
                valid = valid && elementValid;
            }
        });

        return valid;

    }


    /**
     * Validate recaptcha field
     *
     * @param containingElement
     * @param message
     */
    static validateRecaptcha(containingElement: Element, message: string) {

        let recaptchas = containingElement.getElementsByTagName("ka-recaptcha");
        if (recaptchas.length > 0) {

            let recaptcha = <KaRecaptcha>recaptchas.item(0);

            let valid = recaptcha.getResponse() ? true : false;

            if (!valid) {
                this.setFieldError(containingElement, "recaptcha", true, message);
            }

            return valid;
        } else {
            return true;
        }


    }


    // Set a field error (visibility and message).
    static setFieldError(containingElement: Element, identifier: string, visible: boolean, message: string) {
        let element: HTMLElement = containingElement.querySelector("[data-" + identifier + "-error]");
        if (element) {
            element.innerHTML = message;
            Configuration.elementVisibilityFunction(element, visible);
        }
    }


}
