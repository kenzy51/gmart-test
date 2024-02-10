import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
import TopnavBar from '../components/TopnavBar'
import TextInputCom from '../components/TextInputCom';
import { windowWidth } from '../utils/deviceInfo';
import { colors } from '../constants/colors';
import Api from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddresses } from '../components/redux/actions';
import { useNavigation } from '@react-navigation/native';
import { validateMobile } from '../utils/validation';
import WrongInputWarning from '../components/WrongInputWarning';

const AddAddress = (props) => {

  const { userAddress } = useSelector(state => state.app)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  var nameInpute = useRef(null), mobileInput = useRef(null), addressInput = useRef(null);
  var cityInput = useRef(null), stateInput = useRef(null), zipInput = useRef(null);
  const [errorText, setErrorText] = useState(null)
  const [addAddress, setAddAddress] = useState(
    editAddress = props.route && props.route.params && props.route.params.address ? { ...props.route.params.address } :
      {
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      })

  const { name, phone, address, city, state, zipCode } = addAddress

  const valid = () => {
    if (name.trim() === '') {
      setErrorText('Please enter name')
      nameInpute?.current?.focus()
      return false
    }
    if (!validateMobile(phone)) {
      setErrorText(phone.trim() === '' ? 'Please Enter an Phone Number' : 'Enter a Valid Phone Number')
      mobileInput?.current?.focus()
      return false
    }
    if (address.trim() === '') {
      setErrorText('Please Enter Address')
      addressInput?.current?.focus()
      return false
    }
    if (city.trim() === '') {
      setErrorText('Please Enter City Name')
      cityInput?.current?.focus()
      return false
    }
    if (state.trim() === '') {
      setErrorText('Please Enter State Name')
      stateInput?.current?.focus()
      return false
    }
    if (zipCode.trim() === '') {
      setErrorText('Please Enter Pincode')
      zipInput?.current?.focus()
      return false
    }

    return true
  }

  const addressHandler = () => {
    if (valid()) {
      const { route } = props
      if (route && route.params && route.params.address._id) {
        const addressId = route.params.address._id
        Api.editAddress(addressId, async (err, result) => {
          if (result) {
            setErrorText(null)
          }
          const newAddress = userAddress.map(item => {
            if (item._id === addAddress._id) {
              return addAddress;
            } else {
              return item;
            }
          });
          dispatch({ type: "UserAddresses", data: { UserAddresses: newAddress } })
          navigation.goBack()
        })
      } else {
        Api.addAddress({
          name: name,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zipCode: zipCode
        }, async (err, result) => {
          if (result) {
            dispatch(getUserAddresses())
            setTimeout(() => {
              navigation.goBack()
            }, 300);
            setErrorText(null)
          }
        })
      }
    }
  }

  const handleChange = ({ key, value }) => {
    setAddAddress((prevAddress) => ({
      ...prevAddress,
      [key]: value,
    }));
  }

  return (
    <View style={styles.container}>
      <TopnavBar title={'Add a new address'} from={'back'} />
      <ScrollView>

        {errorText && (
          <WrongInputWarning warningText={errorText} style={{ marginTop: 15, marginBottom: 15 }} />
        )}

        <View style={styles.medalContaint}>
          <TextInputCom title={"Name"}
            ref={nameInpute}
            from={"Name"}
            placeholder={"Enter your name"}
            returnKeyType={'next'}
            onChangeText={name => handleChange({ key: 'name', value: name })}
            value={name}
            onSubmitEditing={() => { mobileInput?.current?.focus(); }}
          />
          <TextInputCom title={"Mobile Number"}
            from={"Name"}
            keyboardType='numeric'
            ref={mobileInput}
            placeholder={"Enter your mobile number"}
            returnKeyType={'next'}
            onChangeText={phone => handleChange({ key: 'phone', value: phone })}
            value={phone}
            onSubmitEditing={() => { addressInput?.current?.focus(); }}
          />
          <TextInputCom title={"Address"}
            from={"Name"}
            ref={addressInput}
            placeholder={"Enter your address"}
            returnKeyType={'next'}
            onChangeText={address => handleChange({ key: 'address', value: address })}
            value={address}
            onSubmitEditing={() => { cityInput?.current?.focus(); }}
          />
          <TextInputCom title={"City"}
            from={"Name"}
            ref={cityInput}
            placeholder={"City"}
            returnKeyType={'next'}
            onChangeText={city => handleChange({ key: 'city', value: city })}
            value={city}
            onSubmitEditing={() => { stateInput?.current?.focus(); }}
          />
          <TextInputCom title={"State"}
            from={"Name"}
            ref={stateInput}
            placeholder={"State"}
            returnKeyType={'next'}
            onChangeText={state => handleChange({ key: 'state', value: state })}
            value={state}
            onSubmitEditing={() => { zipInput?.current?.focus(); }}
          />
          <TextInputCom title={"ZipCode"}
            from={"Name"}
            ref={zipInput}
            c
            placeholder={"ZipCode"}
            returnKeyType={'next'}
            onChangeText={zipCode => handleChange({ key: 'zipCode', value: zipCode })}
            value={zipCode}
            onSubmitEditing={() => { addressHandler() }}
          />
        </View>
      </ScrollView>

      <View style={styles.bottonContaint}>
        <TouchableOpacity onPress={() => addressHandler()} style={[styles.buttonStyle]}>
          <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddAddress

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addAddress: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 15,
    flexDirection: "row",

  },
  medalContaint: {
    backgroundColor: "#fff",
    width: windowWidth,
    paddingVertical: 15,
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