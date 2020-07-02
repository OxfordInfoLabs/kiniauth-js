import '@webcomponents/custom-elements';
import 'whatwg-fetch';

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype['msMatchesSelector'] ||
        Element.prototype['webkitMatchesSelector'];
}
