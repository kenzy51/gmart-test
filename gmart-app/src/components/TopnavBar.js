import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import React from 'react';
import {colors} from '../constants/colors';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {CustomIcon} from '../utils/Icons';
import {useSelector} from 'react-redux';

const TopnavBar = ({title, from}) => {
  const {user, cart} = useSelector(state => state.app);
  const navigation = useNavigation();


    return (
        <View>
            {from == 'Home' ?
                <View style={styles.topContaint}>
                    <Text style={{ color: "#fff", fontSize: 20, fontFamily: 'Montserrat-Bold' }}>{title}</Text>
                    <View style={styles.iconStyle}>
                        <TouchableOpacity onPress={() => {
                            user && user.token ?
                                navigation.navigate('CommenStack', { screen: 'Wishlist' }) :
                                navigation?.navigate('Account', { screen: 'Login' })
                        }}>
                            <CustomIcon style={{ marginRight: 15 }} name={'heart'} size={25} color={'#fff'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('CommenStack', { screen: 'Carts' })}>
                            <CustomIcon name={'cart'} size={25} color={'#fff'} />
                            {
                                cart?.products?.length > 0 &&
                                <View style={styles.totalProducts}>
                                    <Text style={{ color: "#fff", fontSize: 12 }}>{cart.products.length}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                </View> :
                <View style={styles.secoundContaint}>
                    {from == "orderSuccess" ? null :
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0, paddingVertical: 10, paddingHorizontal: 10 }}>
                            <MaterialIcons name={"arrow-back"} size={25} color={"#fff"} />
                        </TouchableOpacity>}


                    <Text style={{ color: "#fff", fontSize: 20, fontFamily: 'Montserrat-Bold' }}>{title}</Text>

                    {
                        from != 'DordoiMap' ? null :
                            user && user.token &&
                            <TouchableOpacity onPress={() => navigation.navigate('DordoiStack', { screen: 'ShopInput' })} style={{ position: "absolute", right: 10, paddingVertical: 10, paddingHorizontal: 10}}>
                                <MaterialIcons name={"add-circle"} size={25} color={"#fff"} />
                            </TouchableOpacity>
                    }
                </View>

            }
        </View >
    )
}

export default TopnavBar;

const styles = StyleSheet.create({
  topContaint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.statusBar,
  },
  iconStyle: {
    flexDirection: 'row',
  },
  totalProducts: {
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 30,
    width: 15,
    position: 'absolute',
    left: 15,
    bottom: 12,
  },
  secoundContaint: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.statusBar,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
