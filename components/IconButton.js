import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class Icon extends Component {

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} style={{paddingVertical: 8}}>
                <FontAwesomeIcon icon={this.props.icon}  style={this.props.style} size={this.props.size} />
            </TouchableHighlight>
        )
    }

}