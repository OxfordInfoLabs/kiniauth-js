import tinybind from "tinybind";
import RequestParams from "../util/request-params";
import Session from "./session";
import * as moment from "moment";

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
            request: RequestParams.get(),
            now: new Date()
        };

        // Merge together and bind this element
        model = {...model, ...coreParams};


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

        if (!this.configured) {
            this.config = {};
        }

        // Initialise formatters
        this.initialiseFormatters();

        // Initialise adapters
        this.initialiseAdapters();

        // Initialise binders
        this.initialiseBinders();

        this.initialised = true;
    }


    /**
     * Initialise the built in formatters we need.
     */
    private static initialiseFormatters() {

        // Date formatter
        tinybind.formatters.date = function (value, format) {
            return moment(value).format(format);
        }


        // String operations
        tinybind.formatters.concat = function (value, otherValue) {
            return value + otherValue;
        }

        tinybind.formatters.split = function (value, splitCharacter = ",") {
            return value.split(splitCharacter);
        }

        tinybind.formatters.words = function (value) {
            if (value) {
                return value.split(/\W/).length;
            } else {
                return 0;
            }
        }


        // Array operations
        tinybind.formatters.contains = function (value, contains) {
            return value instanceof Array ? value.indexOf(contains) >= 0 : false;
        }


        // Math formatters
        tinybind.formatters.add = function (value, otherModel) {
            return value + otherModel;
        }

        tinybind.formatters.subtract = function (value, otherModel) {
            return value - otherModel;
        }


        // Comparison and logic formatters
        tinybind.formatters.equals = function (value, otherValue) {
            return value == otherValue;
        }

        // And logic
        tinybind.formatters.and = function (value, otherValue) {
            return value && otherValue;
        }

        // Or logic
        tinybind.formatters.or = function (value, otherValue) {
            return value || otherValue;
        }


        // And-not logic
        tinybind.formatters.andNot = function (value, otherValue) {
            return value && !otherValue;
        }

        // Or-not logic
        tinybind.formatters.orNot = function (value, otherValue) {
            return value || !otherValue;
        }


        // Function argument formatter
        tinybind.formatters.args = function (fn) {
            let args = Array.prototype.slice.call(arguments, 1)
            return () => fn.apply(null, args)
        }
    }


    /**
     * Initialise the built in adapters we need.
     */
    private static initialiseAdapters() {

        tinybind.adapters['['] = {
            observe: function (obj, keypath, callback) {
                keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
                if (obj.on)
                    obj.on('change:' + keypath, callback);
            },
            unobserve: function (obj, keypath, callback) {
                keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
                if (obj.off)
                    obj.off('change:' + keypath, callback);
            },
            get: function (obj, keypath) {
                keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
                return obj[keypath];
            },
            set: function (obj, keypath, value) {
                keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
                obj[keypath] = value;
            }
        }

    }


    /**
     * Initialise the built in binders we need
     */
    private static initialiseBinders() {

        // One way checked if binder
        tinybind.binders["checked-if"] = (el, value) => {
            el.checked = value;
        };

    }


}
