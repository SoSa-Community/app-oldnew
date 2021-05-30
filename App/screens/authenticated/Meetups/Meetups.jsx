import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useAPI } from '../../../context/APIContext';

import MeetupItem from '../../../components/meetups/MeetupItem';
import { useFocusEffect } from '@react-navigation/native';

const MeetupsScreen = ({ navigation }) => {
	const {
		addHeaderIcon,
		removeHeaderIcon,
	} = useAuthenticatedNavigation();

	const {
		services: { meetups: meetupService },
	} = useAPI();

	const [meetups, setMeetups] = useState([]);

	const { navigate } = navigation;

	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;

			if (isActive) {
				addHeaderIcon({
					id: 'create_meetup',
					icon: ['fal', 'plus'],
					onPress: () => navigate('CreateMeetup'),
				});

				meetupService
					.search('sosa')
					.then((records) => {
						records.sort(
							(meetup1, meetup2) =>
								meetup2.created.getTime() -
								meetup1.created.getTime(),
						);
						setMeetups(records);
					})
					.catch((errors) => console.debug(errors));
			}
			return () => {
				removeHeaderIcon('create_meetup');
				isActive = false;
			};
		}, []),
	);

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={meetups}
				extraData={meetups}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item, index }) => {
					return (
						<MeetupItem
							key={item.id}
							meetup={item}
							onChange={(meetup) => {
								const ogState = [...meetups];
								ogState[index] = meetup;
								setMeetups(ogState);
							}}
							onTellMeMorePress={() =>
								navigate('Meetup', { id: item.id })
							}
						/>
					);
				}}
				style={{ flex: 1, backgroundColor: '#121111' }}
			/>
		</View>
	);
};

export default MeetupsScreen;
