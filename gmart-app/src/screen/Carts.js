import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import TopnavBar from '../components/TopnavBar';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {windowWidth} from '../utils/deviceInfo';
import {colors} from '../constants/colors';
import Api from '../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from '../components/Spinner';
import {
  getUserAddresses,
  getCart,
  updateCart,
} from '../components/redux/actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast, {DURATION} from '../constants/Toast';
import FastImage from 'react-native-fast-image';

const Carts = ({navigation, route}) => {
  const dispatch = useDispatch();
  const addressId = route?.params?.addressId;
  const {user, tempUserId, userAddress, cart, cartLoading} = useSelector(
    state => state.app,
  );
  const [selectedAddress, setSelectedAddress] = useState(
    userAddress?.[0] ? userAddress?.[0] : null,
  );
  const deliveryCharge = cart?.deliveryCharge
    ? parseFloat(cart?.deliveryCharge)
    : 0;
  const freeOrderDeliveryLimit = cart?.freeOrderDeliveryLimit
    ? parseFloat(cart?.freeOrderDeliveryLimit)
    : 0;
  const errorToastRef = useRef(null);

  useEffect(() => {
    if (route?.params?.addressId) {
      setSelectedAddress([...userAddress].find(item => item._id === addressId));
    }
  }, [route?.params?.addressId]);

  useEffect(() => {
    if (userAddress.length > 0 && !selectedAddress) {
      setSelectedAddress(userAddress[0]);
    }
  }, [userAddress]);

  useEffect(() => {
    const userId = user._id == null ? tempUserId : user._id;
    dispatch(getCart(userId));
  }, []);

  useEffect(() => {
    const address = () => {
      dispatch(getUserAddresses());
    };
    address();
  }, [route?.params?.addressId]);

  const showToast = massage => {
    errorToastRef.current.show(massage, DURATION.LENGTH_SHORT, () => {});
  };

  const removeHandler = product => {
    const userId = user._id == null ? tempUserId : user._id;
    Api.updateCart(
      userId,
      {productId: product._id, quantity: 0},
      async (err, result) => {
        dispatch(updateCart(product, 0));
      },
    );
  };

  const addQuantity = (type, qnt, product) => {
    const quantity = type === 'add' ? qnt + 1 : qnt - 1;
    const userId = user._id == null ? tempUserId : user._id;

    Api.updateCart(
      userId,
      {productId: product._id, quantity: quantity},
      async (err, result) => {
        if (result && result.data && result.data.success) {
          dispatch(updateCart(product, quantity));
        } else {
          showToast(err?.response?.data?.error || 'An error occurred');
        }
      },
    );
  };

  const getCartData = () => {
    var payableAmount = 0,
      totalDiscount = 0,
      subTotal = 0;
    cart?.products?.map(({productId, quantity}) => {
      const price = productId?.price;
      const specialPrice = productId?.specialPrice;
      payableAmount = payableAmount + (price > 0 ? price * quantity : 0);
      totalDiscount =
        totalDiscount +
        (specialPrice > productId.price
          ? 0
          : (productId.price - (specialPrice > 0 ? specialPrice : 0)) *
            quantity);
      subTotal =
        subTotal + (specialPrice * quantity > 0 ? specialPrice * quantity : 0);
    });
    return {payableAmount, totalDiscount, subTotal};
  };

  const {payableAmount, totalDiscount, subTotal} = getCartData();
  const total =
    subTotal > freeOrderDeliveryLimit
      ? payableAmount - totalDiscount
      : payableAmount + deliveryCharge - totalDiscount;

  const paymentButtonHandler = () => {
    if (userAddress && userAddress.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const renderCart = () => {
    if (cart && cart?.products && cart?.products?.length > 0) {
      return (
        <>
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'space-between',
              flexGrow: 1,
            }}>
            <View>
              {userAddress.length > 0 ? (
                <View style={styles.selectedAddress}>
                  <View style={{width: windowWidth * 0.7}}>
                    <Text
                      style={{color: '#000', fontFamily: 'Montserrat-Medium'}}>
                      {selectedAddress && selectedAddress?.name},{' '}
                      {selectedAddress && selectedAddress?.zipCode}
                    </Text>
                    <Text style={styles.addressText}>
                      {selectedAddress?.address}
                    </Text>
                    <Text
                      style={{color: 'grey', fontFamily: 'Montserrat-Medium'}}>
                      {selectedAddress?.city}, {selectedAddress?.state}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.changeStyle}
                    onPress={() => navigation.navigate('ChangeAddress')}>
                    <Text
                      style={{color: '#fff', fontFamily: 'Montserrat-Medium'}}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    user.token
                      ? navigation.navigate('AddAddress')
                      : navigation.navigate('Account', {screen: 'Login'})
                  }
                  style={[
                    styles.addAddress,
                    {
                      justifyContent: 'center',
                      marginBottom: 10,
                      flexDirection: 'row',
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1,
                    },
                  ]}>
                  <Entypo name={'plus'} size={25} color={'#000'} />
                  <Text
                    style={{color: '#000', fontFamily: 'Montserrat-Medium'}}>
                    Add New Address
                  </Text>
                </TouchableOpacity>
              )}

              {cart?.products?.map(({productId, quantity}, index) => {
                const discount =
                  productId &&
                  productId.price &&
                  productId.price > productId.specialPrice
                    ? Math.round(
                        100 - (100 * productId.specialPrice) / productId.price,
                      )
                    : '';
                return (
                  <View key={index}>
                    <View style={styles.addAddress}>
                      <FastImage
                        style={styles.imageStyle}
                        source={{
                          uri: productId?.photos[0],
                          priority: FastImage.priority.h,
                        }}
                      />
                      <View style={{marginLeft: 15}}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 16,
                            marginRight: 10,
                            fontFamily: 'Montserrat-SemiBold',
                            marginBottom: 5,
                          }}>
                          {productId?.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 7,
                          }}>
                          <Text
                            style={{
                              color: colors.statusBar,
                              fontSize: 16,
                              marginRight: 10,
                              fontFamily: 'Montserrat-SemiBold',
                            }}>
                            ₹{productId?.specialPrice}
                          </Text>
                          {productId?.specialPrice < productId?.price && (
                            <Text
                              style={{
                                marginRight: 10,
                                color: colors.statusBar,
                                fontFamily: 'Montserrat-SemiBold',
                                textDecorationLine: 'line-through',
                              }}>
                              ₹{productId?.price}
                            </Text>
                          )}
                          <Text
                            style={{
                              marginLeft: 5,
                              color: '#000',
                              fontSize: 14,
                            }}>
                            - {discount}%
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#000',
                                fontSize: 16,
                                marginBottom: 5,
                                fontFamily: 'Montserrat-Medium',
                              }}>
                              Qty :{' '}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() =>
                                  addQuantity('add', quantity, productId)
                                }
                                style={styles.plusIcon}>
                                <AntDesign
                                  name={'plus'}
                                  size={16}
                                  color={'#fff'}
                                />
                              </TouchableOpacity>
                              <Text
                                style={{
                                  color: '#000',
                                  fontSize: 16,
                                  fontFamily: 'Montserrat-Medium',
                                  marginHorizontal: 15,
                                }}>
                                {quantity}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  addQuantity('minus', quantity, productId)
                                }
                                style={styles.plusIcon}>
                                <AntDesign
                                  name={'minus'}
                                  size={16}
                                  color={'#fff'}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => removeHandler(productId)}
                      style={[
                        styles.removeStore,
                        {backgroundColor: colors.statusBar},
                      ]}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          paddingVertical: 10,
                          color: '#fff',
                          fontFamily: 'Montserrat-Medium',
                        }}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <View>
              <View style={styles.priceDetails}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    marginRight: 10,
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 20,
                  }}>
                  Price Details
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 16,
                      marginRight: 10,
                      fontFamily: 'Montserrat-Regular',
                      marginBottom: 5,
                    }}>
                    Price ({cart?.products?.length || 0}{' '}
                    {cart?.products && cart?.products?.length > 1
                      ? `items`
                      : `item`}
                    )
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 5,
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    ₹{payableAmount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 16,
                      marginRight: 10,
                      fontFamily: 'Montserrat-Regular',
                      marginBottom: 5,
                    }}>
                    Delivery Fee
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 5,
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    {subTotal > freeOrderDeliveryLimit ? 0 : deliveryCharge}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 16,
                      marginRight: 10,
                      fontFamily: 'Montserrat-Regular',
                      marginBottom: 5,
                    }}>
                    TotalDiscount
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 5,
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    - ₹{totalDiscount}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.removeStore,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  },
                ]}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    marginRight: 10,
                    marginBottom: 5,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Total Amount
                </Text>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    marginRight: 10,
                    marginBottom: 5,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  ₹{total}
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottonContaint}>
            <TouchableOpacity
              disabled={paymentButtonHandler()}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PaymentOptions', {addressId})}
              style={[
                styles.buttonStyle,
                {
                  backgroundColor: paymentButtonHandler()
                    ? 'grey'
                    : colors.statusBar,
                },
              ]}>
              {userAddress && userAddress.length > 0 ? (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Continue to payment
                </Text>
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Select address
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Home')}
        style={styles.cartEmptyContaint}>
        <Image
          style={styles.cartImage}
          source={require('../../assets/Image/cart_empty.png')}
        />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              textAlign: 'center',
              color: colors.darkGray, // added this style, in android mobile text was transparent
            }}>
            Your cart is empty
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              textAlign: 'center',
              color: colors.darkGray, // added this style, in android mobile text was transparent
            }}>
            pick some items
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
            style={[styles.buttonStyle, {marginTop: 20}]}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <TopnavBar title={'My Cart'} from={'back'} />
      {cartLoading ? <Spinner /> : <>{renderCart()}</>}
      <Toast
        ref={errorToastRef}
        position={'center'}
        positionValue={150}
        style={styles.errorToast}
        textStyle={styles.errorToastText}
      />
    </View>
  );
};

