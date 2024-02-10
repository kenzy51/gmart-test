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
import ActionSheet from 'react-native-actionsheet';
import Api from '../../utils/api';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadToBackblaze, getFileLink} from '../../utils/backblaze';
import Toast from '../../constants/Toast';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
var RNFS = require('react-native-fs');

const ProductAdd = ({navigation}) => {
  var nameInput = useRef(null);
  var descriptionInput = useRef(null);
  const [state, setState] = useState({
    name: '',
    description: '',
    location: '',
  });
  const [photoData, setPhotoData] = useState([]);
  const errorToastRef = useRef(null);
  const actionSheetRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const {name, description, location} = state;

  const handleChange = ({key, value}) => {
    setState(prevAddress => ({
      ...prevAddress,
      [key]: value,
    }));
  };

  //send all data to server
  // const apply = async () => {
  //   if (isUploading) return;
  
  //   // Check if all required fields are filled
  //   if (
  //     name === '' ||
  //     description === '' ||
  //     location === '' ||
  //     photoData.length < 1
  //   ) {
  //     errorToastRef?.current?.show('Fill all the fields!');
  //     return;
  //   }
  
  //   setIsUploading(true);
  
  //   try {
  //     // Upload each photo and store the resulting URLs in raw.photos
  //     const uploadedPhotosUrls = await Promise.all(
  //       photoData.map(async (photo) => {
  //         const uploadResult = await uploadToBackblaze(photo.uri);
  //         return uploadResult.url; // Assuming the uploadToBackblaze returns an object with a url property
  //       })
  //     );
  
  //     const raw = {
  //       name,
  //       description,
  //       location,
  //       photos: uploadedPhotosUrls,
  //     };
  
  //     // Send the product data to the API
  //     await Api.addProduct(raw, (err, res) => {
  //       setIsUploading(false);
  
  //       if (err) {
  //         console.error('Error uploading product:', err.message);
  //         errorToastRef?.current?.show('Unable to upload product');
  //         return;
  //       }
  
  //       if (res) {
  //         console.log('Product uploaded successfully');
  //         navigation.goBack();
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error during photo upload:', error.message);
  //     errorToastRef?.current?.show('Unable to upload photos');
  //     setIsUploading(false);
  //   }
  // };



  // 
  // 
  // 
  const apply = async () => {
    if (isUploading) return;
    const raw = {
      name: name,
      description: description,
      location: location,
      photos: [],
    };

    if (
      photoData.length < 1 ||
      location == '' ||
      name == '' ||
      description == ''
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

      await Api.addProduct(raw, (err, res) => {
        setIsUploading(false);

        if (err !== null) {
          console.log('error here:', err.message);
          errorToastRef?.current?.show('Unable to upload product');
        }
        if (res !== null) {
          console.log('success');
          navigation.goBack();
        }
      });
    }
  };


  // 
  // 
  // 
  // 

  

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
        //let uri = await uploadToS3(response.path, getFileExtension(response.path), response.width, response.height, response.size);
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
      <TopnavBar title={'Add product'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.block}>
          <TextInputCom
            title={'Name'}
            from={'Name'}
            placeholder={'Input your product'}
            returnKeyType={'next'}
            onChangeText={name => handleChange({key: 'name', value: name})}
            value={name}
            onSubmitEditing={() => {
              nameInput?.current?.focus();
            }}
          />
        </View>
        <View style={styles.block}>
          <TextInputCom
            title={'Description'}
            from={'Name'}
            placeholder={'Describe your product'}
            returnKeyType={'next'}
            onChangeText={description =>
              handleChange({key: 'description', value: description})
            }
            value={description}
            onSubmitEditing={() => {
              descriptionInput?.current?.focus();
            }}
          />
        </View>
        <View style={styles.block}>
          <TextInputCom
            title={'Location'}
            from={'Name'}
            placeholder={'Location of product'}
            returnKeyType={'next'}
            onChangeText={location =>
              handleChange({key: 'location', value: location})
            }
            value={location}
            onSubmitEditing={() => {
              descriptionInput?.current?.focus();
            }}
          />
        </View>
        <View style={styles.addPhotoBlock}>
          <View slyle={styles.addPhotoCarousel}>
            <Carousel />
          </View>
          <TouchableOpacity
            style={styles.addPhoto}
            onPressOut={() => [actionSheetRef.current?.show()]}>
            <MaterialIcons
              name={'add-photo-alternate'}
              size={35}
              color={colors.statusBar}
            />
            <Text style={styles.addPhotoText}>Add photo</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.apply} onPress={apply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast
        ref={errorToastRef}
        position={'center'}
        positionValue={150}
        style={styles.errorText}
        textStyle={{color: colors.white}}
      />

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
                color: colors.darkslategray,
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
        tintColor={colors.black}
        styles={{
          titleText: styles.actionTitleText,
          // buttonText: styles.buttonTextStyle,
          cancelButtonBox: styles.cancelButtonStyle,
        }}
      />
    </View>
  );
};

export default ProductAdd;

const styles = StyleSheet.create({
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
    fontSize: 16,
    paddingHorizontal: 15,
    marginHorizontal: 8,
    marginTop: 10,
    height: 20,
    color: '#4F4F4F',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontFamily: 'Montserrat-Medium',
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
  addPhotoBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 150,
  },
  addPhotoCarousel: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // height: 100,
    // flex: 1,
  },
  addPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: colors.darkGray,
  },
  apply: {
    backgroundColor: colors.statusBar,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 50,
    margin: 10,
    bottom: 10,
  },
  applyText: {
    color: colors.white,
  },
  errorText: {
    backgroundColor: colors.red,
  },
});