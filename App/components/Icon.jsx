import React from 'react';

import {
	faUsers as fasUsers,
	faCampfire as fasCampfire,
	faInfoCircle as fasInfoCircle,
	faCheck as fasCheck,
	faTrees as fasTrees,
	faTimesCircle as fasTimesCircle,
	faPencil as fasPencil,
} from '@fortawesome/pro-solid-svg-icons';

import { faGift as farGift, faGenderless as farGenderless } from '@fortawesome/pro-regular-svg-icons';
import { faGlobeEurope as fadGlobeEurope } from '@fortawesome/pro-duotone-svg-icons';

import {
	faUsers as falUsers,
	faBars as falBars,
	faCampfire as falCampfire,
	faArrowAltLeft as falArrowAltLeft,
	faUser as falUser,
	faKey as falKey,
	faEye as falEye,
	faEyeSlash as falEyeSlash,
	faEnvelope as falEnvelope,
	faPaperPlane as falPaperPlane,
	faCalendarStar as falCalendarStar,
	faCogs as falCogs,
	faSignOutAlt as falSignOutAlt,
	faImage as falImage,
	faChevronLeft as falChevonLeft,
	faMapMarkerSmile as falMapMarkerSmile,
	faGenderless as falGenderless,
	faPlus as falPlus,
	faCalendarWeek as falCalendarWeek,
	faClock as falClock,
	faCompass as falCompass,
	faSyncAlt as falSyncAlt,
	faPencilAlt as falPencilAlt,
	faPencil as falPencil,
	faCamera as falCamera,
} from '@fortawesome/pro-light-svg-icons';

import { faWifi as farWifi } from '@fortawesome/pro-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(
	fasUsers,
	falUsers,
	falBars,
	fasCampfire,
	falCampfire,
	falArrowAltLeft,
	falUser,
	falKey,
	fasInfoCircle,
	fasCheck,
	falEye,
	falEyeSlash,
	falEnvelope,
	falPaperPlane,
	fasTrees,
	farWifi,
	falCalendarStar,
	falCogs,
	falSignOutAlt,
	falImage,
	falChevonLeft,
	falMapMarkerSmile,
	falGenderless,
	fasTimesCircle,
	falPlus,
	falCalendarWeek,
	falClock,
	falCompass,
	falSyncAlt,
	falPencilAlt,
	fasPencil,
	falPencil,
	falCamera,
	farGift,
	fadGlobeEurope,
	farGenderless
	
);

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Icon = (props) => {
	return <FontAwesomeIcon {...props} />;
};

export default Icon;
