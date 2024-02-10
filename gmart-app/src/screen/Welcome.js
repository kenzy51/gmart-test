import { StyleSheet, Text, TouchableOpacity, View, LogBox, Image, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import { windowHeight, windowWidth } from '../utils/deviceInfo'
import { colors } from '../constants/colors'
import AppIntroSlider from 'react-native-app-intro-slider';

const Welcome = ({ navigation }) => {

  const slides = [
    { image: require('../../assets/Image/welcome.png'), title: 'Empowering Artisans, ', title2: 'Farmers & Micro Business' },
    { image: require('../../assets/Image/welcome.png'), title: 'Empowering Artisans, ', title2: 'Farmers & Micro Business' },
    { image: require('../../assets/Image/welcome.png'), title: 'Empowering Artisans, ', title2: 'Farmers & Micro Business' },
  ];

  const introRef = useRef(null)

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
      </View>
      <View style={styles.middleContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <AppIntroSlider
            ref={introRef}
            data={slides}
            renderItem={({ item }) => {
              return (
                <View style={styles.mainContaint}>
                  <View>
                    <Image style={{ width: windowWidth * 0.55, height: windowWidth * 0.50, alignSelf: "center", marginVertical: 60 }} source={item.image} />
                    <Text style={{ alignSelf: "center", color: colors.statusBar, fontSize: 20, fontFamily: "Montserrat-SemiBold" }}>{item.title}</Text>
                    <Text style={{ alignSelf: "center", color: colors.statusBar, fontSize: 20, fontFamily: "Montserrat-SemiBold", }}>{item.title2}</Text>
                  </View>
                  <View style={{}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => introRef.current?.state?.activeIndex === slides.length - 1 ? navigation.navigate("Login") : introRef.current?.goToSlide(introRef.current?.state?.activeIndex + 1, true)}>
                      <Text style={{ color: "#fff", fontFamily: "Montserrat-Bold", fontSize: 16 }}>{introRef.current?.state?.activeIndex === slides.length - -1 ? "Done" : "Next"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}

            renderPagination={(activeIndex) => {
              return (
                <View style={styles.paginationContainer}>
                  <View style={styles.paginationDots}>
                    {
                      slides.map((i, index) =>
                        <View key={index} style={[styles.dot, { backgroundColor: introRef.current?.state?.activeIndex === index ? colors.statusBar : "rgba(9, 139, 233, 0.4)" }]} />
                      )
                    }
                  </View>
                </View>
              )
            }}
          />
        </ScrollView>
      </View>

    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.3,
    backgroundColor: colors.statusBar
  },
  middleContainer: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: windowHeight * -0.15
  },
  mainContaint: {
    flex: 1,
    justifyContent: "space-between"
  },
  buttonStyle: {
    width: 180,
    height: 50,
    backgroundColor: colors.statusBar,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    alignSelf: "center",
    marginTop: 130,
    marginBottom: 10

  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 120

  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },

})