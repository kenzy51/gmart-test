import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopnavBar from '../components/TopnavBar'
import Api from '../utils/api'
import { windowWidth } from '../utils/deviceInfo'
import Spinner from '../components/Spinner'
import WebView from 'react-native-webview'

const PrivacyPolicy = () => {

  const [privacy, serPrivacy] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Api.getPrivacy((err, result) => {
      serPrivacy(result?.data?.privacy?.value)
      setLoading(false)
    })
  }, [])

  return (
    <View style={styles.container}>
      <TopnavBar title={'Privacy Policy'} />
      {loading ?
        <Spinner /> :
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.innerWrapper}>
            <WebView
              source={{
                html: `
            <html>
              <head>
              <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                <style>
                  body {
                    margin: 15px;
                    font-size: 16px; /* Adjust the font size as needed */
                    font-family: Montserrat-Regular; /* Optionally change the font family */
                  }
                </style>
              </head>
              <body>
              ${privacy} <!-- Your HTML content goes here -->
              </body>
            </html>
          ` }}
              androidHardwareAccelerationDisabled={true}
              originWhitelist={['*']}
            />
          </View>
        </ScrollView>
      }
    </View>
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerWrapper: {
    flex: 1,
    height: 'auto',
    paddingBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10
  },
  webView: {
    width: windowWidth - 60,
    marginHorizontal: 15
  },
})