import { StyleSheet, View, FlatList, Text } from 'react-native'
import React from 'react'
import TopnavBar from '../components/TopnavBar'
import ProductCom from '../components/ProductCom'
import { useSelector } from 'react-redux'
import { colors } from 'react-native-elements'

const Wishlist = () => {
  const { wishListProduct } = useSelector(state => state.app)

  return (
    <View style={styles.container}>
      <TopnavBar title={'Wishlist'} from={'back'} />
      <FlatList
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No wishlist products found</Text>}
        data={wishListProduct} renderItem={({ item }) => <ProductCom from={"horizontolCart"} item={item} />}
      />
    </View>
  )
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "Montserrat-Medium",
    textAlign: 'center',
    margin: 20,
  }
})