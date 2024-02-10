import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { isAndroid } from '../utils/deviceInfo';
import { PERMISSIONS, request } from 'react-native-permissions';
import TextInputCom from '../components/TextInputCom';
import TopnavBar from '../components/TopnavBar';
import { windowWidth } from '../utils/deviceInfo';
import { colors } from '../constants/colors';
import Api from '../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WrongInputWarning from '../components/WrongInputWarning';
import { validateEmail, validateMobile } from '../utils/validation';
import { uploadToS3 } from '../utils/aws';
import Toast  from '../constants/Toast';

const EditProfile = ({ navigation }) => {

  var firstnameInput = useRef(null), lastnameInput = useRef(null), emailInput = useRef(null);
  var phoneInput = useRef(null);
  const dispatch = useDispatch()
  const actionSheetRef = useRef();
  const { user } = useSelector(state => state.app)
  const [gallery, setGallery] = useState(user?.profile?.photo || null)
  const [state, setState] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errorText, setErrorText] = useState(null)
  const [isUploadAvatar, setUploadAvatar] = useState(false)
  const { firstName, lastName, email, phone } = state
  const errorToastRef = useRef(null)
  const toastRef = useRef(null)

  const handleActionButtonPress = (selectedIndex) => {
    if (selectedIndex === 0) openCamera()
    else if (selectedIndex === 1) openGallery()
  }

  const valid = () => {
    if (firstName.trim() === '') {
      setErrorText('Please enter name')
      firstnameInput?.current?.focus()
      return false
    }
    if (lastName.trim() === '') {
      setErrorText('Please enter address')
      lastnameInput?.current?.focus()
      return false
    }
    if (!validateEmail(email)) {
      setErrorText(email.trim() === '' ? 'Please enter an email' : 'Enter a valid email address')
      emailInput?.current?.focus()
      return false
    }

    if (!validateMobile(phone)) {
      setErrorText(phone.trim() === '' ? 'Please enter an phone number' : 'Enter a valid phone number')
      phoneInput?.current?.focus()
      return false
    }
    return true
  }

  const editHandler = async () => {
    if (valid()) {
      const token = await AsyncStorage.getItem('token');
      Api.editUser(state, (err, result) => {
        Api.getUserDetail(async (err, result) => {
          if (result && result?.data && result?.data?.user) {
            dispatch({ type: 'authUser', data: { user: { ...result.data?.user, token } } } || [])
            setErrorText(null)
          }
        })
        navigation.goBack()
      })
    }
  }

  const openCamera = () => {
    const permission = isAndroid ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
    request(permission)
      .then((result) => {
        if (result === 'granted') {
          ImagePicker.openCamera({
            width: 200,
            height: 200,
            cropping: true,
            mediaType: 'photo'
          }).then(async image => {
            await handleImageUpload(image)
          })
        } 
      })
      .catch((error) => console.log(error))
  }

  const openGallery = () => {
    const permission = isAndroid ? (Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) : PERMISSIONS.IOS.PHOTO_LIBRARY
    request(permission)
      .then((result) => {
        if (result === 'granted') {
          ImagePicker.openPicker({
            width: 200,
            height: 200,
            multiple: true,
            mediaType: 'photo',
            maxFiles: 8
          }).then(async images => {
            await handleImageUpload(images[0])
          })
          .catch((err) => console.log(err))
        } 
      })
      .catch((error) => console.log(error))
  }

  const handleImageUpload = async (response) => {
    setUploadAvatar(true)
    try {
      if(response && response.path) {
        if(response.size && response.size <= 1048576) {
          let url = await uploadToS3(response.path, getFileExtension(response.path), response.width, response.height, response.size);
          if(url) {
            setGallery(response.path)
            Api.editUser({ photo: url }, (err, result) => {
              if(result?.data?.success) {
                Api.getUserDetail(async (err, result) => {
                  if (result && result?.data && result?.data?.user) {
                    const token = await AsyncStorage.getItem('token');
                    dispatch({ type: 'authUser', data: { user: { ...result.data?.user, token } } } || [])
                    setErrorText(null)
                  }
                })
                toastRef?.current?.show('photo updated successfully');
              }
            })
          } else {
            errorToastRef?.current?.show('Unable to update photo');
          }
        } else {
          errorToastRef?.current?.show('Please upload photo, with size equal to or less than 1MB');
        }
      } else {
        errorToastRef?.current?.show('Please choose a valid photo');
      }
    } catch (e) {
      this.refs.errorToast.show('Unable to update photo');
    }
    setUploadAvatar(false)
  }

  const getFileExtension = (filename) => {
    if (filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }
    return "";
  }

  const handleChange = ({ key, value }) => {
    setState((prevAddress) => ({
      ...prevAddress,
      [key]: value,
    }));
  }

  return (
    <View style={styles.container}>
      <TopnavBar title={'Edit Profile'} />
      <ScrollView>
        <TouchableOpacity activeOpacity={.7} onPress={() => [actionSheetRef.current?.show()]} style={styles.imageStyle} disabled={isUploadAvatar}>
          {gallery == null ?
            <Text style={{ color: "#000", fontSize: 16 }}>Add Photo</Text> :
            <Image style={{ width: 150, height: 150, borderRadius: 100 }} source={{ uri: gallery }} />
          }
        </TouchableOpacity>

        {errorText && (
          <WrongInputWarning warningText={errorText} style={{ marginTop: 15, marginBottom: 15 }} />
        )}

        <View style={{ flexDirection: 'row' }}>
          <TextInputCom title={"FirstName"}
            from={"Price"}
            ref={firstnameInput}
            placeholder={"Firstname"}
            style={styles.textInput}
            returnKeyType={'next'}
            onChangeText={firstName => handleChange({ key: 'firstName', value: firstName })}
            value={firstName}
            onSubmitEditing={() => { lastnameInput?.current?.focus(); }}
          />
          <TextInputCom title={"LastName"}
            from={"Price"}
            ref={lastnameInput}
            placeholder={"Lastname"}
            style={styles.textInput}
            returnKeyType={'next'}
            onChangeText={lastName => handleChange({ key: 'lastName', value: lastName })}
            value={lastName}
            onSubmitEditing={() => { emailInput?.current?.focus(); }}
          />
        </View>
        <TextInputCom title={"Email"}
          from={"Name"}
          ref={emailInput}
          placeholder={"Enter you Email address"}
          returnKeyType={'next'}
          onChangeText={email => handleChange({ key: 'email', value: email })}
          value={email}
          onSubmitEditing={() => { phoneInput?.current?.focus(); }}
        />
        <TextInputCom title={"Phone No"}
          from={"Name"}
          ref={phoneInput}
          keyboardType='numeric'
          placeholder={"Enter your phone number"}
          returnKeyType={'next'}
          onChangeText={phone => handleChange({ key: 'phone', value: phone })}
          value={phone}
          onSubmitEditing={() => { editHandler() }}
        />

        <View style={styles.priceSections}>
          <TouchableOpacity activeOpacity={.8} onPress={() => editHandler()} style={[styles.buttonStyle]}>
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
      <Toast
        ref={errorToastRef}
        position={'center'}
        positionValue={150}
        style={{ backgroundColor: colors.red }}
        textStyle={{ color: colors.white }}
      />
      <Toast
        ref={toastRef}
        position={'center'}
        positionValue={150}
      />
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
  buttonStyle: {
    width: windowWidth - 60,
    height: 40,
    backgroundColor: colors.statusBar,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
})