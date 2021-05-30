import { SoSaError } from '../../entities/SoSaError.js';

export class CallbackHooks {
    
    provider = null;
    hooks = [];

    /**
     * Creates a new Listeners Object
     *
     * @param {RequestProvider} provider - Client initiating the class
     */
    constructor(provider) {
        this.provider = provider;
        this.clear();
    }

    trigger({request, errors, data}){
        const { _id: id } = request;
        
        if(id && typeof(this.hooks[id]) === 'function'){
            try{
                if(errors){
                    if(!Array.isArray(errors)) {errors = [errors];}
                    errors = errors.map((error) => {
                        const {code, message} = error;
                        if(!message && code) error.message = this.provider.client.translateErrorCode(code);
                        return SoSaError.fromJSON(error);
                    });
                }
                
                this.hooks[id](
                            errors,
                            data ? data : null,
                            request ? request : null
                );
            }catch(e){
                console.debug('Hook failed', e);
            }
            this.remove(id);
        }
    }

    add(id, callback){
        console.debug('Adding hook', id);
        this.hooks[id] = callback;
        setTimeout(() => {this.remove(id)}, 10000);
    }
    
    remove(id){
        if(typeof(this.hooks[id]) === 'function'){
            delete this.hooks[id];
            console.debug('Hook deleted', id);
        }
    }

    clear(){this.hooks = [];}
}