export default Carts;

const addressCom = {
  backgroundColor: '#fff',
  paddingVertical: 12,
  alignItems: 'center',
  paddingHorizontal: 12,
  flexDirection: 'row',
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartEmptyContaint: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cartImage: {
    width: windowWidth * 0.6,
    height: 240,
  },
  changeStyle: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: colors.statusBar,
    borderRadius: 15,
  },
  addressText: {
    width: windowWidth * 0.7,
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Montserrat-Medium',
    marginVertical: 5,
  },
  addAddress: {
    ...addressCom,
  },
  selectedAddress: {
    justifyContent: 'space-between',
    marginBottom: 10,
    flexDirection: 'row',
    marginTop: 10,
    ...addressCom,
  },
  imageStyle: {
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    borderRadius: 15,
  },
  plusIcon: {
    backgroundColor: colors.statusBar,
    padding: 5,
    borderRadius: 10,
  },
  removeStore: {
    borderTopColor: '#000',
    borderTopWidth: 0.5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  priceDetails: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  bottonContaint: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  buttonStyle: {
    width: windowWidth - 120,
    height: 42,
    paddingHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorToast: {
    backgroundColor: colors.red,
  },
  errorToastText: {
    color: colors.white,
    fontFamily: 'Montserrat - SemiBold',
  },
});
