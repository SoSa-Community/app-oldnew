import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, ImageBackground} from 'react-native';
import Modal from "react-native-modal";
import PropTypes from "prop-types";
import {useAPI} from '../context/APIContext';
import {useApp} from '../context/AppContext';

const Styles = StyleSheet.create({
    body: { backgroundColor:'#121211' },
    pictureContainer: { marginBottom: 12 },
    textContainer: {},
    text: {color:'#fff', fontSize:30, textAlign:'left'},
    picture: {width: 128, height: 128, borderRadius: 128/2},
    demographicsContainer: {
        paddingVertical: 18,
        paddingHorizontal: 62,
        backgroundColor: '#353535'
    },
    
    demographicsTopRow: {
        flexDirection:'row',
        justifyContent:'center',
        marginBottom: 8
    },
    
    demographicsLocation: {
        flexDirection:'row'
    },
    
    demographicsLabel: {
        color: '#f96854',
        fontWeight: '600',
        marginRight: 8,
        fontSize: 18
    },
    
    demographicsValue: {
        fontSize: 18,
        color:'#fff',
        fontWeight: '600'
    },
    
    aboutText: {
        marginVertical: 32,
        marginBottom: 40,
        marginHorizontal: 52,
    
        fontSize: 18,
        color:'#fff',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 28
    },
    
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
        position:'absolute',
        top:0,
        right: 0,
        zIndex: 1,
        height: '200%',
        width: '100%'
    }
});

const ProfileModal = ({profileId, onDismiss}) => {
    const { modals } = useApp();
    const { services: { profiles: profileService } } = useAPI();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ profile, setProfile ] = useState(null);
    
    const handleDismiss = () => {
        setProfile(null);
        setIsLoading(false);
        onDismiss && onDismiss();
    }
    
    const Age = () => {
        if(!profile?.age) return <></>;
        return <View style={{flex: 1, flexDirection:'row'}}>
                    <Text style={Styles.demographicsLabel}>Age:</Text>
                    <Text style={Styles.demographicsValue}>{profile?.age}</Text>
                </View>;
    }
    
    const Gender = () => {
        if(!profile?.gender) return <></>;
        return <View style={{flex: 1, flexDirection:'row'}}>
            <Text style={Styles.demographicsLabel}>Gender:</Text>
            <Text style={Styles.demographicsValue}>{profile?.gender?.name}</Text>
        </View>;
    }
    
    const Location = () => {
        if(!profile?.current_location) return <></>;
        return <View style={Styles.demographicsLocation}>
            <Text style={Styles.demographicsLabel}>Location:</Text>
            <Text style={Styles.demographicsValue}>{profile?.current_location}</Text>
        </View>;
    }
    
    const About = () => {
        if(!profile?.about) return <></>;
        let aboutString = profile?.about;
        const maxLength = 100;
        
        if(aboutString.length > maxLength){
            const parts = profile?.about.split(' ');
            let newString = '';
            
            parts.forEach(part => {
                const test = `${newString} ${part}`;
                if(test.length < maxLength) newString = test;
            });
            aboutString = `${newString}...`;
        }
        
        return <Text style={Styles.aboutText}>{ aboutString.substr(0, maxLength + 3) }</Text>
    }
    
    const Top = () => {
    
        const Content = () => <View style={{zIndex:100, alignItems: 'center'}}>
            <View style={Styles.pictureContainer}>
                <Image source={{uri: profile?.picture}} style={Styles.picture}/>
            </View>
            <Text style={Styles.text}>{profile?.nickname}</Text>
        </View>;
    
        if (profile?.cover_picture) {
            return <ImageBackground source={{uri: profile?.cover_picture}} style={{overflow:'hidden', resizeMode:'contain', paddingVertical: 24}}>
                <Content/>
                <View style={Styles.overlay} />
            </ImageBackground>
        } else {
            return <View style={{alignItems: 'center', marginVertical: 24}}>
                <Content/>
            </View>;
        }
    }
    
    const Profile = () => {
        return <>
            <Top />
            <View style={Styles.demographicsContainer}>
                <View style={Styles.demographicsTopRow}>
                    <Age />
                    <Gender />
                </View>
                <Location />
            </View>
            <About />
            <TouchableOpacity>
                <View style={{borderWidth: 2, borderColor: '#7C7C7C', paddingVertical: 12, borderRadius: 16, marginHorizontal:'25%'}}>
                    <Text style={{color:'#fff', textAlign: 'center', fontSize: 18}}>View More</Text>
                </View>
            </TouchableOpacity>
        </>
    };
    
    useEffect(() => {
        setIsLoading(true);
        setProfile(null);
        if(profileId) {
            profileService.get(profileId)
                .then((profile) => {
                    console.debug(profile);
                    setProfile(profile);
                })
                .catch((error) => {
                    handleDismiss();
                    modals?.create('Profile unavailable', 'This user\'s profile is not available to you!');
                })
                .finally(() => setIsLoading(false));
        }
    }, [profileId]);
    
    return (
        <Modal style={{justifyContent: 'flex-end', margin:0}}
               animationType="slide"
               swipeDirection="down"
               visible={!!(profileId)}
               transparent={true}
               hardwareAccelerated={true}
               onBackdropPress={handleDismiss}
               onSwipeComplete={handleDismiss}
        >
            <View style={Styles.body}>
                { isLoading && <ActivityIndicator color="#fff" size="large" style={{alignSelf:'center', marginVertical: 24}}/> }
                { !isLoading && <Profile /> }
            </View>
        </Modal>
    )
}

ProfileModal.propTypes = {
    onDismiss: PropTypes.func.isRequired
};

export default ProfileModal;
