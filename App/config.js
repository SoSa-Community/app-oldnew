import {
    MAX_FILE_SIZE,
    PROVIDER_GENERAL_HOST, PROVIDER_GENERAL_TOKEN,
    PROVIDER_AUTH_HOST, PROVIDER_AUTH_TOKEN
} from "@env"

export let AppConfig = new class Config {
    
    errors = {
        'meetups/invalid_title': 'The title should be between 16 and 254 characters',
        'meetups/invalid_type': 'Existential meetups are not allowed, we only support virtual and real meetups for now...',
        'meetups/invalid_start_datetime': 'Somehow, the start date is invalid!',
        'meetups/invalid_end_datetime': 'Somehow, the end date is invalid!',
        'meetups/back_to_the_future': 'Roads? Where We’re Going, We Don’t Need Roads.',
        'meetups/five_more_minutes': 'Make it a bit longer, at-least 5 minutes!',
        'meetups/time_stands_still': 'Time stand still, I\'m not looking back, but I want to look around me now',
        'meetups/invalid_description': 'The description is invalid, I won\'t tell you why but it\'s probably because it need\'s to be at-least 16 characters',
    };
    
    maxFileSize = MAX_FILE_SIZE;
    
    providers = {
        general: {
            host: PROVIDER_GENERAL_HOST,
            api_key: PROVIDER_GENERAL_TOKEN
        },
        auth: {
            host: PROVIDER_AUTH_HOST,
            api_key: PROVIDER_AUTH_TOKEN
        }
    };
    
    features = {
        general: {
            canRegister: true,
            canUpload: true,
        },
        login: {
            credentials: true,
            social: {
                imgur: true,
                reddit: true,
                twitter: true,
                facebook: true,
                google: true,
            },
            forgotPassword: true
        },
        register: {
            credentials: true,
            social: {
                imgur: true,
                reddit: true,
                twitter: true,
                facebook: true,
                google: true,
            },
        }
    };
    
    constructor() {
        console.debug('sausage', PROVIDER_GENERAL_HOST);
    }
}();
