import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class Icon extends Component {

    render() {
        return (<FontAwesomeIcon icon={this.props.icon} style={this.props.style} size={this.props.size} color={this.props.color} onPress={this.props.onPress}/>)
    }

}
