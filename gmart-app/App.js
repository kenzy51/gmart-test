import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import Navigation from './src/Navigation'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import StatusBar from './src/components/StatusBar'
import { isAndroid } from './src/utils/deviceInfo'
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux'
import store from './src/components/redux/store'
import { enableScreens } from 'react-native-screens';
import Api from './src/utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, setTempUserId, getCart } from './src/components/redux/actions'
import { getWishlistProducts, getUserAddresses } from './src/components/redux/actions'
import { isIOS } from './src/utils/deviceInfo'

const App = () => {
  useEffect(() => {
    if (isAndroid) setTimeout(() => SplashScreen.hide(), 200)
    if (isIOS) enableScreens(false);
    tempUser()
  }, [])

  const tempUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      Api.getUserDetail(async (err, result) => {
        if (result && result?.data && result?.data?.user) {
          store.dispatch(getCart(result.data?.user?._id))
          store.dispatch({ type: 'authUser', data: { user: { ...result.data?.user, token } } } || [])
        } else {
          store.dispatch(setToken(token))
        }
        store.dispatch(getWishlistProducts())
        store.dispatch(getUserAddresses())
      })
    } else {
      const tempUserId = await AsyncStorage.getItem('tempUserId');
      if (!tempUserId) {
        Api.getTempUserId({}, async (err, result) => {
          const tempUserId = result?.data?.userId
          if (result && result?.data && result?.data?.userId) {
            await AsyncStorage.setItem('tempUserId', tempUserId)
            store.dispatch(setTempUserId(tempUserId))
            store.dispatch(getCart(tempUserId))
          }
        })
      } else {
        store.dispatch(getCart(tempUserId))
        store.dispatch(setTempUserId(tempUserId))
      }
    }
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        <StatusBar />
        <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
          <NavigationContainer>
            <Provider store={store}>
              <Navigation />
            </Provider>
          </NavigationContainer>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})