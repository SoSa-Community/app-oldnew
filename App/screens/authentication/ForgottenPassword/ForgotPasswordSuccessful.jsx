import React from 'react';
import { Text, View } from 'react-native';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import Styles from './ForgotPasswordStyles';

const ForgotPasswordCode = ({ navigation }) => {
	return (
		<View style={Styles.container}>
			<View style={Styles.formContainer}>
				<Text style={Styles.header}>Success!</Text>
				<Text style={Styles.subheader}>
					You have successfully reset your password, press login to
					login!
				</Text>
			</View>
			<View style={Styles.buttonBottom}>
				<ActivityButton
					onPress={() => {
						navigation.reset({
							routes: [{ name: 'Login' }],
						});
					}}
					text="LOGIN"
					style={Styles.button}
					textStyle={Styles.buttonText}
				/>
			</View>
		</View>
	);
};

export default ForgotPasswordCode;
