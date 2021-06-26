import React, { useState } from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	View,
	Image,
	ImageBackground,
	Text,
} from 'react-native';
import PropTypes from 'prop-types';

import IconButton from '../IconButton';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import FloatingIconButton from '../FloatingCameraButton/FloatingIconButton';

const Styles = StyleSheet.create({
	container: { flex: 0 },
	cancelColumn: { flex: 1, alignItems: 'flex-start', marginLeft: 22 },
	saveColumn: { flex: 1, alignItems: 'flex-end', marginRight: 22 },
	columnText: {
		fontWeight: '700',
		color: '#fff',
		fontSize: 16,
		textTransform: 'uppercase',
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.25)',
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1,
		height: '200%',
		width: '100%',
	},
	overlayLoading: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
	},
	coverContainer: { height: 170, position: 'relative' },
	cover: {
		flex: 1,
		overflow: 'hidden',
		resizeMode: 'contain',
		paddingVertical: 24,
	},
	actionBarContainer: { position: 'absolute', top: '10%', right: 16 },
	actionBar: { flexDirection: 'row' },
	coverCameraButton: { bottom: '10%', right: 16 },
	pictureContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	saveButton: { color: '#F96854' },
	editButton: { color: '#F96854' },
	profilePictureContainer: { flex: 1, alignItems: 'center', marginTop: -85 },
});

const ProfileHeader = ({
	coverPicture,
	profilePicture,
	onCancel,
	onSave,
	isEditable,
	onEdit,
	editingMode,
	loading,
	changeProfilePicture,
	changeCoverPicture,
}) => {
	const handleCancel = () => {
		if (typeof onCancel === 'function') onCancel();
	};

	const handleSave = async () => {
		let success = true;

		if (typeof onSave === 'function') {
			try {
				await onSave();
			} catch (e) {
				success = false;
			}
		}
	};

	const handleEdit = () => {
		if (typeof onEdit === 'function') onEdit();
	};

	const cancelButton = () => {
		if (isEditable && !loading) {
			if (editingMode) {
				return (
					<View style={[Styles.cancelColumn]}>
						<TouchableOpacity onPress={handleCancel}>
							<Text style={[Styles.columnText]}>Cancel</Text>
						</TouchableOpacity>
					</View>
				);
			} else {
				return <View style={Styles.cancelColumn} />;
			}
		}
	};

	const saveButton = () => {
		if (isEditable && !loading) {
			if (editingMode) {
				return (
					<View style={Styles.saveColumn}>
						<TouchableOpacity onPress={handleSave}>
							<Text
								style={[Styles.columnText, Styles.saveButton]}>
								Save
							</Text>
						</TouchableOpacity>
					</View>
				);
			} else {
				return (
					<View style={Styles.saveColumn}>
						<IconButton
							icon={['fal', 'pencil']}
							style={Styles.editButton}
							size={18}
							onPress={() => handleEdit()}
						/>
					</View>
				);
			}
		}

		return <></>;
	};

	return (
		<View style={Styles.container}>
			<View style={Styles.coverContainer}>
				<ImageBackground
					source={
						typeof coverPicture === 'string'
							? { uri: coverPicture }
							: coverPicture
					}
					style={Styles.cover}>
					{!loading && <View style={Styles.overlay} />}
					{loading && (
						<View style={[Styles.overlay, Styles.overlayLoading]} />
					)}
				</ImageBackground>
				<View style={Styles.actionBarContainer}>
					<View style={Styles.actionBar} />
				</View>
				{isEditable && !loading ? (
					<FloatingIconButton
						size={18}
						onPress={() => changeCoverPicture()}
						containerStyle={Styles.coverCameraButton}
					/>
				) : (
					<></>
				)}
			</View>
			<View style={Styles.pictureContainer}>
				{cancelButton()}
				<View style={Styles.profilePictureContainer}>
					<ProfilePicture
						picture={profilePicture}
						size="verylarge"
						button={
							isEditable
								? {
										size: 20,
										onPress: () => changeProfilePicture(),
								  }
								: null
						}
						loading={loading}
					/>
				</View>
				{saveButton()}
			</View>
		</View>
	);
};

ProfileHeader.propTypes = {
	coverPicture: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
		PropTypes.bool,
	]),
	profilePicture: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
		PropTypes.bool,
	]),
	onCancel: PropTypes.func,
	onSave: PropTypes.func,
	isEditable: PropTypes.bool,
	editingMode: PropTypes.bool,
};

ProfileHeader.defaultProps = {
	coverPicture: require('../../assets/profiles/cover.jpg'),
	profilePicture: undefined,
	onCancel: () => {},
	onSave: () => {},
	isEditable: false,
	editingMode: false,
};

export default ProfileHeader;
