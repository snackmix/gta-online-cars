import {set} from 'lodash';

class Modal {
    constructor(instance, modal, props) {
        this.instance = instance;
        this.modal = modal;
        this.props = props || {};
        this.events = {};
        this.closable = true;
        this.width = 0.5;
    }

    event(name, event) {
        set(this.events, name, event);
    }

    show() {
        this.instance.$modal.show(this.modal, this.props, this.options, this.events);
    }

    get options() {
        return {
            clickToClose: this.closable,
            adaptive: true,
            scrollable: true,
            maxWidth: window.innerWidth - 200,
            width: window.innerWidth * this.width,
            height: 'auto'
        };
    }
}

export default Modal;