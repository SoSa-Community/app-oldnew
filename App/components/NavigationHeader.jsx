import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
	useReducer,
} from 'react';

import {
	Keyboard,
	Text,
	View,
	StyleSheet,
	BackHandler,
	TouchableHighlight,
	Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import { useAuthenticatedNavigation } from '../context/AuthenticatedNavigationContext';

import IconButton from './IconButton';
import BaseStyles from '../screens/styles/base';

let menuStack = [];

const Styles = StyleSheet.create({
	menuTop: {
		backgroundColor: '#121211',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		paddingTop: Platform.OS === 'ios' ? 32 : 6,
		paddingBottom: 6,
	},
	menuTopLeft: { paddingLeft: 7, paddingRight: 5 },
	menuTopRight: {
		paddingRight: 10,
		flex: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
});

const NavigationHeader = forwardRef(({ ...props }, ref) => {
	const menuDefaults = {
		title: 'SoSa',
		leftMode: 'menu',
		showLeft: true,
		showRight: true,
	};
	menuStack = [menuDefaults];

	const {
		toggleSwipe,
		openLeftDrawer,
		getStackNavigator,
	} = useAuthenticatedNavigation();

	const [preferences, setPreferences] = useState({});
	const [showTopBar, setShowTopBar] = useState(true);
	const [menu, setMenu] = useState(menuDefaults);
	const [leftMenu, setLeftMenu] = useState(<></>);
	const [rightMenu, setRightMenu] = useState(<></>);

	const [headerIcons, dispatch] = useReducer((state, data) => {
		const { action } = data;
		let icons = [];

		if (action === 'set') {
			icons = data?.icons;
		} else {
			if (action === 'remove') {
				if (Array.isArray(state)) {
					const { id } = data;
					return state.filter((item) => item.id !== id);
				}
			} else {
				icons = [...state];

				const { id, icon, text, onPress } = data;
				let found = false;

				icons.forEach((item, index) => {
					if (item.id === id) {
						found = true;
						item.icon = icon;
						item.text = text;
						item.onPress = onPress;
					}
				});

				if (!found) {
					icons.unshift(data);
				}
			}
		}
		return icons;
	}, []);

	const popMenuStack = () => {
		let newState = menuDefaults;
		if (menuStack.length > 1) {
			menuStack.pop();
			newState = menuStack[menuStack.length - 1];
		}
		if (newState.leftMode === 'back') {
			toggleSwipe(false);
		} else {
			toggleSwipe(true);
		}

		setMenu(newState);
	};

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', popMenuStack);
		return () =>
			BackHandler.removeEventListener('hardwareBackPress', popMenuStack);
	}, [popMenuStack]);

	useImperativeHandle(ref, () => ({
		addHeaderIcon(
			props = {
				id: undefined,
				icon: undefined,
				text: undefined,
				onPress: undefined,
			},
		) {
			dispatch({ action: 'add', ...props });
		},

		removeHeaderIcon(id) {
			dispatch({ action: 'remove', id });
		},
		setHeaderIcons(icons) {
			dispatch({ action: 'set', icons });
		},

		setMenuOptions(options, justUpdate, resetOnBack) {
			let currentState = { ...menu };
			let updateState = false;

			for (let key in options) {
				let option = options[key];
				if (
					!currentState.hasOwnProperty(key) ||
					currentState[key] !== option
				) {
					updateState = true;
					currentState[key] = option;
				}
			}
			if (updateState) {
				setMenu(currentState);
			}

			if (currentState.leftMode === 'back') {
				toggleSwipe(false);
			} else {
				toggleSwipe(true);
			}

			if (!justUpdate) {
				menuStack.push(currentState);
			}
		},

		popMenuStack,
	}));

	if (!showTopBar) {
		return <></>;
	}

	const {
		title,
		leftMode,
		showLeft,
		showRight,
		onBack,
		backIgnoreStack,
		leftIcon,
	} = menu;

	useEffect(() => {
		if (!showLeft) {
			setLeftMenu(null);
		} else {
			let icon = ['fal', 'bars'];
			let onPress = () => {
				Keyboard.dismiss();
				openLeftDrawer();
			};

			const goBack = () => {
				if (!backIgnoreStack) {
					popMenuStack();
					getStackNavigator()?.current?.goBack();
				}
			};

			if (leftMode === 'back') {
				onPress = () => {
					if (typeof onBack !== 'function') {
						goBack();
					} else {
						onBack()
							.catch((e) =>
								console.debug('Go Back Went Wrong', e),
							)
							.finally(() => goBack());
					}
				};
				icon = leftIcon || ['fal', 'chevron-left'];
			}

			setLeftMenu(
				<View style={Styles.menuTopLeft}>
					<IconButton
						style={{ color: '#CCC' }}
						size={18}
						{...{ icon, onPress }}
					/>
				</View>,
			);
		}
	}, [showLeft, leftMode, onBack]);

	useEffect(() => {
		if (!showRight) {
			setRightMenu(<></>);
		} else {
			let icons = headerIcons.map((item) => {
				const headerIcon = typeof item === 'function' ? item() : item;
				const { icon, id, text, onPress } = headerIcon;

				const button = () => {
					if (icon) {
						return (
							<IconButton
								style={{ color: '#CCC' }}
								activeStyle={{ color: '#444442' }}
								size={20}
								{...{ icon, onPress }}
							/>
						);
					}

					return (
						<TouchableHighlight onPress={onPress}>
							<Text style={{ color: '#ccc' }}>{text}</Text>
						</TouchableHighlight>
					);
				};

				return (
					<View
						style={{ verticalAlign: 'center', paddingLeft: 14 }}
						key={id}>
						{button()}
					</View>
				);
			});
			setRightMenu(<View style={Styles.menuTopRight}>{icons}</View>);
		}
	}, [showRight, headerIcons]);

	return (
		<View style={Styles.menuTop}>
			{leftMenu}
			<Text style={[BaseStyles.headerTitle]}>{title}</Text>
			{rightMenu}
		</View>
	);
});

NavigationHeader.propTypes = {
	onBack: PropTypes.func,
	icons: PropTypes.array,
};

NavigationHeader.defaultProps = {
	onBack: null,
	icons: [],
};

export default NavigationHeader;
