import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import TopnavBar from '../components/TopnavBar'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { getUserAddresses } from '../components/redux/actions';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Alert from '../components/Alert';
import Api from '../utils/api';
import { windowWidth } from '../utils/deviceInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeAddress = ({ navigation, route }) => {

  const { userAddress } = useSelector(state => state.app)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false);
  const menuRefs = useRef()
  const [selectedOption, setSelectedOption] = useState();
  const [isConfirmationModal, setIsConfirmationModal] = useState(false)
  const [addresId, setAddresId] = useState(null)

  const handleSelectOption = async (addressId) => {
    await AsyncStorage.setItem('addressId', addressId)
    setSelectedOption(addressId)
    navigation.navigate('Carts', { addressId })
  };

  useEffect(() => {
    dispatch(getUserAddresses())
  }, [])

  useEffect(() => {
    if (!selectedOption && userAddress && userAddress.length > 0) {
      setSelectedOption(userAddress?.[0]?._id)
    }
  }, [userAddress])

  useEffect(() => {
    const abc = async () => {
      const asyncToken = await AsyncStorage.getItem('addressId');
      setSelectedOption(asyncToken)
    }
    abc()
  }, [])

  const openModalHandler = (index, addresId) => {
    menuRefs[index].hide()
    setTimeout(() => {
      setIsConfirmationModal(true),
        setAddresId(addresId)
    }, 300);
  }

  const editAddress = (index, address) => {
    menuRefs[index].hide()
    setTimeout(() => navigation.navigate('AddAddress', { address }), 300);
  }

  const removeAddress = () => {
    Api.deleteAddress(addresId, async (err, result) => {
      setIsConfirmationModal(false)
      dispatch(getUserAddresses())
    })
  }

  return (
    <View style={styles.container}>
      <TopnavBar title={'Change Address'} />
      <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('AddAddress')} style={[styles.addAddress, { justifyContent: "center", marginBottom: 10, flexDirection: "row", alignItems: "center" }]}>
        <Entypo name={"plus"} size={25} color={"#000"} />
        <Text style={{ color: "#000", fontFamily: "Montserrat-Medium", marginLeft: 10 }}>Add New Address</Text>
      </TouchableOpacity>
      <ScrollView>
        {
          userAddress.map((item, index) => {
            return (
              <TouchableOpacity activeOpacity={.7} onPress={() => handleSelectOption(item._id)} style={[styles.addAddress, { marginBottom: 10, flexDirection: "row", }]} key={index}>
                <View style={{ flexDirection: "row" }} >
                  <View style={styles.radioButton} >
                    {selectedOption === item._id && <View style={styles.innerCircle} />}
                  </View>
                  <View>
                    <Text style={styles.nameText}>{item.name}, {item.zipCode}</Text>
                    <Text style={styles.addressText}>{item.address}</Text>
                    <Text style={{ color: "grey", fontFamily: "Montserrat-Medium" }}>{item.city}, {item.state}</Text>
                  </View>
                </View>

                <Menu
                  ref={ref => menuRefs[index] = ref}
                  visible={visible}
                  anchor={<TouchableOpacity
                    style={styles.menuIconWrapper}
                    activeOpacity={0.4}
                    onPress={() => menuRefs[index].show()}
                  >
                    <MaterialCommunityIcon name={'dots-vertical'} size={20} color={"#000"} />
                  </TouchableOpacity>}
                  onRequestClose={() => menuRefs[index].hide()}
                >
                  <MenuItem onPress={() => editAddress(index, item)} textStyle={{ color: "green", fontFamily: "Montserrat-SemiBold", }}>Edit</MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={() => openModalHandler(index, item._id)} textStyle={{ color: "red", fontFamily: "Montserrat-SemiBold", }}>Delete</MenuItem>
                </Menu>
              </TouchableOpacity>

            )
          })
        }
      </ScrollView>
      {isConfirmationModal &&
        <Alert
          isVisible={isConfirmationModal}
          message={'Do you really want to remove address?'}
          cancelText={'No'}
          confirmText={'Yes'}
          onConfirm={() => removeAddress()}
          onClosed={() => setIsConfirmationModal(false)}
        />
      }
    </View>
  )
}

export default ChangeAddress

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addAddress: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  radioButtonsStyle: {
    backgroundColor: "#fff",

  },
  menuIconWrapper: {
    height: 40,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
    marginBottom: 5
  },
  addressText: {
    width: windowWidth * 0.75,
    fontSize: 15,
    color: "grey",
    fontFamily: "Montserrat-Medium",
    marginBottom: 5,
  }
})