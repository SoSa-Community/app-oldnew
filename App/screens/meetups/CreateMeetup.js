import React, {Component} from 'react';
import {
    Dimensions,
    Text,
    View,
    ImageBackground,
    StyleSheet,
    ScrollView,
    FlatList,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';

import withMembersNavigationContext from "../hoc/withMembersNavigationContext";
import {ActivityButton} from "../../components/ActivityButton";
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
    appContext = {};

    navigation = {};
    drawerNavigation = {};
    apiClient = null;
    previousImage = '';
    imageURI = '';
    

    state = {
        saving: false,
        image: '',
        titleInput: '',
        dateInput: Helpers.dateToString(new Date(), 'date'),
        startInput: '19:00',
        endInput: '21:00',
        descriptionInput: '',
        typeInput: 'virtual',
        uploading: false,
        isValid: {title: false, date:true, description: false, type: true},
        errors: {}
    };
    

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
        this.drawerNavigation = this.navigationContext.drawerNavigation;
        this.drawerNavigationContext = props.navigationContext.drawerNavigationContext;
    
        const {appContext} = this.drawerNavigationContext;
        const {apiClient} = appContext;
        
        this.appContext = appContext;
        this.apiClient = apiClient;
        this.navigationContext.setMenuOptions({showLeft:true, showRight: false, leftMode: 'back', title: 'Create Meetup'});
    
    }
    
    setIsValid = (field, valid) => {
        const isValid = Object.assign({}, this.state.isValid);
        isValid[field] = valid;
        
        this.setState({isValid});
    };
    
    isValid = () => {
        return !Object.values(this.state.isValid).includes(false);
    }
    
    setError = (field, value) => {
        const errors = Object.assign({}, this.state.errors);
        errors[field] = value;
        
        this.setState({errors});
    };
    
    resetErrors = () => {
        this.setState({errors: {name:'', date:'', description: '', type:''}});
    };
    
    save = () => {
        const { apiClient: { services: { meetups } } } = this;
        const { titleInput: title, descriptionInput: description, dateInput: date, startInput: start, endInput: end, typeInput: type} = this.state;
        this.resetErrors();
        this.setState({saving: true});

        meetups.create('sosa',
            title,
            description,
            type,
            new Date(`${date}T${start}`),
            new Date(`${date}T${end}`),
            { image: this.imageURI }
        ).then((meetup) => {
            this.navigationContext.popMenuStack();
            this.navigation.replace('Meetup', {id: meetup.id});
        }).catch((errors) => {
            if(Array.isArray(errors)){
                errors.forEach(({code, message, field}) => {
                    if(field){
                        if(field === 'start' || field === 'end') field = 'date';
                        this.setError(field, message || code);
                    }
                })
            }
            console.debug('errors', errors);
        }).finally(() => {
            this.setState({saving: false});
        })
    }

    render() {
        let {titleInput, dateInput, startInput, endInput, typeInput, descriptionInput, uploading, image} = this.state;
        
        const uploadPicture = () => {
            Helpers.uploadFile(
                this.appContext,
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
        
        const { state: { errors } } = this;
        
        return (
                <View style={{flex:1, backgroundColor: '#121111'}}>
                    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#121111'}} behavior="padding" keyboardVerticalOffset={Math.floor(dimensions.height / 100 * 9)}>
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
                                <Input
                                    error={errors['title']}
                                    placeholder="What's it called?"
                                    value={titleInput}
                                    onChangeText={data => this.setState({ titleInput: data})}
                                    style={{flex:1}}
                                    minLength={16}
                                    maxLength={250}
                                    setIsValid={(isValid) => this.setIsValid('title', isValid)}
                                />

                                <Input label="When is it?" icon={['fal', 'calendar-week']} error={errors['date']} placeholder="Date" type="date" value={dateInput} onChangeText={(data, date) => this.setState({ dateInput: data})} />
                                <View style={{flexDirection: 'row', marginVertical:4}}>
                                    <View style={{flex:1}}>
                                        <Input icon={['fal', 'clock']} error={errors['date']} errorBorderOnly placeholder="When does it start?" type="time" value={startInput} onChangeText={(data, date) => this.setState({ startInput: data})} />
                                    </View>
                                    <Text style={{flex:0, color: '#fff', fontSize:24, textAlignVertical:'center', marginHorizontal: 8}}>-</Text>
                                    <View style={{flex:1}}>
                                        <Input icon={['fal', 'clock']} error={errors['date']} errorBorderOnly placeholder="When does it end?" type="time" value={endInput} onChangeText={data => this.setState({ endInput: data})} />
                                    </View>
                                </View>

                                <Input
                                    label="What's the plan?"
                                    icon={['fal', 'compass']}
                                    error={errors['type']}
                                    placeholder="Virtual or IRL?"
                                    value={typeInput}
                                    type="picker"
                                    onChangeText={(value) => {this.setState({typeInput: value})}}
                                    pickerOptions={[
                                        {label:'It\'s Online!', value:'virtual'},
                                        {label:'It\'s out there in the real world', value:'real'}
                                    ]}
                                />

                                <Input
                                    type="multiline"
                                    placeholder="Description"
                                    value={descriptionInput}
                                    error={errors['description']}
                                    onChangeText={data => this.setState({ descriptionInput: data})}
                                    multiline={true}
                                    minLength={16}
                                    maxLength={0}
                                    setIsValid={(isValid) => this.setIsValid('description', isValid)}
                                    containerStyle={{marginTop: 8}}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={Styles.buttonContainer}>
                        <View style={{flex:1}}>
                            <ActivityButton text="Create" style={{}} onPress={this.save} showActivity={this.state.saving} disabled={!this.isValid()}/>
                        </View>
                    </View>
                </View>

        );
    }
}

const CreateMeetupScreen = withMembersNavigationContext(CreateMeetup);
export default CreateMeetupScreen;
