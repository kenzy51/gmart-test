import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopnavBar from '../components/TopnavBar'
import Api from '../utils/api'
import { windowHeight } from '../utils/deviceInfo'
import Spinner from '../components/Spinner'
import { WebView } from 'react-native-webview';

const TermsCondition = () => {

  const [terms, serterms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Api.getTerms((err, result) => {
      console.log('result', result?.data?.terms)
      serterms(result?.data?.terms?.value)
      setLoading(false)
    })
  }, [])

  const html = terms

  return (
    <View style={styles.container}>
      <TopnavBar title={'Terms Condition'} />
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
              ${html} <!-- Your HTML content goes here -->
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

export default TermsCondition

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  priceSections: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 5,
    height: windowHeight
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
    flex: 1,
    backgroundColor: "#red"
  },

})