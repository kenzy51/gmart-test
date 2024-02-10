import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import TopnavBar from '../components/TopnavBar'
import { colors } from '../constants/colors'
import { windowWidth } from '../utils/deviceInfo'
import Alert from '../components/Alert'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FastImage from 'react-native-fast-image';
import { removeToken, setTempUserId, getCart } from '../components/redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import Api from '../utils/api'
import Share from 'react-native-share';

const Profile = ({ navigation }) => {

  const dispatch = useDispatch()
  const listData = [
    // { title: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
    // { title: 'Refer a Friend', onPress: () => shareHandler() },
    { title: 'Terms & Conditions', onPress: () => navigation.navigate('TermsCondition') },
    // { title: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicy') },
    { title: 'Logout', onPress: () => setIsConfirmationModal(true) },
  ]
  const [isConfirmationModal, setIsConfirmationModal] = useState(false)
  const { user } = useSelector(state => state.app);
  const lastName = user?.profile?.lastName || ''
  const firstName = user?.profile?.firstName || ''
  const photo = user?.profile?.photo || ''
  const phone = user?.phone || ''
  const email = user?.email || ''

  const handleLogout = async () => {
    setIsConfirmationModal(false)
    await AsyncStorage.removeItem('token');
    dispatch(removeToken())
    dispatch(getCart())
    await Api.getTempUserId({}, async (err, result) => {
      if (result && result?.data && result?.data?.userId) {
        await AsyncStorage.setItem('tempUserId', result?.data?.userId)
        dispatch(setTempUserId(result?.data?.userId))
      }
    })
  }

  const shareHandler = () => {
    const options = {
      message: "GMart - online shopping awsome app"
    }
    Share.open(options)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  return (
    <View style={styles.container}>
      <TopnavBar title={'Profile'} from={'Home'} />
      <View style={styles.profileContaint}>
        <View style={styles.tStyle}>
          <View style={styles.photoWrapper}>
            {photo !== '' && <FastImage style={styles.photoStyle} source={{ uri: photo }} />}
          </View>
        </View>

        {user && user.token ? <View>
          <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Montserrat-SemiBold" }}>{lastName} {firstName}</Text>
          <Text style={{ color: "#fff", fontSize: 15, marginVertical: 5, fontFamily: "Montserrat-Medium" }}>+91 {phone}</Text>
          <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Montserrat-Medium" }}>{email}</Text>
        </View> :
          <View>
            <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Montserrat-SemiBold" }}>tempUser</Text>
            <Text style={{ color: "#fff", fontSize: 15, marginVertical: 5, fontFamily: "Montserrat-Medium" }}>+1 1111111111</Text>
            <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Montserrat-Medium" }}>tempUser@gmail.com</Text>
          </View>
        }
      </View>
      <View style={styles.innerContainer}>
        {
          listData.map((item, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => item.onPress && item.onPress()} style={styles.listStyle}>
                <Text style={{ color: "#000", fontFamily: "Montserrat-Medium" }}>{item.title}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
      {isConfirmationModal &&
        <Alert
          isVisible={isConfirmationModal}
          message={'Are you sure you want to logout from this app?'}
          cancelText={'No'}
          confirmText={'Yes'}
          onConfirm={() => handleLogout()}
          onClosed={() => setIsConfirmationModal(false)}
        />
      }
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileContaint: {
    backgroundColor: colors.statusBar,
    width: windowWidth,
    height: 300,
    paddingHorizontal: 25,
    flexDirection: "row",
    paddingTop: 30,
  },
  innerContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    position: "absolute",
    width: windowWidth - 40,
    top: 200,
    padding: 10
  },
  tStyle: {
    backgroundColor: colors.statusBar,
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 25,
    borderColor: '#fff',
    borderWidth: 0.5,
  },
  photoWrapper: {
    backgroundColor: colors.paleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  photoStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  listStyle: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 0.5
  }
})
