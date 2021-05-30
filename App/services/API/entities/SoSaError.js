export class SoSaError {
    code = '';
    message = '';
    field = '';

    constructor(code, message, field){
        this.code = code;
        this.message = message;
        this.field = field;
    }
    
    static fromJSON({code, message, field}){
        return new SoSaError(code, message, field);
    }
}
