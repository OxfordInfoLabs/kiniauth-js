/**
 * Generic binder which binds a model to an AJAX source.  A source and model must be supplied in the form
 * of data attributes (data-source and data-model) and optionally a defer-load attribute may be supplied to allow
 * for event driven loading and reloading later.
 *
 * A sub container with class vue-wrapper must be supplied.
 *
 */
import Kinivue from "../framework/kinivue";
import Api from "../framework/api";

export default class KaBind extends HTMLElement {

    // The Vue instance
    private view;


    constructor() {
        super();
        this.init();
    }


    // Initialise
    private init() {

        if (!this.getAttribute("data-source") || !this.getAttribute("data-model")) {
            alert("You must supply a source and a model to a bind component");
            return;
        }


        let data = {};
        data[this.getAttribute("data-model")] = {};

        this.view = new Kinivue({
            el: this.querySelector(".vue-wrapper"),
            data: data,
            methods: {
                load: () => {
                    this.load();
                }
            }
        });

        if (!this.getAttribute("defer-load")) {
            this.load();
        }

    }

    // Load the source
    private load() {
        let api = new Api();
        api.callAPI(this.getAttribute("data-source")).then((results) => {
            results.json().then(model => {
                this.view[this.getAttribute("data-model")] = model;
                let event = new Event("sourceLoaded", {
                    "bubbles": true
                });
                this.dispatchEvent(event);
            });

        });


    }

}
