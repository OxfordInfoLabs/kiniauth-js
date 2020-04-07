import StandardForm from "./standard-form";
import Kinivue from "../framework/kinivue";

/**
 * Register component
 */
export default class KaDynamicForm extends StandardForm {

    // Kinibind view
    private view;

    // Construct a dynamic form dynamically
    constructor() {
        super({});

        this.view = new Kinivue({
            el: this,
            data: {}
        });

    }


    public submitForm(fieldValues): Promise<any> {
        return undefined;
    }

    public success(jsonResponse) {
    }


    public failure(jsonResponse) {
    }

}
