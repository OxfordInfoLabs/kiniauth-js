import KaRecaptcha from './ka-recaptcha';
import RequestParams from '../util/request-params';
import Validation from '../framework/validation';
import ElementSpinner from '../util/element-spinner';
import Api from '../framework/api';
import StandardForm from './standard-form';
// @ts-ignore
import * as _ from 'lodash';

/**
 * Register component
 */
export default class KaContact extends StandardForm {

    // Success url - once contact is saved
    private readonly successUrl: string;
    // Used for setting the contact type
    private readonly contactType: string;
    // Used for mapping field values
    private contactObject: any;

    /**
     * Construct new element
     */
    constructor() {
        const fields = {
            'name': {
                required: 'The account name is required'
            },
            'street1': {
                required: 'The first line of the address is required'
            },
            'street2': {},
            'city': {
                required: 'The city is required'
            },
            'county': {
                required: 'The county is required'
            },
            'postcode': {
                required: 'The postcode is required'
            },
            'countryCode': {
                required: 'The country is required'
            },
        };
        super(fields);

        // Resolve the success url falling back to a data attribute or /
        this.successUrl = this.getAttribute('data-success-url') || '/';
        // Set the contact type based on passed in data, fall back to GENERAL
        this.contactType = this.getAttribute('data-contact-type') || 'GENERAL';
        this.contactObject = {
            type: this.contactType
        };

        const contactId = RequestParams.get().contact;
        if (contactId) {
            this.loadContact(contactId, fields);
        }
    }

    public submitForm(fieldValues: any): Promise<any> {
        const api = new Api();

        _.map(fieldValues, (value, field) => {
            this.contactObject[field] = value;
        });

        return api.saveContact(this.contactObject);
    }

    public success(jsonResponse: any) {
        window.location.href = this.successUrl;
    }

    public failure(jsonResponse) {
    }

    private loadContact(contactId, fields) {
        const api = new Api();
        return api.getContact(contactId).then(contact => {
            this.contactObject = contact;
            Object.keys(fields).forEach(fieldKey => {
                fields[fieldKey].value = contact[fieldKey];
            });
            super.setFieldValues(fields);
        });
    }

}
