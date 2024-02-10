import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform, FlatList, Modal, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TextInputCom from '../../components/TextInputCom';
import TopnavBar from '../../components/TopnavBar';
import { isAndroid } from '../../utils/deviceInfo';
import { colors } from '../../constants/colors';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import ActionSheet from 'react-native-actionsheet';
import Api from '../../utils/api';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadToBackblaze, getFileLink } from '../../utils/backblaze';
import Toast from '../../constants/Toast';
import Badges from '../../components/Badges';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
var RNFS = require('react-native-fs');

const ShopInput = ({ navigation }) => {
    var containerInput = useRef(null);
    var descriptionInput = useRef(null);
    const [state, setState] = useState({
        //номер контейнера
        container: '',
        description: '',
        latitude: '',
        longitude: '',
    })

    const [posGiven, setPosGiven] = useState(false);
    const [photoData, setPhotoData] = useState([]);
    let [selectedKeywords, setSelectedKeywords] = useState([]);

    const [keywordsData, setKeywordsData] = useState([]);

    const errorToastRef = useRef(null)

    const actionSheetRef = useRef();

    const [isUploading, setIsUploading] = useState(false);

    const { container, latitude, longitude, description } = state

    useEffect(() => {
        const fetch = async () => {
            Api.getKeywords((err, res) => {
                if (err !== null) console.log('errorf:', err.message);
                if (res !== null) {
                    setKeywordsData(res.data.keywords)
                }
            });
        }
        fetch();
    }, []);

    const handleChange = ({ key, value }) => {
        setState((prevAddress) => ({
            ...prevAddress,
            [key]: value,
        }));
    }

    const requestLocationPermission = async () => {
        const loc = isAndroid ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

        const res = await check(loc);

        switch (res) {
            case RESULTS.GRANTED:
                return true;
            default:
                return false;
        }

    }

    const setPosition = () => {
        const result = requestLocationPermission();
        result.then(res => {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
            })
                .then((loc) => {
                    console.log(loc);
                    handleChange({ key: 'latitude', value: loc.latitude })
                    handleChange({ key: 'longitude', value: loc.longitude })
                    setPosGiven(true);
                })
                .catch((err) => { });
        });
    }


    //send all data to server
    const apply = async () => {
        if (isUploading) return;

        const raw = {
            container: container,
            latitude: latitude,
            longitude: longitude,
            description: description,
            keywords: [],
            photos: [],
            our: true,
        };

        if (selectedKeywords.length < 1 || photoData.length < 1 || longitude == '' || latitude == '' || container == '' || description == '') {
            errorToastRef?.current?.show('Fill all the fields!');
        }
        else {
            setIsUploading(true);
            raw.keywords = selectedKeywords.map((indx) => keywordsData[indx]);
            //console.log("here:",photoData);

            const idPromises = photoData.map((photo, index) => {
                console.log('Trying uploading file');
                return uploadToBackblaze(photo.uri);
            });
    
            raw.photos = await Promise.all(idPromises)
                .catch((err) => {
                    errorToastRef?.current?.show('Unable to upload photos');
                    console.error('Error waiting promises for uploading files to Backblaze:', err.message)
                });
    

            Api.addShop(raw, (err, res) => {
                setIsUploading(false);

                if (err !== null) {
                    console.log('error here:', err.message);
                    errorToastRef?.current?.show('Unable to upload shop');
                }
                if (res !== null) {
                    console.log("success");
                    navigation.goBack();
                }
            });

            setIsUploading(false);
        }
    }

    const AutoText = ({ title, variable }) => {
        return (
            <View style={styles.textField}>
                <Text style={styles.titleStyle}>{title}</Text>
                <Text style={[styles.input, {
                    width: 100,
                }, !posGiven ? { color: "#D8D8DF" } : null]} ellipsizeMode='tail' numberOfLines={1}>{variable}</Text>
            </View>
        )
    }

    const addSelectedKeyword = (index) => {
        const find = selectedKeywords.indexOf(index);
        if (find != -1)
            selectedKeywords = [...selectedKeywords.slice(0, index), ...selectedKeywords.slice(index + 1)];
        else
            selectedKeywords.push(index);

        setSelectedKeywords(selectedKeywords);
    }

    const PhotoItem = ({ uri }) => {
        return (<View>
            <TouchableOpacity style={{
                alignItems: "center",
                justifyContent: "center",
            }}>
                {uri === null ?
                    <View style={{
                        ...styles.photoBlank,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text>
                            NO PHOTO
                        </Text>
                    </View>
                    :
                    <Image
                        source={{ uri: uri }}
                        style={styles.photoBlank}
                    />
                }
            </TouchableOpacity>
        </View>);
    }

    const Carousel = () => {
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={photoData}
                style={{ flex: 1 }}
                renderItem={(item) => {
                    return <PhotoItem uri={item.item.uri} />
                }}
                horizontal={true}
            />
        );
    }

    const handleActionButtonPress = (selectedIndex) => {
        if (selectedIndex === 0) openCamera()
        else if (selectedIndex === 1) openGallery()
    }

    const openCamera = () => {
        const permission = isAndroid ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
        request(permission)
            .then((result) => {
                if (result === 'granted') {
                    launchCamera()
                        .then(async image => {
                            await handleImage(image);
                        }).catch((err) => console.log(err))
                }
            })
            .catch((error) => console.log(error))
    }

    const openGallery = () => {
        const permission = isAndroid ? (Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) : PERMISSIONS.IOS.PHOTO_LIBRARY
        request(permission)
            .then((result) => {
                if (result === 'granted') {
                    launchImageLibrary({
                        selectionLimit: 8,
                    })
                        .then(async images => {
                            await handleImage(images)
                        }).catch((err) => console.log(err))
                }
            })
            .catch((error) => console.log(error))
    }

    const handleImage = async (response) => {
        try {
            if (response.assets) {
                setPhotoData([...photoData, ...response.assets]);
                //upload to server here
                //let url = await uploadToS3(response.path, getFileExtension(response.path), response.width, response.height, response.size);

            } else {
                errorToastRef?.current?.show('Please choose a valid photo');
            }
        } catch (e) {
            this.refs.errorToast.show('Unable to update photo');
        }
    }

    const [isNewKeyword, setIsNewKeyword] = useState(false);
    const [newKeyword, setNewKeyword] = useState(null);

    const addNewKeyword = () => {
        if (keywordsData.indexOf(newKeyword) == -1) {
            if (newKeyword !== null && newKeyword !== '')
                keywordsData.push(newKeyword);
        }

        setKeywordsData(keywordsData);

        setNewKeyword(null);
        setIsNewKeyword(false);
    }

    const offNewKeyword = () => {
        setIsNewKeyword(false);
        setNewKeyword(null);
    }

    return (
        <View style={{
            ...StyleSheet.absoluteFill,
        }}>
            <TopnavBar title={'Add Shop'} />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.block}>
                    <TextInputCom title={"Container"}
                        from={"Name"}
                        placeholder={'50/3'}
                        returnKeyType={'next'}
                        onChangeText={container => handleChange({ key: 'container', value: container })}
                        value={container}
                        onSubmitEditing={() => { containerInput?.current?.focus(); }}
                    />
                </View>
                <View style={styles.block}>
                    <TextInputCom title={"Description"}
                        from={"Name"}
                        placeholder={'These sell courts'}
                        returnKeyType={'next'}
                        onChangeText={description => handleChange({ key: 'description', value: description })}
                        value={description}
                        onSubmitEditing={() => { descriptionInput?.current?.focus(); }}
                    />
                </View>
                <View style={styles.block}>
                    <View style={styles.coordinatesContainer}>

                        <AutoText title="Latitude" variable={latitude} />
                        <AutoText title="Longitude" variable={longitude} />

                        <TouchableOpacity style={styles.buttonStyle}
                            onPress={setPosition}>
                            <Text style={{ color: 'white' }}>Set position</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    flexDirection: 'row',
                }}>
                    <View style={{ height: 100, flex: 1 }}>
                        <Carousel />
                    </View>

                    <TouchableOpacity style={{ justifyContent: 'center', margin: 20, }}
                        onPressOut={() => [actionSheetRef.current?.show()]}
                    >
                        <MaterialIcons name={"add-photo-alternate"} size={35} color={colors.statusBar} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <ScrollView
                        style={{
                            margin: 10,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Badges items={keywordsData} textStyle={styles.keywordsStyle} touchable={true} onPressBadge={addSelectedKeyword} alignWidth={290} />
                    </ScrollView>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', margin: 2, right: 15 }}
                        onPressOut={() => {
                            console.log('dss')
                            setIsNewKeyword(true)
                        }}>

                        <MaterialIcons name={"edit"} size={35} color={colors.statusBar} />
                    </TouchableOpacity>
                </View>

                <View style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                }}>
                    <TouchableOpacity
                        style={styles.apply}
                        onPress={apply}
                    >
                        <Text style={{ color: 'white' }}>Apply</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <Toast
                ref={errorToastRef}
                position={'center'}
                positionValue={150}
                style={{ backgroundColor: colors.red }}
                textStyle={{ color: colors.white }}
            />
            <Modal
                transparent
                visible={isNewKeyword}
                onRequestClose={offNewKeyword}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                    }}

                    onPressOut={offNewKeyword}
                >
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                        <Text style={{
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: 16,
                            backgroundColor: 'brown',
                            color: 'white',
                            borderRadius: 10,
                            padding: 10,
                        }}>
                            New keyword
                        </Text>
                        <TextInputCom
                            title={"New keyword"}
                            from={"Name"}
                            placeholder={'Jeans'}
                            returnKeyType={'next'}
                            onChangeText={newKeyword => setNewKeyword(newKeyword)}
                            value={newKeyword}
                            onSubmitEditing={addNewKeyword}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                transparent
                visible={isUploading}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{
                        width: 100,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgb(173 232 10)',
                        borderRadius: 3,
                    }}>
                        <Text style={{
                            color: 'darkslategray',
                            fontFamily: "Montserrat-Regular"
                        }}>
                            Loading
                        </Text>
                    </View>
                </View>
            </Modal>

            <ActionSheet
                ref={actionSheetRef}
                title={'Attach Photo'}
                options={['Capture Photo', 'Choose from Library', 'Cancel']}
                cancelButtonIndex={2}
                onPress={(index) => handleActionButtonPress(index)}
                tintColor={"#000"}
                styles={{
                    titleText: styles.actionTitleText,
                    buttonText: styles.buttonTextStyle,
                    cancelButtonBox: styles.cancelButtonStyle,
                }}
            />
        </View >
    )
}

