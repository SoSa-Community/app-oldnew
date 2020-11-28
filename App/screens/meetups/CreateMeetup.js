import React, {Component} from 'react';
import {
    Dimensions,
    Text,
    View,
    ImageBackground, StyleSheet, ScrollView, FlatList, Platform, TouchableOpacity, ActivityIndicator
} from 'react-native';

import withMembersNavigationContext from "../hoc/withMembersNavigationContext";
import {ActivityButton} from "../../components/ActivityButton";
import {IconInput} from "../../components/IconInput";
import {Input} from "../../components/Input";
import Helpers from "../../sosa/Helpers";

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

const Styles = StyleSheet.create({
    container: {flex:1, margin:16},
    
    buttonContainer: {
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 4,
        paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        marginTop: 8
    },

    viewButtonContainer: {
        flex: 1,
        justifyContent:'flex-start',
    },

    viewButtonText: {textAlign:'center', color:'#fff'},
    
    image: {
        width: '100%',
        height: 175,
        flex:1
    },
    
    imageOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        position:'absolute',
        top:0,
        left: 0,
        height:'100%',
        width:'100%'
    },
    
    imageBottomContainer: {
        flex: 1,
        justifyContent:'flex-end'
    },
    
    imageBottomInnerContainer: {
        margin: 4,
        marginRight: 10,
        height: 40,
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center'
    },
});

export class CreateMeetup extends Component {
    drawerNavigationContext = {};
    navigationContext = {};

    navigation = {};
    drawerNavigation = {};
    apiClient = null;
    previousImage = '';
    imageURI = '';

    state = {
        saving: false,
        image: '',
        nameInput: 'testy test test test',
        dateInput: Helpers.dateToString(new Date(), 'date'),
        startInput: '19:00',
        endInput: '21:00',
        descriptionInput: 'asdasdasd kaljsd lkjaslkdj lkasj lkjaslkdj jlkajs lkjaslkdj dlkja slkkldj lklajjloqwoie ioqwj ioqwe oiqwhe oiqhow heoiqh oiahsdoaslkdjkjqwnkibasjkbkajsbdiqbuwdiubdkjasb. sadhkjahsdkjhasdkjh ksakjh KJ Ash k. hjkasd kjhh kjashdkjhsakjdhkja khas kjhkdhskjhd kjaskjdh kjshd kjhh dkjhkjd hkjashd k asdkj h',
        typeInput: 'virtual',
        uploading: false,
        nameError: null
    };

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
        this.drawerNavigation = this.navigationContext.drawerNavigation;
        this.drawerNavigationContext = props.navigationContext.drawerNavigationContext;
    
