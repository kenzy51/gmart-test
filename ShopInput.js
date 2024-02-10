import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import TextInputCom from '../../components/TextInputCom';
import TopnavBar from '../../components/TopnavBar';
import { isAndroid } from '../../utils/deviceInfo';
import { colors } from '../../constants/colors';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import ActionSheet from 'react-native-actionsheet';
import Api from '../../utils/api';
import ImagePicker from 'react-native-image-crop-picker';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ShopInput = ({ navigation }) => {
    var containerInput = useRef(null);
    const [state, setState] = useState({
        //номер контейнера
        container: '',
        latitude: '0',
        longitude: '0',
    })

    const [posGiven, setPosGiven] = useState(false);
    const [photoData, setPhotoData] = useState([]);
    const [err, setError] = useState(null);

    const actionSheetRef = useRef();

    const { container, latitude, longitude } = state



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
            GetLocation.getCurrentPosition()
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
    const apply = () => {
        const raw = {
            container: container,
            latitude: latitude,
            longitude: longitude,
        };

        //need support for photos

        var formdata = new FormData();
        /*
                formdata.append("raw[container]",container);
                formdata.append("raw[latitude]",latitude);
                formdata.append("raw[longitude]",longitude);
        */
        formdata.append('raw', raw);

        for (let i = 0; i < photoData.length; i++) {
            const photo = photoData[i][0];
            formdata.append("images", photo);
        }

        console.log(formdata)

        Api.addShop(formdata, (err, res) => {
            if (err !== null) {
                console.log('error here');
                setError(err);
            }
            if (res !== null) {
                console.log("success");
            }
        });
    }

    const AutoText = ({ title, variable }) => {
        return (
            <View style={styles.textField}>
                <Text style={styles.titleStyle}>{title}</Text>
                <Text style={[styles.input, !posGiven ? { color: "#D8D8DF" } : null]} strokeWidth="1">{variable}</Text>
            </View>
        )
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
        const item = { button: true };
        return (
            <FlatList
                data={[...photoData, item]}
                style={{ flex: 1 }}
                renderItem={({ item }) => {
                    if (item.button)
                        return <AddPhotoButton />

                    return <PhotoItem uri={item[0].uri} />
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
                    launchImageLibrary(null)
                        .then(async images => {
                            await handleImage(images[0])
                        }).catch((err) => console.log(err))
                }
            })
            .catch((error) => console.log(error))
    }

    const handleImage = async (response) => {
        try {
            if (response.assets) {
                console.log(response.assets);
                setPhotoData([...photoData, response.assets]);
                //upload to server here
                //let url = await uploadToS3(response.path, getFileExtension(response.path), response.width, response.height, response.size);

            } else {
                errorToastRef?.current?.show('Please choose a valid photo');
            }
        } catch (e) {
            this.refs.errorToast.show('Unable to update photo');
        }
    }

    const AddPhotoButton = () => {
        return (
            <TouchableOpacity style={{
                alignItems: "center",
                justifyContent: "center",
                ...styles.photoBlank,
            }}
                onPressOut={() => [actionSheetRef.current?.show()]}
            >
                <Text styles={{
                    color: "#fff",
                    fontFamily: "Montserrat-SemiBold",
                }}>
                    Add photo
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <TopnavBar title={'Add Shop'} />
            <ScrollView>
                {/*<TextInputCom title={"Region"}
                    from={"Name"}
                    placeholder={'Алкан'}
                    style={styles.textInput}
                    returnKeyType={'next'}
                    onChangeText={reg => handleChange({ key: 'region', value: reg })}
                    value={region}
                    onSubmitEditing={() => { regionInput?.current?.focus(); }}
                />

                <TextInputCom title={"Passageway"}
                    from={"Name"}
                    placeholder={'5 проход'}
                    style={styles.textInput}
                    returnKeyType={'next'}
                    onChangeText={row => handleChange({ key: 'passageway', value: row })}
                    value={passageway}
                    onSubmitEditing={() => { passagewayInput?.current?.focus(); }}
                />*/}

                <TextInputCom title={"Container"}
                    from={"Name"}
                    placeholder={'50/3'}
                    style={styles.textInput}
                    returnKeyType={'next'}
                    onChangeText={container => handleChange({ key: 'container', value: container })}
                    value={container}
                    onSubmitEditing={() => { containerInput?.current?.focus(); }}
                />

                <View style={styles.coordinatesContainer}>

                    <AutoText title="Latitude" variable={latitude} />
                    <AutoText title="Longitude" variable={longitude} />

                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={setPosition}>
                        <Text style={{ color: 'white' }}>Set position</Text>
                    </TouchableOpacity>
                </View>

                <View styles={{
                    flexDirection: "row",
                }}>
                    <Text style={styles.titleStyle}>Production</Text>
                    <Carousel />
                </View>


            </ScrollView >

            <TouchableOpacity style={{
                ...styles.buttonStyle,
                width: 120,
                height: 50,
                margin: 10,
            }}
                onPress={apply}>
                <Text style={{ color: 'white' }}>Apply</Text>
            </TouchableOpacity>

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
    textField: {
        overflow: 'auto'
    },
    photoBlank: {
        margin: 10,
        width: 75,
        height: 100,
        borderRadius: 10,
        backgroundColor: colors.darkGray,
    },
    input: {
        ...inputCom,
        marginTop: 10,
        height: 45,
        color: "#4F4F4F",
        borderRadius: 10,
        backgroundColor: "#fff",
        fontFamily: "Montserrat-Medium"
    },
    coordinatesContainer: {
        flex: 1,
        marginTop: 6,
        flexDirection: "row",
        display: 'flex',
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
})