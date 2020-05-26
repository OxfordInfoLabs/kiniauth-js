import tinybind from "tinybind";
import RequestParams from "../util/request-params";
import Session from "./session";

/**
 * Kinibind base class
 */
export default class Kinibind {

    // Ensure we initialise tinybind once
    private static initialised = false;
    private static configured = false;

    // Bound context from tinybind
    private boundContext;


    /**
     * Construct with an optional array of bound params.
     *
     * @param element
     * @param params
     */
    constructor(element, model = {}) {
        this.bind(element, model);
    }


    /**
     * Bind our context to the supplied element
     */
    private bind(element, model) {

        // Add core params
        let coreParams = {
            session: {},
            request: RequestParams.get()
        };

        // Merge together and bind this element
        model = {...model, coreParams};


        // Bind the params
        this.boundContext = Kinibind.binder.bind(element, model);

        // Pump in the session once loaded
        Session.getSessionData().then((session => {
            this.setModelItem("session", session);
        }));

    }


    /**
     * Get a parameter value
     *
     * @param key
     */
    public getModelItem(key) {
        return this.boundContext.models[key];
    }


    /**
     * Set a parameter value
     *
     * @param key
     * @param value
     */
    public setModelItem(key, value) {
        this.boundContext.models[key] = value;
    }


    /**
     * Set static config on global instance
     *
     * @param config
     */
    static set config(config) {

        let defaultConfig = {
            "prefix": "kb"
        };

        config = {...config, ...defaultConfig};

        tinybind.configure(config);

        // Set configured flag
        this.configured = true;
    }

    /**
     * Get singleton instance of binder
     */
    static get binder() {

        if (!this.initialised)
            this.initialise();

        return tinybind;
    }


    // Initialise binder with extra stuff
    private static initialise() {

        if (!this.configured){
            this.config = {};
        }

        this.initialised = true;
    }


}
