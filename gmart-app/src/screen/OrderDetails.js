import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native'
import React from 'react'
import TopnavBar from '../components/TopnavBar'
import { colors } from '../constants/colors'
import FastImage from 'react-native-fast-image'
import { windowWidth } from '../utils/deviceInfo'

const OrderDetails = ({ route }) => {

  const order = route?.params?.order

  const renderProduct = ({ item, index }, total) => (
    <View
      style={[
        styles.productWrapper,
        { paddingTop: index == 0 ? 0 : 16, paddingBottom: index + 1 == total ? 0 : 16, borderBottomWidth: index + 1 == total ? 0 : 1 }
      ]}
    >
      <View style={styles.imageWrapper}>
        <FastImage source={{ uri: item.productId.photos[0], priority: FastImage.priority.high }} style={styles.productImage} />
      </View>
      <View style={styles.rightWrapper}>
        <Text style={styles.nameText} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
        <View style={styles.optionsWrapper}>
          {item.options && item.options.length > 0 && (
            item.options.map((option, index) => {
              return (
                <React.Fragment key={index}>
                  <Text style={styles.optionTitleText}>{option.name !== undefined && `${option.name}:`} <Text style={styles.optionValueText}>{option.value !== undefined && option.value}</Text></Text>
                  {index + 1 !== item.options.length && <View style={styles.optionBorder}></View>}
                </React.Fragment>
              )
            })
          )}
        </View>

        <View style={styles.infoWrapper}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.priceText, { marginRight: 10 }]}>₹{item.sellPrice}</Text>
            <Text style={{ fontSize: 16, color: colors.primary, fontFamily: "Montserrat-Regular", textDecorationLine: 'line-through' }}>₹{item.price}</Text>
          </View>
          <Text style={styles.optionTitleText}>Quantity: <Text style={styles.colorBlack}>{item.quantity}</Text></Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <TopnavBar title={'Order Details'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        {order && order.products && order.products.length > 0 && (
          <View style={styles.wrapper}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={order.products}
              renderItem={item => renderProduct(item, order.products.length)}
              bounces={false}
            />
          </View>
        )}
      </ScrollView>
      <View style={styles.summaryWrapper}>
        <View style={styles.row}>
          <Text style={styles.textStyle}>{`Price (${order.products.length} ${order.products.length > 1 ? `items` : `item`})`}</Text>
          <Text style={styles.textStyle}>₹{order.subTotal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.textStyle}>Delivery Charges</Text>
          <Text style={styles.textStyle}>₹{order.deliveryCharge}</Text>
        </View>
        <View style={[styles.row, styles.border]}>
          <Text style={styles.payAmountText}>Total Amount Payable</Text>
          <Text style={styles.payAmountText}>₹{order.totalPrice}</Text>
        </View>
        {order.totalDiscount > 0 && <Text style={styles.discountText}>You saved ₹{order.totalDiscount} on this order</Text>}
      </View>
    </View>
  )
}

export default OrderDetails

const styles = StyleSheet.create({
  container: {
    flex: 1

  },
  scrollViewStyle: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: colors.paleGray
  },
  wrapper: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 16,
    margin: 15
  },
  summaryWrapper: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  textStyle: {
    fontSize: 14,
    color: "#000",
    fontFamily: 'Karla-Regular',
    fontFamily: "Montserrat-Bold",
    lineHeight: 20
  },
  payAmountText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Montserrat-Bold",
    paddingVertical: 4
  },
  productWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomColor: colors.paleGray
  },
  imageWrapper: {
    height: windowWidth * 0.25,
    width: windowWidth * 0.25,
    backgroundColor: colors.paleGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  productImage: {
    height: windowWidth * 0.25,
    width: windowWidth * 0.25,
    borderRadius: 10
  },
  rightWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 12,
    width: windowWidth - (windowWidth * 0.25 + 75)
  },
  nameText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: "Montserrat-SemiBold",
    textTransform: 'capitalize',
    lineHeight: 20
  },
  optionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: windowWidth - (windowWidth * 0.25 + 75),
    marginTop: 12
  },
  optionTitleText: {
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: "Montserrat-Regular",
    textTransform: 'capitalize'
  },
  optionValueText: {
    fontSize: 14,
    color: colors.darkBlack,
    fontFamily: "Montserrat-Regular",
    textTransform: 'none'
  },
  optionBorder: {
    marginHorizontal: 10,
    height: 15,
    width: 1,
    backgroundColor: colors.darkGray
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  priceText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Montserrat-Bold",
  },
  discountText: {
    fontSize: 14,
    color: colors.red,
    fontFamily: "Montserrat-Regular",
    lineHeight: 20,
    paddingBottom: 8
  },
  colorBlack: {
    color: colors.darkBlack
  }
})