export default ShopInput

const inputCom = {
    fontSize: 16,
    paddingHorizontal: 15,
    marginHorizontal: 8,
}

const styles = StyleSheet.create({
    keywordsStyle: {
        fontSize: 13,
    },
    apply: {
        marginHorizontal: 20,
        backgroundColor: colors.statusBar,
        alignSelf: "center",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        height: 50,
        margin: 10,
        bottom: 5,
    },
    textInput: {
        flex: 1,
        height: 100,
    },
    dropdownCheckbox: {
        borderRadius: 10,
    },
    dropdownItem: {
        backgroundColor: 'black',
    },
    dropdownBadge: {
        backgroundColor: colors.statusBar,
        margin: 3,
    },
    dropdownTitle: {
        margin: 0,
        padding: 0,
        color: "grey",
        fontSize: 14,
        marginBottom: 10,
        fontFamily: "Montserrat-Regular",
    },
    dropdownBox: {
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    textField: {
        overflow: 'auto'
    },
    photoBlank: {
        margin: 7,
        width: 70,
        height: 100,
        borderRadius: 2,
        backgroundColor: colors.darkGray,
    },
    input: {
        ...inputCom,
        marginTop: 10,
        height: 20,
        color: "#4F4F4F",
        borderRadius: 10,
        backgroundColor: "#fff",
        fontFamily: "Montserrat-Medium"
    },
    coordinatesContainer: {
        flex: 1,
        marginTop: 6,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    imageStyle: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: colors.paleGray,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30
    },
    priceSections: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: "#fff",
        marginBottom: 5
    },
    addPhotoButton: {
        width: 100,
        height: 400,
        marginHorizontal: 20,
        backgroundColor: colors.statusBar,
        alignSelf: "center",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonStyle: {
        width: 100,
        height: 40,
        marginHorizontal: 20,
        backgroundColor: colors.statusBar,
        alignSelf: "center",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    titleStyle: {
        color: "grey",
        marginHorizontal: 20,
        fontSize: 14,
        marginBottom: 0,
        fontFamily: "Montserrat-Regular"
    },
    block: {
        height: 70,
    }
})