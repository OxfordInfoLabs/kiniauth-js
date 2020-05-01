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
import RequestParams from "../util/request-params";

export default class KaBind extends HTMLElement {

    // The Vue instance
    private view;


    constructor() {
        super();
        this.init();
    }


    // Initialise
    private init() {


        let model = this.getAttribute("data-model");
        let source = this.getAttribute("data-source");

        if (typeof model != "object" && !model) {
            alert("You must supply a model to a bind component");
            return;
        }


        let data = {};

        if (typeof model == "string") {
            try {
                let jsonModel = JSON.parse(model);
                data = jsonModel;
            } catch (e) {
                data[model] = {};
            }


        } else if (typeof model == "object")
            data = model;




        this.view = new Kinivue({
            el: this.querySelector(".vue-wrapper"),
            data: data,
            methods: {
                load: () => {
                    this.load();
                }
            }
        });

        if (source && !this.getAttribute("defer-load")) {
            this.load();
        }

    }

    // Load the source
    private load() {
        let api = new Api();

        let url = this.getAttribute("data-source");


        url = url.replace(/\{request\.([a-zA-Z]+?)\}/g,
            (match, identifier): string => {
                return RequestParams.get()[identifier];
            });


        api.callAPI(url).then((results) => {
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
