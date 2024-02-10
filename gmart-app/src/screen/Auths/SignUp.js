import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import {colors} from '../../constants/colors';
import TextInputCom from '../../components/TextInputCom';
import {windowWidth} from '../../utils/deviceInfo';
import Api from '../../utils/api';
import WrongInputWarning from '../../components/WrongInputWarning';
import {validateEmail} from '../../utils/validation';
import {setTempUserId} from '../../components/redux/actions';

const Signin = ({navigation}) => {
  var firstNameInput = useRef(null),
    lastNameInput = useRef(null),
    emailInput = useRef(null),
    phoneInput = useRef(null),
    passwordInput = useRef(null),
    cPasswordInput = useRef(null);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    repassword: '',
  });
  const {firstName, lastName, email, phone, password, repassword} = state;
  const [errorText, setErrorText] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const valid = () => {
    if (firstName.trim() === '') {
      setErrorText('Please enter firstName');
      firstNameInput?.current?.focus();
      return false;
    }

    if (lastName.trim() === '') {
      setErrorText('Please enter lastName');
      lastNameInput?.current?.focus();
      return false;
    }

    if (!validateEmail(email)) {
      setErrorText(
        email.trim() === ''
          ? 'Please enter an email'
          : 'Enter a valid email address',
      );
      emailInput?.current?.focus();
      return false;
    }

    if (password.trim() === '') {
      setErrorText('Please enter password');
      passwordInput?.current?.focus();
      return false;
    }

    if (password !== repassword) {
      setErrorText('Password and confirm password do not match');
      cPasswordInput?.current?.focus();
      return false;
    }

    return true;
  };

  const createHandler = async () => {
    if (valid()) {
      setDisabled(true);
      Keyboard.dismiss();
      Api.addUser(state, async (err, result) => {
        if (
          result &&
          result?.data &&
          result?.data?.data &&
          result?.data?.data?._id
        ) {
          setErrorText(null);
          await loginAfterSignUp();
        } else {
          setErrorText(
            err && err.response && err.response.data && err.response.data.error
              ? err.response.data.error
              : 'Unable to login into app..please try again',
          );
        }
        setDisabled(false);
      });
    }
  };

  const loginAfterSignUp = async () => {
    const credentials = {
      email: state.email,
      password: state.password,
    };
    const tempUserId = await AsyncStorage.getItem('tempUserId');
    if (tempUserId) credentials['userId'] = tempUserId;

    Api.authUser(credentials, async (err, result) => {
      if (result && result?.data.data && result?.data?.data?.token) {
        const userToken = result?.data?.data?.token;
        await AsyncStorage.setItem('token', userToken);
        await AsyncStorage.removeItem('tempUserId');
        dispatch(setTempUserId(null));
        dispatch({type: 'authUser', data: {user: result.data?.data}});
        setErrorText(null);
        navigation.navigate('Tab', {
          screen: 'Home',
          params: {screen: 'TabNavigation'},
        });
      } else {
        setErrorText(
          err && err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : 'Unable to login into app..please try again',
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingTop: 120}}
        keyboardShouldPersistTaps={'always'}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
          <MaterialIcons name={'arrow-back'} size={25} color={'#fff'} />
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            color: '#fff',
            fontSize: 20,
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 60,
          }}>
          Welcome to GMart
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: '#fff',
            fontSize: 15,
            marginBottom: 20,
          }}>
          Login to your account
        </Text>

        {errorText && <WrongInputWarning warningText={errorText} />}

        <TextInputCom
          title={''}
          from={'Login'}
          ref={firstNameInput}
          placeholder={'First Name'}
          returnKeyType={'next'}
          onChangeText={firstName => setState({...state, firstName})}
          value={firstName}
          onSubmitEditing={() => {
            lastNameInput?.current?.focus();
          }}
        />
        <TextInputCom
          title={''}
          from={'Login'}
          ref={lastNameInput}
          placeholder={'Last Name'}
          returnKeyType={'next'}
          onChangeText={lastName => setState({...state, lastName})}
          value={lastName}
          onSubmitEditing={() => {
            phoneInput?.current?.focus();
          }}
        />
        <TextInputCom
          title={''}
          from={'Login'}
          ref={phoneInput}
          placeholder={'Phone Number'}
          returnKeyType={'next'}
          onChangeText={phone => setState({...state, phone})}
          value={phone}
          onSubmitEditing={() => {
            emailInput?.current?.focus();
          }}
        />
        <TextInputCom
          title={''}
          from={'Login'}
          ref={emailInput}
          placeholder={'Email Address'}
          returnKeyType={'next'}
          onChangeText={email => setState({...state, email})}
          value={email}
          onSubmitEditing={() => {
            passwordInput?.current?.focus();
          }}
        />
        <TextInputCom
          title={''}
          from={'Login'}
          ref={passwordInput}
          placeholder={'Password'}
          returnKeyType={'next'}
          onChangeText={password => setState({...state, password})}
          value={password}
          secureTextEntry
          onSubmitEditing={() => {
            cPasswordInput?.current?.focus();
          }}
        />
        <TextInputCom
          title={''}
          from={'Login'}
          ref={cPasswordInput}
          placeholder={'Re-enter Password'}
          returnKeyType={'next'}
          onChangeText={repassword => setState({...state, repassword})}
          value={repassword}
          secureTextEntry
          onSubmitEditing={() => createHandler()}
        />

        <TouchableOpacity
          onPress={() => createHandler()}
          style={[styles.buttonStyle]}
          disabled={disabled}>
          <Text
            style={{
              color: colors.statusBar,
              fontSize: 16,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Create
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#fff',
              fontSize: 15,
              marginBottom: 60,
              marginRight: 7,
            }}>
            Have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                alignSelf: 'center',
                color: '#fff',
                fontSize: 17,
                fontFamily: 'Montserrat-SemiBold',
                marginBottom: 60,
              }}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.statusBar,
  },
  buttonStyle: {
    width: windowWidth - 150,
    height: 40,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
});
