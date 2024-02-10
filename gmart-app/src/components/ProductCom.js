import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { windowWidth } from '../utils/deviceInfo'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image';

const ProductCom = ({ from, item, title }) => {

  const navigation = useNavigation()

  return (
    <View style={styles.mainContaint(title)}>
      <TouchableOpacity onPress={() => navigation.navigate('CommenStack',
        {
          screen: 'ProductDetails',
          params: { productId: item._id }
        }
      )}>
        <FastImage source={{ uri: item?.photos?.[0], priority: FastImage.priority.high, }} style={styles.imageStyle(title)} />
        <Text style={styles.textStyle}>{item?.name}</Text>
        <View style={{ paddingBottom: 20, flexDirection: "row", alignItems: "center", marginHorizontal: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: colors.statusBar, fontFamily: 'Montserrat-SemiBold', marginRight: 10, fontSize: 16 }}>₹{item?.specialPrice}</Text>
            {item.specialPrice < item.price && <Text style={{ color: colors.statusBar, fontFamily: 'Montserrat-SemiBold', textDecorationLine: 'line-through' }}>₹{item?.price}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </View >
  )
}

export default ProductCom

const styles = StyleSheet.create({
  mainContaint: (title) => ({
    marginHorizontal: 7,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 15,
    width: title == 'Home' ? windowWidth * 0.414 : windowWidth * 0.445,
    marginVertical: 5

  }),
  imageStyle: (title) => ({
    width: title == 'Home' ? windowWidth * 0.414 : windowWidth * 0.445,
    height: 120,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15
  }),
  textStyle: {
    marginHorizontal: 15,
    marginVertical: 15,
    color: "#000",
    fontSize: 15,
    fontFamily: 'Montserrat-Regular'
  },
  tStyle: {
    backgroundColor: colors.statusBar,
    width: 22,
    height: 22,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  tsecoundStyle: item => ({
    backgroundColor: item.storeIconColor,
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    position: "absolute",
    top: 50,
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 1
  }),
  seeallStyle: {
    backgroundColor: colors.statusBar,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 30,
    alignItems: "center"
  },
})