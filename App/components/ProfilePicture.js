import React from 'react';
import { TouchableHighlight, StyleSheet, View } from 'react-native';
import PropTypes from "prop-types";
import FastImage from 'react-native-fast-image';
import IconButton from './IconButton';

const Styles = StyleSheet.create({
    base: {width: 16, height: 16, borderRadius: 16/2},
    small: {width: 32, height: 32, borderRadius: 32/2},
    med: {width: 48, height: 48, borderRadius: 48/2},
    large: {width: 64, height: 64, borderRadius: 64/2},
    larger: {width: 80, height: 80, borderRadius: 80/2},
    verylarge: {width: 128, height: 128, borderRadius: 128/2},
    editButton: { position: 'absolute', bottom: -5, right:-1, backgroundColor: '#444442', borderRadius: 14, width:28, height:28, alignItems: 'center', justifyContent:'center' }
});

const ProfilePicture = ({picture, onPress, size, style, editable}) => {
    
    const Component = () => {
        const Image = () => <FastImage style={[Styles[size], !onPress ? style : null]} source={typeof(picture) === 'string' ? {uri: picture} : picture} />;
        if(onPress) {
            return (
                <TouchableHighlight {...{ onPress, style } }>
                    <Image />
                </TouchableHighlight>
            );
        }
        return <Image />;
    }
    
    return <View style={{position: 'relative'}}>
        <Component />
        { editable &&
            <View style={Styles.editButton}>
                <IconButton icon={['fal', 'image']} style={{color: '#fff'}} size={18} onPress={() => {}} />
            </View>
        }
    </View>;
}

ProfilePicture.propTypes = {
    picture: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    size: PropTypes.oneOf(['base', 'small', 'med', 'large', 'larger', 'verylarge']),
    onPress: PropTypes.func
};

ProfilePicture.defaultProps = {
    size: 'base',
    onPress: null
}

export default ProfilePicture;
