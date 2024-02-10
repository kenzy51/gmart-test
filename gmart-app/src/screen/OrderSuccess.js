import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import TopnavBar from '../components/TopnavBar'
import FastImage from 'react-native-fast-image';
import { windowWidth } from '../utils/deviceInfo';
import { getCart } from '../components/redux/actions';
import { useSelector, useDispatch } from 'react-redux';

const OrderSuccess = ({ navigation }) => {

  const dispatch = useDispatch()
  const { user, tempUserId } = useSelector(state => state.app);

  useEffect(() => {
    const userId = user._id == null ? tempUserId : user._id
    dispatch(getCart(userId))
  }, [])

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <TopnavBar from={"orderSuccess"} title={'Order Success'} />
      <View style={{ justifyContent: "center", flex: 1 }}>
        <FastImage style={styles.imageStyle} source={require('../../assets/Image/orderSuccess.gif')} />
        <TouchableOpacity onPress={() => goToHome()}>
          <Text style={{ alignSelf: "center", marginTop: 20, fontSize: 16, fontFamily: "Montserrat-SemiBold", paddingVertical: 10, paddingHorizontal: 10 }}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OrderSuccess

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: windowWidth,
    height: 500
  }
})