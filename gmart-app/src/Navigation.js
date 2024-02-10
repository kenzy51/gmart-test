import {StyleSheet, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {getActiveRouteName} from './utils/navigater';
import {isAndroid} from './utils/deviceInfo';
import {colors} from './constants/colors';
import {CustomIcon} from './utils/Icons';
import React from 'react';
import Home from './screen/Home';
import Browse from './screen/Browse';
import Order from './screen/Order';
import Profile from './screen/Profile';
import ProductDetails from './screen/ProductDetails';
import Wishlist from './screen/Wishlist';
import Login from './screen/Auths/Login';
import SignUp from './screen/Auths/SignUp';
import PhoneNumber from './screen/Auths/PhoneNumber';
import Otp from './screen/Auths/Otp';
import Carts from './screen/Carts';
import AddAddress from './screen/AddAddress';
import PaymentOptions from './screen/PaymentOptions';
import OrderDetails from './screen/OrderDetails';
import SeeAll from './screen/SeeAll';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import ChangeAddress from './screen/ChangeAddress';
import OrderSuccess from './screen/OrderSuccess';
import EditProfile from './screen/EditProfile';
import FeedBack from './screen/FeedBack';
import ReferPage from './screen/ReferPage';
import TermsCondition from './screen/TermsCondition';
import PrivacyPolicy from './screen/PrivacyPolicy';
import Manufacturers from './screen/Manufacturer/Manufacturers';
import ManufacturerDetail from './screen/Manufacturer/ManufacturerDetail';
import DordoiMap from './screen/DordoiMap/DordoiMap';
import ShopInput from './screen/DordoiMap/ShopInput';
import ShopDetails from './screen/DordoiMap/ShopDetails';
import ProductDetail from './screen/Products/ProductDetail';
import ProductList from './screen/Products/ProductList';
import AddManufacturer from './screen/Manufacturer/AddManufacturer';
import ProductAdd from './screen/Products/ProductAdd';
import RequestPage from './screen/Request/RequestPage';
import RequestList from './screen/Request/RequestList';
import RequestDetail from './screen/Request/RequestDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tab" component={TabNavigation} />
    </Stack.Navigator>
  );
};

const HomeStack = ({navigation, route}) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  navigation.setOptions({
    tabBarStyle:
      !routeName || routeName === 'Home'
        ? styles.tabBarStyle
        : styles.tabBarDisplayStyle,
  });
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Browse" component={Browse} />
      <Stack.Screen name="CommenStack" component={CommenStack} />
      <Stack.Screen name="SeeAll" component={SeeAll} />
      <Stack.Screen name="Manufacturers" component={Manufacturers} />
      <Stack.Screen name="ManufacturerDetail" component={ManufacturerDetail} />
      <Stack.Screen name="AddManufacturer" component={AddManufacturer} />
      <Stack.Screen name="DordoiStack" component={DordoiStack} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="ProductAdd" component={ProductAdd} />
      <Stack.Screen name="RequestList" component={RequestList} />
      <Stack.Screen name="Request" component={RequestPage} />
      <Stack.Screen name="RequestDetail" component={RequestDetail} />
    </Stack.Navigator>
  );
};

const BrowseStack = ({navigation, route}) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  navigation.setOptions({
    tabBarStyle:
      !routeName || routeName === 'Browse'
        ? styles.tabBarStyle
        : styles.tabBarDisplayStyle,
  });

  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Browse" component={Browse} />
      <Stack.Screen name="CommenStack" component={CommenStack} />
    </Stack.Navigator>
  );
};

const OrderStack = ({navigation, route}) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  navigation.setOptions({
    tabBarStyle:
      !routeName || routeName === 'Order'
        ? styles.tabBarStyle
        : styles.tabBarDisplayStyle,
  });

  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="CommenStack" component={CommenStack} />
    </Stack.Navigator>
  );
};

