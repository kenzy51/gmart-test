import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import { windowWidth } from '../../utils/deviceInfo'
import { colors } from '../../constants/colors'
import PhoneInput from "react-native-phone-number-input";

const PhoneNumber = ({ navigation }) => {

  const [state, setState] = useState({
    mobile: '',
  })
  const phoneInput = useRef()
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  return (
    <View style={styles.conatiner}>
      <View style={{ paddingTop: 120 }}>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 20, fontFamily: "Montserrat-SemiBold", marginBottom: 30 }}>Verify your phone number</Text>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 2, fontFamily: "Montserrat-Regular" }}>We have sent you an SMS with a code to</Text>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 60, fontFamily: "Montserrat-Regular" }}>enter number</Text>
      </View>
      <PhoneInput
        containerStyle={styles.containerStyle}
        textContainerStyle={styles.textContainerStyle}
        textInputStyle={{ color: "#fff" }}
        codeTextStyle={{ color: "#fff" }}
        ref={phoneInput}
        defaultValue={value}
        defaultCode="IN"
        layout="first"
        onChangeText={(text) => {
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
        }}
        withDarkTheme
        autoFocus
      />
      <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 0, marginTop: 60, fontFamily: "Montserrat-Regular" }}>Or login with Social network</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Otp')} style={[styles.buttonStyle]}>
        <Text style={{ color: colors.statusBar, fontSize: 16, fontFamily: "Montserrat-SemiBold", }}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PhoneNumber

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.statusBar
  },
  containerStyle: {
    backgroundColor: colors.statusBar,
    width: windowWidth * 0.85,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 40,
    alignSelf: "center",
    paddingLeft: 10,
  },
  textContainerStyle: {
    backgroundColor: colors.statusBar,
    borderRightColor: "#fff",
    borderRightWidth: 0.1,
    borderRadius: 40,
    alignSelf: "center",
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