import React from 'react';
import {TouchableHighlight} from 'react-native';
import {Icon} from './Icon';

export const IconButton = ({onPress, icon, style, size}) => {
    return (
        <TouchableHighlight onPress={onPress} style={{paddingVertical: 8}}>
            <Icon icon={icon}  style={style} size={size} />
        </TouchableHighlight>
    )
}
