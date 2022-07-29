

module.exports = class ControlHandler {
    constructor(control) {
        this.control = control;
    }
    
    handle(event) {
        this.control.handle(event);
    }
}