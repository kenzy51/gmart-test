import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React from 'react'
import TopnavBar from '../components/TopnavBar'
import { colors } from '../constants/colors'
import FontAwesome6 from 'react-native-vector-icons/dist/FontAwesome6';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ProductCom from '../components/ProductCom';

const MoreCategories = ({ route }) => {

  const name = route?.params?.item?.title

  const popularProduct = [
    { image: require('../../assets/Image/chocolate.png') },
    { image: require('../../assets/Image/chocolate.png') },
    { image: require('../../assets/Image/chocolate.png') },
    { image: require('../../assets/Image/chocolate.png') },
    { image: require('../../assets/Image/chocolate.png') },
  ]

  return (
    <View style={styles.container}>
      <TopnavBar title={name} from={'back'} />
      <View style={styles.topContaint}>
        <TouchableOpacity style={styles.dataShroting}>
          <FontAwesome6 style={{ marginRight: 7 }} name={'arrow-down-short-wide'} size={16} color={"#fff"} />
          <Text style={{ color: "#fff", fontFamily: "Montserrat-SemiBold" }}>Sort By</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dataShroting}>
          <Entypo style={{ marginRight: 7 }} name={'location-pin'} size={22} color={"#fff"} />
          <Text style={{ color: "#fff", fontFamily: "Montserrat-SemiBold" }}>Sort By</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dataShroting}>
          <FontAwesome5 style={{ marginRight: 7 }} name={'th-list'} size={16} color={"#fff"} />
          <Text style={{ color: "#fff", fontFamily: "Montserrat-SemiBold" }}>Sort By</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, alignSelf: "center", paddingVertical: 8 }}
        data={popularProduct} renderItem={({ item }) => <ProductCom from={"horizontolCart"} item={item} />}
      />

    </View>
  )
}

export default MoreCategories

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContaint: {
    backgroundColor: colors.statusBar,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dataShroting: {
    borderColor: "#fff",
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center"

  }
})