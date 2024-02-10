import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import TopnavBar from '../components/TopnavBar';
import {colors} from '../constants/colors';
import {windowWidth} from '../utils/deviceInfo';
import ProductCom from '../components/ProductCom';
import Carousel from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBanner,
  getCategories,
  getProducts,
  getPopularProducts,
} from '../components/redux/actions';
import Spinner from '../components/Spinner';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const Home = ({navigation}) => {
  const carouselRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const {
    banner,
    categories,
    products,
    popularProducts,
    loading,
    popularLoading,
    bannerloading,
  } = useSelector(state => state.app);

  useEffect(() => {
    const getData = () => {
      dispatch(getBanner(false));
      dispatch(getCategories());
      dispatch(getProducts({limit: 10, skip: 0}, false));
      dispatch(
        getPopularProducts({type: 'popular', limit: 10, skip: 0}, false),
      );
    };

    return getData();
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <FastImage
          resizeMode="stretch"
          style={styles.imageStyle}
          source={{uri: item?.photo}}>
          <View style={styles.bannerOuterWrapper}>
            <Text style={styles.readtTextStyle}>{item?.title}</Text>
            <TouchableOpacity
              style={styles.startContaint}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Browse')}>
              <Text style={{color: '#fff', fontFamily: 'Montserrat-SemiBold'}}>
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </FastImage>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopnavBar title={'Data collector'} from={'Home'} />
      {loading || popularLoading || bannerloading ? (
        <Spinner />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate('Browse')}
            activeOpacity={1}>
            <View style={styles.searchContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Browse', {categories: 'Home'})
                }
                style={styles.searchBar}>
                <Ionicons
                  style={{marginRight: 10}}
                  name={'search-sharp'}
                  size={28}
                  color={'grey'}
                />
                <Text style={{color: 'grey', fontSize: 19}}>
                  Search Products
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{paddingBottom: '100%'}}>
            <View style={styles.bannerWrapper}>
              <Carousel
                ref={carouselRef}
                sliderWidth={windowWidth}
                itemWidth={windowWidth * 0.8}
                data={banner}
                renderItem={item => renderItem(item)}
                hasParallaxImages={true}
                loop={true}
                autoplayInterval={4000}
                autoplay={true}
                enableMomentum={true}
                decelerationRate={1.7}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
              />
            </View>
            <View style={styles.cardSection}>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => navigation.navigate('Manufacturers')}>
                <Text style={styles.cardText}>Manufacturers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => navigation.navigate('ProductList')}>
                <Text style={styles.cardText}>Product</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() =>
                  navigation.navigate('DordoiStack', {screen: 'DordoiMap'})
                }>
                <Text style={styles.cardText}>Dordoi Map</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() =>
                  navigation.navigate('RequestList', {screen: 'RequestList'})
                }>
                <Text style={styles.cardText}>Request</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: colors.statusBar,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchBar: {
    width: windowWidth * 0.9,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  item: {
    width: windowWidth * 0.765,
    height: windowWidth * 0.38,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f1f3',
    marginTop: 15,
  },
  imageStyle: {
    // width: "100%",
    height: windowWidth * 0.38,
    justifyContent: 'center',
  },
  bannerWrapper: {
    width: windowWidth,
    borderRadius: 8,
  },
  bannerOuterWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  searchWrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  readtTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'capitalize',
  },
  startContaint: {
    width: windowWidth * 0.35,
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 3,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  wrapContaint: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  productContaint: {
    width: windowWidth * 0.244,
    height: 90,
    backgroundColor: '#f0f1f3',
    marginHorizontal: 1,
    marginVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  seeallContaint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  seeallStyle: {
    backgroundColor: colors.statusBar,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  backgroundColor: {
    backgroundColor: colors.statusBar,
    width: windowWidth,
    marginTop: 30,
  },
  cardSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cardContainer: {
    width: '48%', // Adjust as needed to fit 2 cards in a row
    height: '155%', // Set your desired height
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // for shadow (Android)
    shadowColor: '#000', // for shadow (iOS)
    shadowOpacity: 0.2, // for shadow (iOS)
    shadowOffset: {width: 0, height: 2}, // for shadow (iOS)
  },
  cardText: {
    color: colors.darkGray, // added this style, in android mobile text was transparent
  },
});
