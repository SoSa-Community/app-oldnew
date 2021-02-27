import React, { useState } from 'react';
import { Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import PropTypes from "prop-types"

import { Preferences } from "../../sosa/Preferences";
const Styles = StyleSheet.create({
    container: {
        flex:1
    },
    
    outerContainer: {
        flex:1,
        paddingLeft: 8,
        paddingVertical: 8,
        backgroundColor:'#2b2b2b',
        marginTop:6,
        borderRadius:6
    },
    
    innerContainer: {
        flexDirection:'row',
        flexWrap:'wrap'
    },
    
    pictureContainer: {
        flex: 0
    },
    
    picture: {
        width: 36,
        height: 36,
        borderRadius: 36/2,
        borderWidth: 0.25,
        borderColor:'#121111',
        marginRight: 8
    },
    
    textContainer: {
        flex:1
    },
    
    text: {
        color:'#fff',
        paddingRight:6,
        lineHeight: 22
    },
    
    nickname: {
        color:'#5cb85c'
    },
    
    showMoreText: {
        color: '#5cb85c'
    },
    
    childrenContainer: {
        flex:1
    }

});

const CommentItem = ({comment, depth}) =>{
    const {id, content, children, user} = comment;
    let { picture, nickname } = user;
    
    if(!picture) picture = `https://picsum.photos/300/300?seed=${Math.random()}`;
    if(!nickname) nickname = 'anonymous';
    
    const [getSaving, setSaving] = useState(false);
    const [getShowingFull, setShowingFull] = useState(false);
    const [getShowingChildren, setShowingChildren] = useState(true);
    const [getHideProfilePicture, setHideProfilePicture] = useState(false);
    const colors = ['#c0392B','#2ECC71','#3498DB','#9B59B6','#D35400','#1ABC9C','#34495E','#8E44AD','#F1C40F','#ECF0F1','#2C3E50','#2980B9','#E74C3C','#C0392B','#2ECC71','#3498DB','#9B59B6','#D35400','#1ABC9C','#34495E'];

    Preferences.get('comments:hide_profile_picture', (value) => setHideProfilePicture(Boolean(value)));

    const contentSplit = content.split(' ');
    const excerpt = contentSplit.slice(0,30).join(' ');
    const moreContent = excerpt !== content;

    const [getContent, setContent] = useState(excerpt);

    let depthStyles = {};
    let heightStyles = {};
    if(depth > 1){
        depthStyles = {borderLeftWidth: 5, borderLeftColor: colors[depth], marginLeft: (depth - 1) * 4};
    }

    let childViews = null;
    if(children){
        childViews = children.map((comment, index) => {
            return <CommentItem comment={comment} depth={depth + 1} key={index + id} />;
        });
    }

    return  <View style={Styles.container}>
                <View style={[Styles.outerContainer, depthStyles]}>
                    <View style={Styles.innerContainer}>
                        {!getHideProfilePicture &&
                        <View style={Styles.pictureContainer}>
                            <FastImage source={{uri: picture}} style={Styles.picture}/>
                        </View> }
                        <View style={Styles.textContainer}>
                            <Text style={[Styles.text, heightStyles]}>
                                <Text style={Styles.nickname}>{nickname} </Text>
                                {getContent}
                                { moreContent &&
                                <Text onPress={() => {
                                    setContent((getShowingFull ? excerpt : content));
                                    setShowingFull(!getShowingFull);
                                }} style={Styles.showMoreText}> {getShowingFull ? 'show less' : 'show more'}</Text> }
                            </Text>
                        </View>
                    </View>
                </View>
                { getShowingChildren && <View style={Styles.childrenContainer}>{childViews}</View> }
            </View>
};

CommentItem.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
        children: PropTypes.array,
        picture: PropTypes.string,
        nickname: PropTypes.string
    }).isRequired,
    depth: PropTypes.number
};

CommentItem.defaultProps = {
    depth: 1
}

export default CommentItem;
