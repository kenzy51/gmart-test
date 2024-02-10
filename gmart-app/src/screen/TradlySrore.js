import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import TopnavBar from '../components/TopnavBar'
import { colors } from '../constants/colors'
import { windowWidth } from '../utils/deviceInfo'
import { FlatList } from 'react-native'
import ProductCom from '../components/ProductCom'


const GmartSrore = () => {

  const productList = [
    { title: 'All Product' },
    { title: 'Fruit' },
    { title: 'Vegetables' },
    { title: 'Homecare' },
    { title: 'All Product' },
  ]

  const searchData = [
    { image: require('../../assets/Image/apple.png') },
    { image: require('../../assets/Image/apple.png') },
    { image: require('../../assets/Image/apple.png') },
    { image: require('../../assets/Image/apple.png') },
    { image: require('../../assets/Image/apple.png') },
    { image: require('../../assets/Image/apple.png') },
  ]

  return (
    <View style={styles.container}>
      <TopnavBar from={'back'} title={'Trandly Store'} />
      <ScrollView>
        <View style={styles.topContaint}>
          <View style={styles.profileContaint}>
            <View style={styles.tStyle}>
              <Text style={{ color: "#fff", fontSize: 30, fontFamily: "Montserrat-SemiBold" }}>T</Text>
            </View>
            <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
              <View>
                <Text style={{ color: "#000", fontSize: 16, fontFamily: "Montserrat-Regular" }}>Gmart Store</Text>
                <Text style={{ color: "grey", fontSize: 15, marginVertical: 5, fontFamily: "Montserrat-Regular" }}>gmart.app</Text>
              </View>
              <TouchableOpacity style={[styles.buttonStyle]}>
                <Text style={{ color: "#fff", fontSize: 13, fontFamily: "Montserrat-Bold" }}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ paddingTop: 30, paddingBottom: 15 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue nunc vel rhoncus, sed. Neque hendrerit risus ut metus ultrices ac. Dui morbi eu amet id mauris. Eget at ut.</Text>
        </View>

        <View style={[styles.topContaint, { marginVertical: 10, flexDirection: "row", justifyContent: "space-between", borderRadius: 15 }]}>
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ color: "#000", fontFamily: "Montserrat-Regular" }}>Total Followers</Text>
            <Text style={{ color: "#000", alignSelf: "center", fontFamily: "Montserrat-Regular" }}>0</Text>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ color: "#000", fontFamily: "Montserrat-Regular" }}>Total Followers</Text>
            <Text style={{ color: "#000", alignSelf: "center", fontFamily: "Montserrat-Regular" }}>0</Text>
          </View>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: 7 }}
          horizontal data={productList} renderItem={({ item }) => {
            return (
              <TouchableOpacity style={styles.listStyle}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )
          }} />

        <FlatList
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 10, alignSelf: "center", paddingVertical: 8 }}
          data={searchData} renderItem={({ item }) => <ProductCom from={"horizontolCart"} item={item} />}
        />

      </ScrollView>
    </View>
  )
}

export default GmartSrore

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContaint: {
    backgroundColor: '#fff',
    width: windowWidth,
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  profileContaint: {
    flexDirection: "row",
    paddingTop: 30,
    alignItems: "center",

  },
  tStyle: {
    backgroundColor: colors.statusBar,
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 25,
  },
  buttonStyle: {
    height: 25,
    paddingHorizontal: 20,
    backgroundColor: colors.statusBar,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
  },
  listStyle: {
    borderWidth: 0.5,
    borderColor: colors.statusBar,
    paddingHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 7
  }
})