const AccountStack = connect(state => ({user: state.app.user}))(
  ({navigation, user}) => {
    var navigationState = navigation.getState(),
      activeRoute;
    if (navigationState) activeRoute = getActiveRouteName(navigationState);
    navigation.setOptions({
      tabBarStyle:
        activeRoute &&
        ((activeRoute === 'Account' && user && user.token) ||
          activeRoute === 'Profile')
          ? {
              height: 64,
              paddingTop: isAndroid ? 5 : 8,
              paddingBottom: 8,
              display: 'flex',
            }
          : {display: 'none'},
    });
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user && user.token ? (
          <Stack.Screen name="Profile" component={ProfileStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    );
  },
);

const AuthStack = ({navigation, route}) => {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      <Stack.Screen name="Otp" component={Otp} />
    </Stack.Navigator>
  );
};

const ProfileStack = ({navigation, route}) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  navigation.setOptions({
    tabBarStyle:
      !routeName || routeName === 'Profile'
        ? {display: 'flex'}
        : styles.tabBarDisplayStyle,
  });
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="FeedBack" component={FeedBack} />
      <Stack.Screen name="ReferPage" component={ReferPage} />
      <Stack.Screen name="TermsCondition" component={TermsCondition} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      {/* <Stack.Screen name="GmartSrore" component={GmartSrore} /> */}
      <Stack.Screen name="CommenStack" component={CommenStack} />
    </Stack.Navigator>
  );
};

const CommenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Carts" component={Carts} />
      <Stack.Screen name="ChangeAddress" component={ChangeAddress} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
    </Stack.Navigator>
  );
};

const DordoiStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="DordoiMap" component={DordoiMap} />
      <Stack.Screen name="ShopDetails" component={ShopDetails} />
      <Stack.Screen name="ShopInput" component={ShopInput} />
    </Stack.Navigator>
  );
};

function TabNavigation() {
  return (
    <Tab.Navigator
      safeAreaInsets={{bottom: 0}}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarIcon: ({focused, color}) => {
          let iconName,
            size = 23;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Browse') (iconName = 'Search'), (size = 25);
          else if (route.name === 'Store') iconName = 'Store';
          else if (route.name === 'Order') iconName = 'order';
          else if (route.name === 'Account') iconName = 'profile';
          return (
            <CustomIcon
              name={iconName}
              size={size}
              color={focused ? colors.statusBar : '#4F4F4F'}
            />
          );
        },
        tabBarLabel: ({focused, color}) => {
          let title;
          if (route.name === 'Home') title = 'Home';
          else if (route.name === 'Browse') title = 'Browse';
          else if (route.name === 'Store') title = 'Store';
          else if (route.name === 'Order') title = 'Order';
          else if (route.name === 'Account') title = 'Profile';
          return title ? (
            <Text
              style={[
                styles.tabLabelStyle,
                {color: focused ? colors.statusBar : '#4F4F4F'},
              ]}>
              {title}
            </Text>
          ) : null;
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabStyle,
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Browse" component={BrowseStack} />
      <Tab.Screen name="Order" component={OrderStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

// const StoreStack = () => {
//   return (
//     <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Store" component={Store} />
//       <Stack.Screen name="ProductDetails" component={ProductDetails} />
//       <Stack.Screen name="CreateStore" component={CreateStore} />
//       <Stack.Screen name="Wishlist" component={Wishlist} />
//       <Stack.Screen name="AddProduct" component={AddProduct} />
//       <Stack.Screen name="AddAddress" component={AddAddress} />
//       <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
//       <Stack.Screen name="AddCart" component={AddCart} />
//       {/* <Stack.Screen name="OrderDetails" component={OrderDetails} /> */}
//     </Stack.Navigator>
//   )
// }
export default Navigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 64,
    backgroundColor: colors.white,
    paddingTop: isAndroid ? 5 : 8,
    paddingBottom: isAndroid ? 8 : 8,
  },
  tabBarDisplayStyle: {
    display: 'none',
  },
  tabLabelStyle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
});
