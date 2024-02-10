import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import TopnavBar from '../components/TopnavBar'
import { windowWidth } from '../utils/deviceInfo'
import { colors } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../utils/api';
import { useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import Spinner from '../components/Spinner';
import config from '../../config';

const razorPayUrl = config.razorPay.accessKeyId
const PaymentOptions = ({ navigation, route }) => {

  const [radioButtons, setRadioButtons] = useState([
    { id: '0', label: 'Card, Upi & More', },
    { id: '1', label: 'Cash on Delivery', },
  ])
  const { user, tempUserId } = useSelector(state => state.app)
  const [selectedOption, setSelectedOption] = useState();
  const [cart, setCart] = useState()
  const [loading, setLoading] = useState(true)
  const [disabledButton, setDisabledButton] = useState(false)
  const addressId = route?.params?.addressId
  const deliveryCharge = cart?.deliveryCharge ? parseFloat(cart?.deliveryCharge) : 0
  const freeOrderDeliveryLimit = cart?.freeOrderDeliveryLimit ? parseFloat(cart?.freeOrderDeliveryLimit) : 0


  useEffect(() => {
    const userId = user._id == null ? tempUserId : user._id
    Api.getCart({ userId }, async (err, result) => {
      if (result && result?.data && result.data.cart) {
        setCart(result.data.cart)
      }
      setLoading(false)
    })
  }, [])

  const handleSelectOption = async (addressId) => {
    console.log('addressId', addressId)
    await AsyncStorage.setItem('addressId', addressId)
    setSelectedOption(addressId)
  };
  useEffect(() => {
    if (!selectedOption && radioButtons && radioButtons.length > 0) {
      setSelectedOption(radioButtons[0]?.id)
    }
  }, [radioButtons])

  const getCartData = () => {
    var payableAmount = 0, totalDiscount = 0, subTotal = 0
    cart?.products?.map(({ productId, quantity }) => {
      const price = productId?.price
      const specialPrice = productId?.specialPrice
      payableAmount = payableAmount + (price > 0 ? (price * quantity) : 0)
      totalDiscount = totalDiscount + (specialPrice > productId.price ? 0 : (productId.price - (specialPrice > 0 ? specialPrice : 0)) * quantity)
      subTotal = subTotal + (specialPrice * quantity > 0 ? specialPrice * quantity : 0)
    })
    return { payableAmount, totalDiscount, subTotal }
  }

  const { payableAmount, totalDiscount, subTotal } = getCartData()
  const total = subTotal > freeOrderDeliveryLimit ? payableAmount - totalDiscount : ((payableAmount + deliveryCharge) - totalDiscount)

  const handlePayment = () => {
    if (selectedOption == 0) {
      Api.createRazorPayOrder((err, result) => {
        const amount = result?.data?.data?.amount
        const orderId = result?.data?.data?.orderId
        var options = {
          description: 'Credits towards consultation',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: razorPayUrl,
          // amount: total,
          amount: amount,
          name: 'jay',
          order_id: orderId,
          theme: { color: colors.statusBar }
        }

        RazorpayCheckout.open(options)
          .then((data) => {
            if (data.razorpay_payment_id) {
              console.log("datatata", data)
              setDisabledButton(true)
              Api.placeOrder({
                paymentType: 'razorPay',
                addressId: addressId,
                paymentId: data.razorpay_payment_id,
                paymentOrderId: data.razorpay_order_id,
                paymentSignature: data.razorpay_signature
              }, (err, result) => {
                if (result) navigation.navigate('OrderSuccess')
              })
            }
            console.log(`5555s: ${data.razorpay_payment_id}`);
          })
          .catch((error) => {
            // Handle error
            console.log(`Error: ${error.code} | ${error.description}`);
          });
      })
    } else {
      Api.placeOrder({
        paymentType: 'cod',
        addressId: addressId,
      }, (err, result) => {
        if (result) navigation.navigate('OrderSuccess')
      })
    }
  }

  return (
    <View style={styles.container}>
      <TopnavBar title={'Payment Option'} from={'back'} />
      {loading ?
        <Spinner /> :
        <>
          <ScrollView contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1 }}>
            <View>
              {
                radioButtons.map((item, index) => {
                  return (
                    <TouchableOpacity key={index} activeOpacity={.7} onPress={() => handleSelectOption(item.id)} style={[styles.addAddress,]}>
                      <View style={{ flexDirection: "row" }} >
                        <View style={styles.radioButton} >
                          {selectedOption === item.id && <View style={styles.innerCircle} />}
                        </View>
                        <View>
                          <Text style={styles.nameText}>{item.label}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                  )
                })
              }
            </View>

            <View>
              <View style={styles.priceDetails}>
                <Text style={{ color: "#000", fontSize: 16, marginRight: 10, fontFamily: "Montserrat-SemiBold", marginBottom: 20 }}>Price Details</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#000", fontSize: 16, marginRight: 10, fontFamily: "Montserrat-Regular", marginBottom: 5 }}>Price ( 1 item)</Text>
                  <Text style={{ color: "#000", fontSize: 16, marginRight: 10, marginBottom: 5, fontFamily: "Montserrat-Regular" }}>₹{payableAmount}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#000", fontSize: 16, marginRight: 10, fontFamily: "Montserrat-Regular", marginBottom: 5 }}>Delivery Fee</Text>
                  <Text style={{ color: "#000", fontSize: 16, marginRight: 10, marginBottom: 5, fontFamily: "Montserrat-Regular" }}>{subTotal > freeOrderDeliveryLimit ? 0 : deliveryCharge}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#000", fontSize: 16, marginRight: 10, fontFamily: "Montserrat-Regular", marginBottom: 5 }}>TotalDiscount</Text>
                  <Text style={{ color: "#000", fontSize: 16, marginRight: 10, marginBottom: 5, fontFamily: "Montserrat-Regular" }}>- ₹{totalDiscount}</Text>
                </View>
              </View>
              <View style={[styles.removeStore, { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 15 }]}>
                <Text style={{ color: "#000", fontSize: 16, marginRight: 10, marginBottom: 5, fontFamily: "Montserrat-SemiBold" }}>Total Amount</Text>
                <Text style={{ color: "#000", fontSize: 16, marginRight: 10, marginBottom: 5, fontFamily: "Montserrat-SemiBold" }}>₹{total}</Text>
              </View>

            </View>

          </ScrollView>

          <View style={styles.bottonContaint}>
            <TouchableOpacity activeOpacity={.8} disabled={disabledButton} onPress={() => handlePayment()} style={[styles.buttonStyle, { backgroundColor: !disabledButton ? colors.statusBar : 'grey', }]}>
              <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      }
    </View>
  )
}

export default PaymentOptions

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addPayment: {
    backgroundColor: "#fff",

  },
  radioButtonsStyle: {
    backgroundColor: "#fff",

  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 4
  },

  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  nameText: {
    color: "#000",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
  },
  imageContaint: {
    marginVertical: 30,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4F4F4F',
    width: windowWidth * 0.8,
    marginHorizontal: 10,
    borderRadius: 15,
    alignSelf: "center",
    paddingVertical: 40

  },
  addAddress: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  radioButtonsStyle: {
    backgroundColor: "#fff",
  },
  delivetyContaint: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "center"
  },
  seeallStyle: {
    height: 25,
    backgroundColor: colors.statusBar,
    paddingHorizontal: 30,
    justifyContent: "center",
    borderRadius: 15,
    marginHorizontal: 10,
    alignItems: "center",
  },
  priceDetails: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  removeStore: {
    borderTopColor: "grey",
    borderTopWidth: 0.5,
    backgroundColor: "#fff",
    marginBottom: 10
  },
  bottonContaint: {
    backgroundColor: "#fff",
    paddingVertical: 15
  },
  buttonStyle: {
    width: windowWidth - 120,
    height: 42,
    paddingHorizontal: 20,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  }
})