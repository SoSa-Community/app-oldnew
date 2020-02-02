/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './patches/EngineIOHeaderWarning';

AppRegistry.registerComponent(appName, () => App);
