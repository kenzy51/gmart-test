import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { windowWidth } from '../utils/deviceInfo'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { colors } from '../constants/colors';
import Api from '../utils/api';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlistProducts } from '../components/redux/actions';
import Share from 'react-native-share';
import WebView from 'react-native-webview';
import Toast, { DURATION } from '../constants/Toast';
const ProductDetails = ({ navigation, route }) => {

  const productId = route?.params?.productId
  const [product, setProduct] = useState()
  const [activeSlide, setActiveSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user, tempUserId, wishListProduct, cart } = useSelector(state => state.app)
  const discount = product && product.price && product.price > product.specialPrice ? Math.round(100 - ((100 * product.specialPrice) / product.price)) : ''
  const dispatch = useDispatch()
  const errorToastRef = useRef(null)

  useEffect(() => {
    const productDetails = () => {
      Api.getProductDetails(productId, async (err, result) => {
        if (result && result?.data && result?.data?.product) {
          setProduct(result?.data?.product)
        }
        setLoading(false)
      })
    }
    productDetails()
  }, [])

  const showToast = (massage) => {
    errorToastRef.current.show(massage, DURATION.LENGTH_SHORT, () => {
    });
  };

  const addCartHandler = async () => {
    const userId = !user?._id ? tempUserId : user._id
    const product = cart?.products.find(product => product?.productId?._id === productId)
    const quantity = product && product.quantity && product.quantity > 0 ? product.quantity + 1 : 1
    Api.updateCart(userId, { productId, quantity }, async (err, result) => {
      if (result && result.data && result.data.success) {
        navigation.navigate('Carts')
      } else {
        showToast(err?.response?.data?.error || 'An error occurred');
      }
    })
  }

  const shareHandler = () => {
    const options = {
      message: product?.name || "Product"
    }
    Share.open(options)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const addWishListHandler = () => {
    if (user && user.token) {
      Api.wishlistProduct({ productId }, (err, result) => {
        dispatch(getWishlistProducts())
      })
    } else {
      navigation?.navigate('Account', { screen: 'Login' })
    }
  }

  const getWishlistIcon = () => {
    return wishListProduct.find((item) => item._id == productId) ? 'heart' : 'hearto'
  }
  return (
    <View style={styles.container}>
      {loading ?
        <Spinner /> :
        <>
          <View style={styles.startWrapper}>
            <Carousel
              data={product?.photos}
              sliderWidth={windowWidth}
              itemWidth={windowWidth}
              loop={true}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              onSnapToItem={(index) => setActiveSlide(index)}
              renderItem={({ item }) => {
                return (
                  <FastImage source={{ uri: item, priority: FastImage.priority.high, }} style={styles.slideImage}>
                    <View style={styles.topContaint}>
                      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconStyle}>
                        <MaterialIcons name={"arrow-back"} size={22} color={"#000"} />
                      </TouchableOpacity>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => shareHandler()} activeOpacity={.6} style={[styles.backIconStyle, { marginHorizontal: 6 }]}>
                          <Entypo name={"share"} size={18} color={"#000"} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.6} onPress={() => addWishListHandler()} style={[styles.backIconStyle, { marginHorizontal: 6 }]}>
                          <AntDesign name={getWishlistIcon()} size={18} color={"#000"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </FastImage>
                )
              }}
            />
            <Pagination
              dotsLength={product?.photos?.length}
              activeDotIndex={activeSlide}
              dotColor={colors.statusBar}
              inactiveDotColor={"#fff"}
              inactiveDotOpacity={1}
              containerStyle={styles.sliderContainerStyle}
              dotContainerStyle={{ marginHorizontal: 3 }}
              dotStyle={styles.dotStyle}
              inactiveDotScale={1}
            />
          </View >

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.priceSections}>
              <Text style={{ fontSize: 22, fontFamily: "Montserrat-Bold", color: "#4F4F4F" }}>{product?.name}</Text>
              <View style={{ flexDirection: "row", marginVertical: 13, alignItems: "center" }}>
                <Text style={{ color: colors.statusBar, fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>₹{product?.specialPrice}</Text>
                {product?.specialPrice < product?.price && <Text style={{ marginLeft: 10, color: colors.statusBar, fontFamily: 'Montserrat-SemiBold', textDecorationLine: 'line-through' }}>₹{product?.price}</Text>}
                <Text style={{ marginLeft: 15 }}>- {discount}%</Text>
              </View>
            </View>

            <View style={styles.innerWrapper}>
              <WebView style={{ height: 180, }}
                source={{
                  html: `
                        <html>
                          <head>
                          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                            <style>
                              body {
                                margin: 15px;
                                font-size: 14px;
                                font-family: 'Montserrat-SemiBold';
                                color:#fff;
                                background-color:#fff;
                              }
                            </style>
                          </head>
                          <body>
                          ${product?.description} <!-- Your HTML content goes here -->
                          </body>
                        </html>

          ` }}
                androidHardwareAccelerationDisabled={true}
                originWhitelist={['*']}
              />
            </View>
            {/*
            <View style={styles.innerWrapper}>
              <Text>{product?.description}</Text>
            </View> */}


            <View style={styles.priceSections}>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <Text style={{ color: "#4F4F4F", fontSize: 14, marginHorizontal: 20, marginRight: 80, fontFamily: "Montserrat-Medium" }}>Condition</Text>
                <Text style={{ color: "#4F4F4F", fontSize: 14, fontFamily: "Montserrat-Medium" }}>organic</Text>
              </View>
              {/* <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <Text style={{ color: "#4F4F4F", fontSize: 14, marginHorizontal: 20, marginRight: 80, fontFamily: "Montserrat-Medium" }}>Price Type</Text>
                <Text style={{ color: "#4F4F4F", fontSize: 14, fontFamily: "Montserrat-Medium", }}>{product?.priceType}</Text>
              </View> */}
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <Text style={{ color: "#4F4F4F", fontSize: 14, marginHorizontal: 20, marginRight: 80, fontFamily: "Montserrat-Medium" }}>Categories</Text>
                {product?.categories.map((item, index) => (
                  <Text key={index} style={{ color: "#4F4F4F", fontSize: 14, fontFamily: "Montserrat-Medium" }}>{item?.name}</Text>
                ))
                }
              </View>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <Text style={{ color: "#4F4F4F", fontSize: 14, marginHorizontal: 20, marginRight: 80, fontFamily: "Montserrat-Medium" }}>Location</Text>
                <Text style={{ color: "#4F4F4F", fontSize: 14, fontFamily: "Montserrat-Medium" }}>{product?.location}</Text>
              </View>
            </View>

            <View style={styles.priceSections}>
              <Text style={{ color: "#000", fontSize: 20, fontFamily: "Montserrat-Bold", marginHorizontal: 15 }}>Additional Details</Text>
              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <Text style={{ color: "#4F4F4F", fontSize: 14, marginHorizontal: 15, marginRight: 50, fontFamily: "Montserrat-Medium" }}>Delivery Options</Text>
                <View style={{ width: windowWidth * 0.45, }}>
                  {
                    product?.additionalDetails.map((item, index) => (
                      <Text key={index} style={{ color: "#4F4F4F", fontSize: 14, fontFamily: "Montserrat-Medium" }}>{item}</Text>
                    ))
                  }
                </View>
              </View>
            </View>

          </ScrollView>
          <View style={styles.priceSections}>
            <TouchableOpacity activeOpacity={.8} onPress={() => addCartHandler()} style={[styles.buttonStyle]}>
              <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>Add To Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      <Toast
        ref={errorToastRef}
        position={'center'}
        positionValue={150}
        style={styles.errorToast}
        textStyle={styles.errorToastText}
      />
    </View>
  )
}


export default ProductDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: windowWidth,
    height: windowWidth * 0.6
  },
  topContaint: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backIconStyle: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  priceSections: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 5
  },
  innerWrapper: {
    flexGrow: 1,
    flex: 1,
    paddingBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10
  },
  tStyle: {
    backgroundColor: colors.statusBar,
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  seeallStyle: {
    width: 80,
    height: 25,
    backgroundColor: colors.statusBar,
    paddingVertical: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
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
  slideImage: {
    width: windowWidth,
    height: windowWidth * 0.6
  },
  startWrapper: {
    width: windowWidth,
    height: windowWidth * 0.57,
    backgroundColor: "#fff",
  },
  sliderContainerStyle: {
    position: "absolute",
    bottom: -22,
    alignSelf: "center"
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 15
  },
  errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white,
    fontFamily: "Montserrat - SemiBold"
  },
})