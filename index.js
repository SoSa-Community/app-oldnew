/**
 * @format
 */

import {AppRegistry} from 'react-native';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faSausage } from '@fortawesome/pro-solid-svg-icons';
library.add(faCoffee, faSausage);

import App from './App';
import {name as appName} from './app.json';
import './patches/EngineIOHeaderWarning';

AppRegistry.registerComponent(appName, () => App);
