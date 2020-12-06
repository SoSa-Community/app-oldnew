import {StyleSheet} from 'react-native';

const backgroundColour1 = '#121211';
const headerTextColour = '#fff';

const BaseStyles = StyleSheet.create({
    header: {
        backgroundColor: backgroundColour1,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
    },

    headerPadding: {
        marginVertical: 5,
        paddingTop: Platform.OS === 'ios' ? 24 : 0
    },

    headerTitle: {
        alignSelf: 'center',
        textAlign: 'center',
        color: headerTextColour,
        fontSize: 24,
        padding: 10,
        flex: 1
    },

    container: {
        backgroundColor: backgroundColour1,
        flex: 1
    }
});

export default BaseStyles;
