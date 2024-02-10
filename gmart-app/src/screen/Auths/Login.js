import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import React, { useState, useRef } from 'react'
import { colors } from '../../constants/colors'
import TextInputCom from '../../components/TextInputCom'
import { windowWidth } from '../../utils/deviceInfo'
import Api from '../../utils/api'
import { useDispatch } from 'react-redux'
import { setTempUserId, getUserAddresses, getCart } from '../../components/redux/actions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../../utils/validation'
import WrongInputWarning from '../../components/WrongInputWarning'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

const Login = ({ navigation }) => {
  const [state, setState] = useState({
    email: '',
    password: '',
  })

  const [errorText, setErrorText] = useState(null)
  const [disabled, setDisabled] = useState(false)
  var emailInput = useRef(null), passwordInput = useRef(null);

  const { email, password } = state
  const dispatch = useDispatch()

  const valid = () => {
    if (!validateEmail(email)) {
      const errorText = email.trim() === '' ? 'Please enter an email' : 'Enter a valid email address'
      setErrorText(errorText)
      emailInput?.current?.focus()
      return false
    }
    if (password.trim() === '') {
      setErrorText('Please enter password')
      passwordInput?.current?.focus()
      return false
    }
    return true
  }

  const submit = async () => {
    if (valid()) {
      setDisabled(true);
      Keyboard.dismiss();

      const tempUserId = await AsyncStorage.getItem('tempUserId');
      const args = {
        email,
        password
      }
      if (tempUserId) args['userId'] = tempUserId

      Api.authUser(args, async (err, result) => {
        if (result && result?.data.data && result?.data?.data?.token) {
          const userToken = result?.data?.data?.token
          await AsyncStorage.setItem('token', userToken);
          await AsyncStorage.removeItem('tempUserId');
          dispatch(setTempUserId(null))
          dispatch({ type: 'authUser', data: { user: result.data?.data } })
          dispatch(getUserAddresses())
          dispatch(getCart(result?.data?.data?._id))
          setErrorText(null)
          navigation.navigate('Home')
        } else {
          setErrorText(err && err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Unable to login into app..please try again')
        }
        setDisabled(false);
      })
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 120 }} keyboardShouldPersistTaps={'always'}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0, paddingVertical: 10, paddingHorizontal: 10 }}>
          <MaterialIcons name={"arrow-back"} size={25} color={"#fff"} />
        </TouchableOpacity>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 20, fontFamily: "Montserrat-SemiBold", marginBottom: 60 }}>Welcome to GMart</Text>
        <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 60, fontFamily: "Montserrat-Medium" }}>Login to your account</Text>
        {errorText && (
          <WrongInputWarning warningText={errorText} />
        )}

        <TextInputCom title={""}
          ref={emailInput}
          from={"Login"}
          placeholder={"Email"}
          returnKeyType={'next'}
          onChangeText={email => setState({ ...state, email })}
          value={email}
          onSubmitEditing={() => { passwordInput?.current?.focus(); }}
        />
        <TextInputCom title={""}
          ref={passwordInput}
          from={"Login"}
          placeholder={"Password"}
          returnKeyType={'next'}
          onChangeText={password => setState({ ...state, password })}
          value={password}
          secureTextEntry
          onSubmitEditing={() => { submit() }}
        />

        <TouchableOpacity onPress={() => submit()} style={[styles.buttonStyle]} disabled={disabled}>
          <Text style={{ color: colors.statusBar, fontSize: 16, fontFamily: "Montserrat-SemiBold", }}>Login</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text style={{ alignSelf: "center", color: "#fff", fontSize: 15, marginBottom: 60, marginRight: 7, fontFamily: "Montserrat-Regular" }}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ alignSelf: "center", color: "#fff", fontSize: 17, fontFamily: "Montserrat-SemiBold", marginBottom: 60 }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View>

      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.statusBar,
  },
  buttonStyle: {
    width: windowWidth - 150,
    height: 40,
    backgroundColor: '#fff',
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30
  }
})