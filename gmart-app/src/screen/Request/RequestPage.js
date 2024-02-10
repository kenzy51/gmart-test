import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  FlatList,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import TextInputCom from '../../components/TextInputCom';
import TopnavBar from '../../components/TopnavBar';
import {isAndroid} from '../../utils/deviceInfo';
import {colors} from '../../constants/colors';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import ActionSheet from 'react-native-actionsheet';
import Api from '../../utils/api';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadToBackblaze, getFileLink} from '../../utils/backblaze';
import Toast from '../../constants/Toast';
import Badges from '../../components/Badges';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
var RNFS = require('react-native-fs');

const RequestPage = ({navigation}) => {
  var nameInput = useRef(null);
  var requestDescriptionInput = useRef(null);
  const [state, setState] = useState({
    productTitle: '',
    requestDescription: '',
    textileDescription: '',
    title: '',
    price: '',
    paymentMethod: '',
    amount: '',
    time: '',
  });
  // LOCATION
  const [posGiven, setPosGiven] = useState(false);
  const [photoData, setPhotoData] = useState([]);

  const errorToastRef = useRef(null);

  const actionSheetRef = useRef();

  const [isUploading, setIsUploading] = useState(false);

  const {
    productTitle,
    requestDescription,
    title,
    price,
    paymentMethod,
    amount,
    time,
    textileDescription,
  } = state;

  const handleChange = ({key, value}) => {
    setState(prevAddress => ({
      ...prevAddress,
      [key]: value,
    }));
  };
  //send all data to server
  const apply = async () => {
    if (isUploading) return;

    const raw = {
      productTitle: productTitle,
      requestDescription: requestDescription,
      textileDescription: textileDescription,
      title: title,
      price: price,
      amount: amount,
      time: time,
      paymentMethod: paymentMethod,
      photos: [],
    };

    if (
      photoData.length < 1 ||
      productTitle == '' ||
      title == '' ||
      requestDescription == ''
    ) {
      errorToastRef?.current?.show('Fill all the fields!');
    } else {
      setIsUploading(true);
      const idPromises = photoData.map(photo => {
        console.log('Trying uploading file');
        return uploadToBackblaze(photo.uri);
      });

      raw.photos = await Promise.all(idPromises).catch(err => {
        errorToastRef?.current?.show('Unable to upload photos');
        console.error(
          'Error waiting promises for uploading files to Backblaze:',
          err.message,
        );
      });

      await Api.addRequest(raw, (err, res) => {
        setIsUploading(false);

        if (err !== null) {
          console.log('error here:', err.message);
          errorToastRef?.current?.show('Unable to upload shop');
        }
        if (res !== null) {
          console.log('success');
          navigation.goBack();
        }
      });
    }
  };

  const PhotoItem = ({uri}) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {uri === null ? (
            <View
              style={{
                ...styles.photoBlank,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>NO PHOTO</Text>
            </View>
          ) : (
            <Image source={{uri: uri}} style={styles.photoBlank} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const Carousel = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={photoData}
        style={{flex: 1}}
        renderItem={item => {
          return <PhotoItem uri={item.item.uri} />;
        }}
        horizontal={true}
      />
    );
  };

  const handleActionButtonPress = selectedIndex => {
    if (selectedIndex === 0) openCamera();
    else if (selectedIndex === 1) openGallery();
  };

  const openCamera = () => {
    const permission = isAndroid
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;
    request(permission)
      .then(result => {
        if (result === 'granted') {
          launchCamera()
            .then(async image => {
              await handleImage(image);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(error => console.log(error));
  };

  const openGallery = () => {
    const permission = isAndroid
      ? Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;

    request(permission)
      .then(result => {
        if (result === 'granted') {
          launchImageLibrary({
            selectionLimit: 8,
          })
            .then(async images => {
              await handleImage(images);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(error => console.log(error));
  };

  const handleImage = async response => {
    try {
      console.log(Object.keys(response));
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
  };

  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
      }}>
      <TopnavBar title={'Add Request'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.block}>
          <TextInputCom
            title={'Title'}
            from={'Name'}
            placeholder={'Add title'}
            returnKeyType={'next'}
            onChangeText={title => handleChange({key: 'title', value: title})}
            value={title}
            onSubmitEditing={() => {
              nameInput?.current?.focus();
            }}
          />
        </View>
        {/*  */}
        {/*  */}
        <View style={styles.block}>
          <TextInputCom
            title={'Product Title'}
            from={'Name'}
            placeholder={'Enter product title'}
            returnKeyType={'next'}
            onChangeText={value => handleChange({key: 'productTitle', value})}
            value={state.productTitle}
          />
        </View>

        <View style={styles.block}>
          <TextInputCom
            title={'Request Description'}
            from={'Name'}
            placeholder={'Enter requestDescription'}
            returnKeyType={'next'}
            onChangeText={value =>
              handleChange({key: 'requestDescription', value})
            }
            value={state.requestDescription}
          />
        </View>
        <View style={styles.block}>
          <TextInputCom
            title={'Textile Description'}
            from={'Name'}
            placeholder={'Enter Textile Description'}
            returnKeyType={'next'}
            onChangeText={value =>
              handleChange({key: 'textileDescription', value})
            }
            value={state.textileDescription}
          />
        </View>

        <View style={styles.block}>
          <TextInputCom
            title={'Price'}
            placeholder={'Enter price'}
            keyboardType={'numeric'}
            from={'Name'}
            returnKeyType={'next'}
            onChangeText={value => handleChange({key: 'price', value})}
            value={state.price}
          />
        </View>

        <View style={styles.block}>
          <TextInputCom
            from={'Name'}
            title={'Payment Method'}
            placeholder={'Enter payment method'}
            returnKeyType={'next'}
            onChangeText={value => handleChange({key: 'paymentMethod', value})}
            value={state.paymentMethod}
          />
        </View>

        <View style={styles.block}>
          <TextInputCom
            title={'Amount'}
            from={'Name'}
            placeholder={'Enter amount'}
            keyboardType={'numeric'}
            returnKeyType={'next'}
            onChangeText={value => handleChange({key: 'amount', value})}
            value={state.amount}
          />
        </View>

        <View style={styles.block}>
          <TextInputCom
            title={'Time'}
            from={'Name'}
            placeholder={'Enter time'}
            returnKeyType={'next'}
            onChangeText={value => handleChange({key: 'time', value})}
            value={state.time}
          />
        </View>

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
          }}>
          <View style={{height: 100, flex: 1}}>
            <Carousel />
          </View>

          <TouchableOpacity
            style={{justifyContent: 'center', margin: 20}}
            onPressOut={() => [actionSheetRef.current?.show()]}>
            <MaterialIcons
              name={'add-photo-alternate'}
              size={35}
              color={colors.statusBar}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <TouchableOpacity style={styles.apply} onPress={apply}>
            <Text style={{color: 'white'}}>Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal transparent visible={isUploading}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: 100,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgb(173 232 10)',
              borderRadius: 3,
            }}>
            <Text
              style={{
                color: 'darkslategray',
                fontFamily: 'Montserrat-Regular',
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
        onPress={index => handleActionButtonPress(index)}
        tintColor={'#000'}
        styles={{
          titleText: styles.actionTitleText,
          buttonText: styles.buttonTextStyle,
          cancelButtonBox: styles.cancelButtonStyle,
        }}
      />
    </View>
  );
};

export default RequestPage;

const inputCom = {
  fontSize: 16,
  paddingHorizontal: 15,
  marginHorizontal: 8,
};

const styles = StyleSheet.create({
  keywordsStyle: {
    fontSize: 13,
  },
  apply: {
    marginHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'grey',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },
  dropdownBox: {
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  textField: {
    overflow: 'auto',
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
    color: '#4F4F4F',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontFamily: 'Montserrat-Medium',
  },
  coordinatesname: {
    flex: 1,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageStyle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: colors.paleGray,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  priceSections: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  addPhotoButton: {
    width: 100,
    height: 400,
    marginHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: 100,
    height: 40,
    marginHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: 'grey',
    marginHorizontal: 20,
    fontSize: 14,
    marginBottom: 0,
    fontFamily: 'Montserrat-Regular',
  },
  block: {
    height: 70,
  },
});
