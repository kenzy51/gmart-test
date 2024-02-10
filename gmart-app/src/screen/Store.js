import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import TopnavBar from '../components/TopnavBar'
import { windowWidth } from '../utils/deviceInfo'
import { colors } from '../constants/colors'
import { SearchBar } from 'react-native-elements';
import ProductCom from '../components/ProductCom'

const Store = ({ navigation }) => {

  const [searchText, setSearchText] = useState('');
  const searchData = [
    { image: require('../../assets/Image/apple.png') },
    { image: require('../../assets/Image/apple.png') },
  ]

  return (
    <View style={styles.container}>
      <TopnavBar from={'Home'} title={'My Store'} />

      <View style={styles.gmartStore}>
        <View style={styles.tStyle}>
          <Text style={{ color: "#fff", fontSize: 18, fontFamily: "Montserrat-SemiBold" }}>T</Text>
        </View>
        <Text style={{ fontSize: 20, fontFamily: "Montserrat-SemiBold", color: "#000", marginVertical: 20, alignSelf: "center", }}>Gmart Store</Text>
        <View style={{ flexDirection: "row", alignSelf: "center", }}>
          <TouchableOpacity onPress={() => navigation.navigate('AddProduct', { screenName: 'Edit Store' })} style={[styles.seeallStyle, { backgroundColor: "#fff" }]}>
            <Text style={{ color: "#000", fontSize: 12, fontFamily: "Montserrat-Regular" }}>Edit store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.seeallStyle, { backgroundColor: colors.statusBar }]}>
            <Text style={{ color: "#fff", fontSize: 12, fontFamily: "Montserrat-Regular" }}>View store</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.removeStore}>
          <Text style={{ alignSelf: "center", paddingVertical: 10, color: "grey", fontFamily: "Montserrat-Medium" }}>Remove store</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <SearchBar
          placeholder="Search Product"
          value={searchText}
          onChangeText={searchText => setSearchText(searchText)}
          containerStyle={{ backgroundColor: '#F1F1F1', borderTopWidth: 0, borderBottomWidth: 0, paddingHorizontal: 20, paddingBottom: 16, paddingTop: 40 }}
          round={true}
          inputContainerStyle={{ backgroundColor: "#fff", fontSize: 10, borderRadius: 40 }}
          searchIcon={{ size: 30, paddingRight: 0, marginLeft: 20, color: colors.statusBar }}
        />
        <Text style={{ marginHorizontal: 30, fontSize: 18, fontFamily: "Montserrat-SemiBold", marginTop: 10 }}>Product</Text>
        <FlatList
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 10, alignSelf: "center", paddingVertical: 8 }}
          data={searchData} renderItem={({ item }) => <ProductCom from={"horizontolCart"} item={item} />}
        />
      </ScrollView>
    </View>
  )
}

export default Store

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonStyle: {
    width: windowWidth - 100,
    height: 40,
    backgroundColor: colors.statusBar,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40
  },
  gmartStore: {
    backgroundColor: "#fff",
    paddingTop: 30

  },
  tStyle: {
    backgroundColor: colors.statusBar,
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    alignSelf: "center",
  },
  seeallStyle: {
    backgroundColor: colors.statusBar,
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginHorizontal: 10,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: colors.statusBar
  },
  removeStore: {
    borderTopColor: "grey",
    borderTopWidth: 0.5,
    marginTop: 30,

  }
})