import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TopnavBar from '../components/TopnavBar';
import {colors} from '../constants/colors';
import Api from '../utils/api';
import moment from 'moment';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const Order = ({navigation}) => {
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Delivered');
  const [loading, setLoading] = useState(true);
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState([
    {text: 'Delivered', value: 'Delivered'},
    {text: 'Processing', value: 'Placed'},
    {text: 'Cancelled', value: 'Cancelled'},
  ]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', async () => {
      Api.getOrders((err, result) => {
        setOrder(result?.data?.orders || []);
        setLoading(false);
      });
    });
    return focusListener;
  }, [navigation]);

  const renderOrderStatusButton = () => {
    return (
      <View style={styles.statusBtnWrapper}>
        {orderStatus.map((status, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedStatus(status.value)}
            style={[
              styles.statusBtn,
              {
                backgroundColor:
                  status.value === selectedStatus
                    ? colors.white
                    : 'transparent',
                marginRight: index + 1 === orderStatus.length ? 0 : 15,
              },
            ]}>
            <Text
              style={[
                styles.statusBtnText,
                {color: status.value === selectedStatus ? 'red' : '#000'},
              ]}>
              {status.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const cancelOrder = () => {
    Api.cancelOrder(orderId, (err, result) => {
      Api.getOrders((err, result) => {
        if (result) {
          setOrder(result?.data?.orders);
        }
      });
      setIsConfirmationModal(false);
    });
  };

  const getOrderByStatus = () => {
    if (order && order.length) {
      return order?.filter(item => {
        if (item?.status?.toLowerCase() == selectedStatus?.toLowerCase())
          return item;
      });
    } else return [];
  };

  return (
    <View style={styles.container}>
      <TopnavBar from={'Home'} title={'My Orders'} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Montserrat-Bold',
                marginRight: 20,
                color: colors.darkGray, // added this style, in android mobile text was transparent
              }}>
              Transactions
            </Text>
          </View>
          {renderOrderStatusButton()}
          <ScrollView>
            {getOrderByStatus().length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {selectedStatus === 'Delivered' && (
                  <Text style={styles.noOrdersText}>
                    No delivered orders yet.
                  </Text>
                )}
                {selectedStatus === 'Placed' && (
                  <Text style={styles.noOrdersText}>No Placed orders yet.</Text>
                )}
                {selectedStatus === 'Cancelled' && (
                  <Text style={styles.noOrdersText}>
                    No cancelled orders yet.
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatList}
                data={getOrderByStatus()}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OrderDetails', {order: item})
                      }
                      style={[
                        styles.orderWrapper,
                        {borderBottomWidth: index + 1 !== order.length ? 1 : 0},
                      ]}>
                      <View style={styles.row}>
                        <Text style={styles.numberText}>
                          Order #{item.code}
                        </Text>
                        <Text style={styles.textStyle}>
                          {moment(item.createdAt).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                      <View style={[styles.row, styles.infoWrapper]}>
                        <Text style={styles.textStyle}>
                          Items:{' '}
                          <Text style={styles.infoText}>
                            {item.products.length}
                          </Text>
                        </Text>
                        <Text style={styles.textStyle}>
                          Total Price:{' '}
                          <Text style={styles.infoText}>
                            ₹{item.totalPrice}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.btnWrapper}>
                        {selectedStatus === 'Placed' && (
                          <TouchableOpacity
                            onPress={() => [
                              setIsConfirmationModal(true),
                              setOrderId(item._id),
                            ]}
                            style={[
                              styles.detailButtonStyle,
                              styles.cancelButtonStyle,
                            ]}>
                            <Text style={styles.detailButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </ScrollView>
        </>
      )}
      {isConfirmationModal && (
        <Alert
          isVisible={isConfirmationModal}
          message={'Are you sure you want to cancel this order?'}
          cancelText={'No'}
          confirmButtonStyle={{backgroundColor: 'red'}}
          confirmText={'Yes'}
          onConfirm={() => cancelOrder()}
          onClosed={() => setIsConfirmationModal(false)}
        />
      )}
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderContaint: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  statusBtnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginHorizontal: 15,
  },
  statusBtn: {
    height: 40,
    width: 'auto',
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusBtnText: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
    textTransform: 'capitalize',
  },
  buttonStyle: {
    // width: 100,
    height: 25,
    paddingHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 10,
  },
  noOrdersText: {
    fontSize: 16,
    color: colors.darkGray,
    // textAlign: 'center',
    marginTop: 20,
  },
  flatList: {
    borderRadius: 15,
    margin: 15,
    backgroundColor: colors.white,
  },
  orderWrapper: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomColor: colors.paleGray,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
  textStyle: {
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Montserrat-Regular',
  },
  infoWrapper: {
    marginTop: 8,
  },
  infoText: {
    color: colors.darkBlack,
  },
  btnWrapper: {
    flexDirection: 'row',
  },
  detailButtonStyle: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: colors.statusBar,
  },
  cancelButtonStyle: {
    backgroundColor: 'red',
  },
  detailButtonText: {
    fontSize: 14,
    textTransform: 'capitalize',
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
});