        const {appContext} = this.drawerNavigationContext;
        const {apiClient} = appContext;
        this.apiClient = apiClient;
        this.navigationContext.setMenuOptions({showLeft:true, showRight: false, leftMode: 'back', title: 'Create Meetup'});
    }
    
    save = () => {
        const { apiClient: { services: { meetups } } } = this;
        const { nameInput: name, descriptionInput: description, dateInput: date, startInput: start, endInput: end, typeInput: type} = this.state;
        
        this.setState({saving: true});

        meetups.create('sosa',
            name,
            description,
            type,
            new Date(`${date}T${start}`),
            new Date(`${date}T${end}`),
            { image: this.imageURI }
        ).then((meetup) => {
            this.navigationContext.popMenuStack();
            this.navigation.replace('Meetup', {id: meetup.id});
        }).catch((errors) => {
            console.debug('errors', errors);
        }).finally(() => {
            this.setState({saving: false});
        })
    }

    render() {
        let {nameInput, dateInput, startInput, endInput, typeInput, descriptionInput, uploading, image} = this.state;
        
        const uploadPicture = () => {
            Helpers.uploadFile(
                this.apiClient,
                'sosa',
                (uploading) => {
                    this.setState({uploading});
                },
                ({uri, fileName, type, data}) => {
                    this.previousImage = image;
                    this.setState({image: `data:${type};base64,${data}`});
                }
            )
            .then(({uris, tag, uuid}) => {
                    if(Array.isArray(uris)){
                        this.imageURI = uris.pop();
                    }
            }).catch((error) => {
                this.setState({image: this.previousImage});
            });
        };
        
        let source = {};
        if(image) source = {uri : image};
        else source = require('../../assets/choose_meetup_image_v2.jpg');
        
        const buttons = () => {
            const resetButton = image ? <ActivityButton text="Reset" style={{backgroundColor: 'rgba(125, 125, 200, 0.70)', paddingHorizontal: 24, borderRadius: 16, marginRight: 8}} onPress={() => {this.setState({image: ''})}} /> : null;
            if(!uploading) {
                return (
                    <View style={Styles.imageBottomContainer}>
                        <View style={Styles.imageBottomInnerContainer}>
                            { resetButton }
                            <ActivityButton text="Change" style={{backgroundColor: 'rgba(0, 0, 0, 0.70)', paddingHorizontal: 28, borderRadius: 16}} onPress={uploadPicture} />
                        </View>
                    </View>
                );
            }
        }
        
        return (
            
                <View style={{flex:1, backgroundColor: '#121111'}}>
                    <ScrollView style={{flex:1}} scrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{flex:0}}>
                            <View style={{height: imageHeight, width: imageWidth}}>
                                <ImageBackground source={source} style={{height: imageHeight, width: imageWidth, flex:1}}>
                                    { uploading && <ActivityIndicator color="#fff" size="large" style={{alignSelf:'center', flex:1, position:'absolute', top:0, left: 0, height:'100%', width:'100%'}}/> }
                                    <View style={[Styles.imageOverlay, {height: imageHeight, width: imageWidth}]} />
                                    { buttons() }
                                </ImageBackground>
                            </View>
                        </View>
                        <View style={{flex:1, paddingHorizontal:4, marginTop: 8}}>
                            <IconInput icon={['fal', 'user']} placeholder="What's it called?" value={nameInput} onChangeText={data => this.setState({ nameInput: data})} style={{flex:1}} validateInput={() => this.state.nameError}/>
                            
                            <Text style={{color: '#fff', marginTop: 8, marginBottom: 4, fontSize:16}}>When is it?</Text>
                            <IconInput icon={['fal', 'user']} placeholder="Date" type="date" value={dateInput} onChangeText={(data, date) => this.setState({ dateInput: data})} />
                            <View style={{flexDirection: 'row', marginVertical:4}}>
                                <View style={{flex:1}}>
                                    <IconInput icon={['fal', 'user']} placeholder="When does it start?" type="time" value={startInput} onChangeText={(data, date) => this.setState({ startInput: data})} />
                                </View>
                                <Text style={{flex:0, color: '#fff', fontSize:24, textAlignVertical:'center', marginHorizontal: 8}}>-</Text>
                                <View style={{flex:1}}>
                                    <IconInput icon={['fal', 'user']} placeholder="When does it end?" type="time" value={endInput} onChangeText={data => this.setState({ endInput: data})} />
                                </View>
                            </View>
    
                            <Text style={{color: '#fff', marginTop: 8, marginBottom: 4, fontSize:16}}>What's the plan?</Text>
                            <IconInput icon={['fal', 'user']}  placeholder="Virtual or IRL?" value={typeInput} type="picker" onChangeText={(value) => {this.setState({typeInput: value})}} pickerOptions={[{label:'Virtual', value:'virtual'}, {label:'Real Life', value:'real'}]}/>
                            <Input placeholder="Description" value={descriptionInput} onChangeText={data => this.setState({ descriptionInput: data})} multiline={true} />
                        </View>
                    </ScrollView>
                    <View style={Styles.buttonContainer}>
                        <View style={{flex:1}}>
                            <ActivityButton text="Save" style={{backgroundColor: '#28a745'}} onPress={this.save} showActivity={this.state.saving} />
                        </View>
                    </View>
                </View>
            
        );
    }
}

const CreateMeetupScreen = withMembersNavigationContext(CreateMeetup);
export default CreateMeetupScreen;
