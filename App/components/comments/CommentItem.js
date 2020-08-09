import React, {useState} from 'react';
import {Image, Text, View} from "react-native";

import {StyleSheet} from 'react-native';
const Styles = StyleSheet.create({

});

export const CommentItem = ({comment}) =>{
    const {nickname, picture, content, depth, id} = comment;
    const colors = ['#c0392B','#2ECC71','#3498DB','#9B59B6','#D35400','#1ABC9C','#34495E','#8E44AD','#F1C40F','#ECF0F1','#2C3E50','#2980B9','#E74C3C','#C0392B','#2ECC71','#3498DB','#9B59B6','#D35400','#1ABC9C','#34495E'];
    const [getSaving, setSaving] = useState(false);
    const [getShowingFull, setShowingFull] = useState(false);

    const contentSplit = content.split(' ');
    const excerpt = contentSplit.slice(0,30).join(' ');

    const [getContent, setContent] = useState(excerpt);

    let depthStyles = {};
    let heightStyles = {};
    if(depth > 1){
        depthStyles = {borderLeftWidth: 5, borderLeftColor: colors[depth], marginLeft: (depth - 1) * 4};
    }


    return  <View style={[{flex:1, paddingLeft: 8, paddingVertical: 8, backgroundColor:'#2b2b2b', marginTop:6, borderRadius:6}, depthStyles]}>
        <View style={{flexDirection:'row', alignItems:'center', paddingBottom: 8}}>
            <Image source={{uri: picture}} style={{width: 36, height: 36, borderRadius: 36/2, borderWidth: 0.25, borderColor:'#121111', marginRight: 8}}/>
            <Text style={{color:'#fff'}}>{nickname}</Text>
        </View>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
            <Text style={[{color:'#fff', paddingRight:6},heightStyles]}>{getContent} <Text onPress={() => {
                if(getShowingFull){
                    setContent(excerpt);
                }else{
                    setContent(content);
                }
                setShowingFull(!getShowingFull);
            }}>
                <Text style={{color: '#5cb85c'}}>{getShowingFull ? 'show less' : 'show more'}</Text>
            </Text></Text>
        </View>
    </View>
};
