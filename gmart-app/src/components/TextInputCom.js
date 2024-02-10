import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, forwardRef } from 'react'
import { windowWidth } from '../utils/deviceInfo';

const TextInputCom = forwardRef(({ title, style, value, type, placeholder, from, ...inputProps }, ref) => {

  const [state, setState] = useState({
    focused: false
  })

  handleFocus = () => {
    setState({ focused: true })
  }

  handleBlur = () => {
    setState({ focused: false })
  }
  const { focused } = state

  return (
    <View style={[type == "login" ? null : styles.container]}>
      {from == 'Name' || from == 'Price' ? <Text style={[styles.titleStyle]}>{title}</Text> : null}
      <View>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          underlineColorAndroid='transparent'
          value={value}
          onBlur={() => handleBlur()}
          onFocus={() => handleFocus()}
          style={[from == 'Name' ? styles.input : (from == 'Price' ? styles.secoundInput : styles.ThirdInput), style]}
          placeholder={placeholder}
          placeholderTextColor={from == 'Name' || from == 'Price' ? "#D8D8DF" : "#fff"}
          selectionColor={from == 'Login' ? '#fff' : "#000"}
          ref={ref}
          {...inputProps}
        />
      </View>
    </View>
  )
})

export default TextInputCom

const inputCom = {
  fontSize: 16,
  paddingHorizontal: 15,
  marginHorizontal: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#E7E7E7"
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6
  },
  titleStyle: {
    color: "grey",
    marginHorizontal: 20,
    fontSize: 14,
    marginBottom: 0,
    fontFamily: "Montserrat-Regular"
  },
  input: {
    ...inputCom,
    height: 45,
    color: "#4F4F4F",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontFamily: "Montserrat-Medium"

  },
  secoundInput: {
    ...inputCom,
    width: windowWidth * 0.46,
    height: 45,
    color: "#000",
    borderRadius: 15,
    backgroundColor: "#fff",
    fontFamily: "Montserrat-Medium"

  },
  ThirdInput: {
    ...inputCom,
    height: 45,
    color: "#fff",
    borderRadius: 15,
    borderColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 30,
    marginVertical: 4,
    marginHorizontal: 30,
    fontFamily: "Montserrat-Medium"
  },

})