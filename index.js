/**
 * @format
 */

import {AppRegistry} from 'react-native';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers as fasUsers, faCampfire as fasCampfire } from '@fortawesome/pro-solid-svg-icons';
import { faUsers as falUsers, faBars as falBars, faCampfire as falCampfire } from '@fortawesome/pro-light-svg-icons'
library.add(fasUsers, falUsers, falBars, fasCampfire, falCampfire);

import App from './App';
import {name as appName} from './app.json';
import './patches/EngineIOHeaderWarning';

AppRegistry.registerComponent(appName, () => App);
