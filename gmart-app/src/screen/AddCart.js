import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react'
import TopnavBar from '../components/TopnavBar'
import { windowWidth } from '../utils/deviceInfo'
import { colors } from '../constants/colors'
import RazorpayCheckout from 'react-native-razorpay';

const AddCart = ({ navigation }) => {

  const [state, setState] = useState({
    cardNumber: '',
    name: '',
    expiresDates: '',
    cvv: '',
  })

  const handlePayment = () => {
    const options = {
      description: 'Payment for Your Product',
      image: 'https://your-image-url.com/logo.png',
      currency: 'INR',
      key: 'rzp_test_S3W3vHWJfZcOEn',
      amount: '100', // Amount in paise (100 paise = 1 INR)
      name: 'Your Company Name',
      prefill: {
        email: 'customer@example.com',
        contact: '9876543210',
        name: 'Customer Name',
      },
      theme: { color: '#3399cc' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // Handle success
        console.log(`Payment success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // Handle error
        console.log(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <View style={styles.container}>
      <TopnavBar title={'Add Cart'} from={'back'} />
      <ScrollView>
        <View style={styles.medalContaint}>
        </View>
        <Button title="Pay Now" onPress={() => handlePayment()} />
      </ScrollView>
      <View style={styles.bottonContaint}>
        <TouchableOpacity onPress={() => navigation.navigate('OrderDetails')} style={[styles.buttonStyle]}>
          <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>Continue to payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddCart

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  medalContaint: {
    backgroundColor: "#fff",
    width: windowWidth,
    paddingVertical: 15,
    marginTop: 15
  },
  bottonContaint: {
    backgroundColor: "#fff",
    paddingVertical: 15
  },
  buttonStyle: {
    width: windowWidth - 120,
    height: 42,
    paddingHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  }
})