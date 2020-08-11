import React, {useState} from 'react';
import {Image, Text, View, TouchableHighlight} from "react-native";

import {StyleSheet} from 'react-native';
const Styles = StyleSheet.create({

});

export const CommentItem = ({comment, depth}) =>{
    const {id, nickname, picture, content, children} = comment;

    if(!depth) depth = 1;

    const colors = ['#c0392B','#2ECC71','#3498DB','#9B59B6','#D35400','#1ABC9C','#34495E','#8E44AD','#F1C40F','#ECF0F1','#2C3E50','#2980B9','#E74C3C','#C0392B','#2ECC71','#3498DB','#9B59B6','#D35400','#1ABC9C','#34495E'];
    const [getSaving, setSaving] = useState(false);
    const [getShowingFull, setShowingFull] = useState(false);
    const [getShowingChildren, setShowingChildren] = useState(false);

    const contentSplit = content.split(' ');
    const excerpt = contentSplit.slice(0,30).join(' ');

    const [getContent, setContent] = useState(excerpt);

    let depthStyles = {};
    let heightStyles = {};
    if(depth > 1){
        depthStyles = {borderLeftWidth: 5, borderLeftColor: colors[depth], marginLeft: (depth - 1) * 4};
    }

    let childrenViews = null;
    if(children){
        childrenViews = children.map((comment) => {
            return <CommentItem comment={comment} depth={depth + 1} />;
        });
    }

    return  <View style={{flex:1}}>
                <View style={[{flex:1, paddingLeft: 8, paddingVertical: 8, backgroundColor:'#2b2b2b', marginTop:6, borderRadius:6}, depthStyles]}>
                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                        <View style={{flex: 0}}>
                            <Image source={{uri: picture}} style={{width: 36, height: 36, borderRadius: 36/2, borderWidth: 0.25, borderColor:'#121111', marginRight: 8}}/>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={[{color:'#fff', paddingRight:6},heightStyles]}>
                                <Text style={{color:'#5cb85c'}}>{nickname} </Text>
                                {getContent}
                                <Text onPress={() => {
                                    setShowingChildren(!getShowingChildren);
                                    if(getShowingFull){
                                        setContent(excerpt);
                                    }else{
                                        setContent(content);
                                    }
                                    setShowingFull(!getShowingFull);
                                }} style={{color: '#5cb85c'}}> {getShowingFull ? 'show less' : 'show more'}</Text>
                            </Text>
                        </View>
                    </View>

                    { children && <View style={{flex: 1}}>
                        <TouchableHighlight onPress={() => setShowingChildren(!getShowingChildren)}><Text style={{color: '#5cb85c'}}>Toggle Children</Text></TouchableHighlight>
                    </View> }
                </View>
                { getShowingChildren && <View style={{flex:1}}>{childrenViews}</View> }
            </View>
};
