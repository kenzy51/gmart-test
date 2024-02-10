import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { windowWidth } from '../../utils/deviceInfo'
import { colors } from '../../constants/colors'
import OTPInputView from '@twotalltotems/react-native-otp-input'

const Otp = ({ navigation }) => {
  return (
    <View style={styles.conatiner}>
      <View style={{ paddingTop: 120 }}>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 20, fontFamily: "Montserrat-SemiBold", marginBottom: 30 }}>Phone Verification</Text>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 80, fontFamily: "Montserrat-Regular" }}>Enter your OTP code here</Text>
      </View>
      <OTPInputView
        style={{ width: windowWidth - 60, height: 50, alignSelf: "center", marginBottom: 60, borderRadius: 10 }}
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={{ borderRadius: 10 }}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code => {
          console.log(`Code is ${code}, you are good to go!`)
        })}
      />

      <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 0, marginTop: 4, fontFamily: "Montserrat-Regular" }}>Didn’t you received any code? </Text>
      <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 40, fontFamily: "Montserrat-Regular" }}>Resent new code</Text>

      <TouchableOpacity onPress={() => [navigation.navigate('Tab', { screen: "TabNavigation", params: { screen: 'TabNavigation' } })]} style={[styles.buttonStyle]}>
        <Text style={{ color: colors.statusBar, fontSize: 16, fontFamily: "Montserrat-SemiBold", }}>Verify</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Otp

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.statusBar
  },
  buttonStyle: {
    width: windowWidth - 150,
    height: 40,
    backgroundColor: '#fff',
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30
  }
})