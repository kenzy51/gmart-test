import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
import TopnavBar from '../components/TopnavBar'
import { windowWidth } from '../utils/deviceInfo'
import TextInputCom from '../components/TextInputCom'
import { colors } from '../constants/colors'
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { isAndroid } from '../utils/deviceInfo'
import { PERMISSIONS, request } from 'react-native-permissions';

const AddProduct = ({ navigation, route }) => {

  const actionSheetRef = useRef();
  const screenName = route?.params.screenName
  const [index, setIndex] = useState()
  const [imagePickerData, setImagePickerData] = useState([
    {},
    {},
  ])

  const [state, setState] = useState({
    productName: '',
    categoryProduct: '',
    price: '',
    offerPrice: '',
    locationDetails: '',
    productDescription: '',
    priceType: '',
    additionalDetails: '',
  })

  const handleActionButtonPress = (selectedIndex) => {
    if (selectedIndex === 0) openCamera()
    else if (selectedIndex === 1) openGallery()
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
          }).then(image => {
            console.log("image", image)
            const data = [...imagePickerData]
            console.log("data", data)
            data[index] = image
            setImagePickerData(data)
          })
        } else {
          console.log("error")
        }
      })
      .catch((error) => console.log(error))
  }

  const openGallery = () => {
    const permission = isAndroid ? (Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) : PERMISSIONS.IOS.PHOTO_LIBRARY
    request(permission)
      .then((result) => {
        if (result === 'granted') {
          console.log("ok")
          ImagePicker.openPicker({
            width: 200,
            height: 200,
            multiple: true,
            mediaType: 'photo',
            maxFiles: 8
          }).then(images => {
            const data = [...imagePickerData]
            data[index] = images[0]
            setImagePickerData(data)
          })
            .catch((err) => console.log(err))
        } else {
          console.log("error")
        }
      })
      .catch((error) => console.log(error))
  }


  return (
    <View style={styles.container}>
      <TopnavBar from={'back'} title={screenName} />
      <ScrollView>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          {
            imagePickerData.map((item, index) => {
              return (
                <TouchableOpacity onPress={() => [actionSheetRef.current?.show(), setIndex(index)]} style={styles.imageContaint} key={index}>
                  {
                    imagePickerData[index]?.path == null ?
                      null
                      :
                      <Image style={{ width: windowWidth * 0.41, height: 150, borderRadius: 10 }} source={{ uri: imagePickerData[index].path }} />
                  }
                </TouchableOpacity>
              )
            })
          }
        </View>
        <Text style={{ color: "#4F4F4F", marginHorizontal: 30, fontFamily: "Montserrat-Regular", fontSize: 18 }}>Max. 4 photos per product</Text>

        <View style={styles.medalContaint}>

          <TextInputCom title={"Product Name"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Brocolli"}
            returnKeyType={'next'}
            onChangeText={productName => setState({ ...state, productName })}
            value={state.productName}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Category Product"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Vegetables"}
            returnKeyType={'next'}
            onChangeText={categoryProduct => setState({ ...state, categoryProduct })}
            value={state.categoryProduct}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <View style={{ flexDirection: "row" }}>
            <TextInputCom title={"Price"}
              from={"Price"}
              inputRef={(e) => { nameInput = e; }}
              placeholder={"$   30"}
              returnKeyType={'next'}
              onChangeText={price => setState({ ...state, price })}
              value={state.price}
              onSubmitEditing={() => { emailInput.focus(); }}
            />
            <TextInputCom title={"Offer Price"}
              from={"Price"}
              inputRef={(e) => { nameInput = e; }}
              placeholder={"$   15"}
              returnKeyType={'next'}
              onChangeText={offerPrice => setState({ ...state, offerPrice })}
              value={state.offerPrice}
              onSubmitEditing={() => { emailInput.focus(); }}
            />
          </View>
          <TextInputCom title={"Location Details"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Kualalumpur,Malaysia"}
            returnKeyType={'next'}
            onChangeText={locationDetails => setState({ ...state, locationDetails })}
            value={state.locationDetails}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Product Description"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus placerat sit fringilla at facilisis. Quam vivamus non orci elit platea id sed est."}
            returnKeyType={'next'}
            onChangeText={productDescription => setState({ ...state, productDescription })}
            value={state.productDescription}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Price Type"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Fixed"}
            returnKeyType={'next'}
            onChangeText={priceType => setState({ ...state, priceType })}
            value={state.priceType}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Additional Details"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Cash on delivery"}
            returnKeyType={'next'}
            onChangeText={additionalDetails => setState({ ...state, additionalDetails })}
            value={state.additionalDetails}
            onSubmitEditing={() => { emailInput.focus(); }}
          />

          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.buttonStyle]}>
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>{screenName}</Text>
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
    </View>
  )
}

export default AddProduct

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageContaint: {
    marginVertical: 30,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4F4F4F',
    width: windowWidth * 0.41,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 15

  },
  medalContaint: {
    backgroundColor: "#fff",
    width: windowWidth,
    paddingVertical: 15,
    marginTop: 15
  },
  buttonStyle: {
    width: windowWidth - 80,
    height: 40,
    backgroundColor: colors.statusBar,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  }
})