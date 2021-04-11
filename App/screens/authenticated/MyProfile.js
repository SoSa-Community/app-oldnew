import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAPI } from '../../context/APIContext';
import { useAuthenticatedNavigation } from '../../context/AuthenticatedNavigationContext';

import ProfilePicture from '../../components/ProfilePicture';
import Input from '../../components/Input';

const Styles = StyleSheet.create({
    topContainer: {
        flex: 0,
        alignItems: 'center',
        marginVertical: '5%'
    },
    
    username: {
        fontSize: 22,
        marginTop: 6,
    },
    
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
        position:'absolute',
        top:0,
        right: 0,
        zIndex: 1,
        height: '200%',
        width: '100%'
    },
    
    nicknameContainer: {
        paddingHorizontal: 42,
        marginVertical: 8
    },
    
    tagContainer: {
        paddingHorizontal: 42,
    },
    
    nickname: {
        color:'#fff',
        fontSize: 26,
        textAlign:'center',
        flexShrink: 1,
    },
    
    tag: {
        color:'#fff',
        fontSize: 20,
        textAlign:'center',
        flexShrink: 1,
    },
    
    label: {
        color: '#f96854',
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 18
    },
    
    demographicsValue: {
        fontSize: 18,
        color:'#fff',
        fontWeight: '600',
    },
    
    changeCoverButton: {
        borderWidth: 1,
        borderColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        position: 'absolute',
        top: -15,
        right:10
    },
    
    changeCoverButtonText: {
        color:'#fff',
        fontSize: 12
    }
})

const MyProfileScreen = ({ navigation }) => {
    
    const { setHeaderIcons, removeHeaderIcon, setMenuOptions } = useAuthenticatedNavigation();
    
    
    const { services: { profiles: profileService } } = useAPI();
    
    const [ genders, setGenders ] = useState([]);
    const [ profile, setProfile ] = useState(null);
    
    const [ selectedGenderId, setSelectedGenderId ] = useState('');
    const [ dateOfBirth, setDateOfBirth ] = useState('');
    
    const [ editingMode, setEditingMode ] = useState(false);
    
    
    const refreshProfile = () => {
        setGenders([]);
        
        profileService
            .mine(true)
            .then(({ profile, options, widgets }) => {
                if(options) {
                    const { gender } = options;
                    if(Array.isArray(gender) && gender.length) {
                        const newOptions = gender.map(({id, name}) => ({label: name, value: id}));
                        setGenders(newOptions);
                    }
                }
                console.debug(profile);
                setProfile(profile);
            })
            .catch(error => console.debug(error))
    }
    
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            if(isActive){
                setEditingMode(false);
                setMenuOptions({ leftMode: 'back', title: 'My Profile'})
                refreshProfile();
            }
            
            return () => {
                if(removeHeaderIcon){
                    removeHeaderIcon('refresh_profile');
                    removeHeaderIcon('edit_profile');
                }
                isActive = false;
            }
        }, [])
    );
    
    useEffect(() => {
        if(profile) {
            const { gender, date_of_birth } = profile;
            setSelectedGenderId(gender?.id);
            
            const date = new Date(Date.parse(date_of_birth));
            if(
                Object.prototype.toString.call(date) === "[object Date]" &&
                !isNaN(date.getTime()))
            {
                setDateOfBirth(`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()}`);
            }
        }
    }, [profile]);
    
    useEffect(() => {
        if(!editingMode) {
            setHeaderIcons( [
                { id: 'edit_profile', icon: ['fal', 'pencil'], onPress: () => setEditingMode(true) },
                { id: 'refresh_profile', icon: ['fal', 'sync-alt'], onPress: refreshProfile }
            ]);
        }
        else {
            setHeaderIcons([
                { id: 'save_edit_profile', text:'Save', onPress: () => setEditingMode(false) },
                { id: 'cancel_edit_profile', text:'Cancel', onPress: () => setEditingMode(false) }
            ])
        }
    }, [ editingMode ])
    
    const Top = () => {
        const Content = () => (
                <View style={{ zIndex:100 }}>
                    { editingMode &&
                        <TouchableHighlight style={Styles.changeCoverButton}>
                            <Text style={Styles.changeCoverButtonText}>Change Cover</Text>
                        </TouchableHighlight>
                    }
                    <View style={{alignItems: 'center'}}>
                        <View style={{marginBottom: 10}}>
                            <ProfilePicture picture={profile?.picture} size="larger" editable={editingMode} />
                        </View>
                    </View>
                    
                    <View style={Styles.nicknameContainer}>
                        <Input
                            placeholder="Nickname"
                            value={ profile?.nickname }
                            onChangeText={() => {}}
                            editable={editingMode}
                            textStyle={Styles.nickname}
                        />
                    </View>
                    
                    <View style={Styles.tagContainer}>
                        <Input
                            placeholder="Tagline"
                            value={ profile?.tagline }
                            onChangeText={() => {}}
                            editable={editingMode}
                            textStyle={Styles.tag}
                        />
                    </View>
                    
                </View>
        );
        
        if (profile?.cover_picture) {
            return  <ImageBackground source={{uri: profile?.cover_picture}} style={{overflow:'hidden', resizeMode:'contain', paddingVertical: 24}}>
                        <Content />
                        <View style={Styles.overlay} />
                    </ImageBackground>
        } else {
            return <View style={{alignItems: 'center', marginVertical: 24}}>
                <Content/>
            </View>;
        }
    }
    
    const Gender = () => {
        return <View style={{marginBottom: 8}}>
                    <Input
                        label="How do you identify?"
                        labelStyle={Styles.label}
                        icon={['fal', 'genderless']}
                        placeholder="Gender Identity"
                        onChangeText={data => setSelectedGenderId(data)}
                        enabled={ true }
                        pickerOptions={ genders }
                        value={ selectedGenderId }
                        type="picker"
                        editable={editingMode}
                        textStyle={{color:'#fff', fontSize: 16}}
                    />
                </View>;
    }
    
    const Age = () => {
        
        return <View style={{}}>
            <Input
                label="How old are you?"
                labelStyle={Styles.label}
                icon={['fal', 'calendar-star']}
                placeholder="Date Of Birth"
                onChangeText={data => setDateOfBirth(data)}
                value={dateOfBirth}
                enabled
                type="date"
                allowClear={false}
                editable={editingMode}
                textStyle={{color:'#fff', fontSize: 16}}
                textValue={profile?.age}
            />
        </View>;
    }
    
    return (
        <View style={{flex: 1, backgroundColor: '#444442'}}>
            <Top />
            <View style={{padding: 16, flex:1}}>
                <Gender />
                <Age />
                
            </View>
        </View>
    );
}

export default MyProfileScreen;
