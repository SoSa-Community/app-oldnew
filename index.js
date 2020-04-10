/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers as fasUsers, faCampfire as fasCampfire, faInfoCircle as fasInfoCircle, faCheck as fasCheck } from '@fortawesome/pro-solid-svg-icons';
import { faUsers as falUsers, faBars as falBars, faCampfire as falCampfire, faArrowAltLeft as falArrowAltLeft, faUser as falUser, faKey as falKey} from '@fortawesome/pro-light-svg-icons'

library.add(fasUsers, falUsers, falBars, fasCampfire, falCampfire, falArrowAltLeft, falUser, falKey, fasInfoCircle, fasCheck);

/**
 * Object.prototype.forEach() polyfill
 * Refactored from https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @author James Mahy
 * @license MIT
 */

if (!Object.prototype.forEach) {
    Object.defineProperty(Object.prototype, 'forEach', {
        value: function (callback, thisArg) {
            if (this == null) throw new TypeError('Not an object');

            for (let key in this) {
                if (this.hasOwnProperty(key)) callback.call(thisArg, this[key], key, this);
            }
        },
        writable: true
    });

}

import App from './App';
import {name as appName} from './app.json';
import './patches/EngineIOHeaderWarning';

AppRegistry.registerComponent(appName, () => App);
