import {StyleSheet} from 'react-native';

const backgroundColour1 = '#121211';
const headerTextColour = '#fff';

const BaseStyles = StyleSheet.create({
    header: {
        backgroundColor: backgroundColour1
    },

    headerPadding: {
        marginVertical: 5,
        paddingTop: Platform.OS === 'ios' ? 24 : 0
    },

    headerTitle: {
        textAlign: 'left',
        color: headerTextColour,
        fontSize: 26,
        paddingHorizontal: 10,
        flex: 1
    },

    container: {
        backgroundColor: backgroundColour1,
        flex: 1
    }
});

export default BaseStyles;
