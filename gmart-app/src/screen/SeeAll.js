import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React from 'react'
import TopnavBar from '../components/TopnavBar'
import ProductCom from '../components/ProductCom'
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getPopularProducts } from '../components/redux/actions';

const SeeAll = (props) => {

  const screenName = props?.route?.params?.screenName
  const type = props?.route?.params?.type
  const app = useSelector(state => state.app)

  const products = type && type == 'product' ? app.products : app.popularProducts
  const totalProduct = type && type == 'product' ? app.totalProduct : app.totalPopularProduct
  const loading = type && type == 'product' ? app.loading : app.popularLoading
  const refreshing = type && type == 'product' ? app.refreshing : app.popularRefreshing

  const dispatch = useDispatch();

  const load = () => {
    if (loading || refreshing || products.length >= totalProduct) {
      return;
    }
    type == 'product' ?
      dispatch(getProducts({ limit: 10, skip: products.length }, false)) :
      dispatch(getPopularProducts({ limit: 10, skip: products.length }, false))
  }

  const renderFooter = () => {
    console.log("loading", loading)
    if (!loading || (loading && products.length === 0)) return null

    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={'large'} color={"#000"} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TopnavBar from={'back'} title={screenName} />

      <FlatList
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, alignSelf: "center", paddingVertical: 8 }}
        data={products}
        renderItem={({ item }) => <ProductCom from={"horizontolCart"} item={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={() => load()}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={type == 'product' ? () => dispatch(getProducts({ limit: 10, skip: 0 }, true)) : () => dispatch(getPopularProducts({ limit: 10, skip: 0 }, true))}
          />
        }
        ListFooterComponent={() => renderFooter()}
      />
    </View>
  )
}

export default SeeAll

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingWrapper: {
    marginBottom: 10
  }
})