import Vue from "vue";

/**
 * Simple extension of the Vue.JS base class to
 * prescribe the delimiter
 */
export default class Kinivue extends Vue {

    /**
     * Simply override the standard delimiter to allow single braces.
     *
     * @param options
     */
    constructor(options: any = {}) {
        options.delimiters = ['{', '}'];
        super(options)
    }

}
