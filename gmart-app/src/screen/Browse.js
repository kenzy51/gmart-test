import React, { useState, useEffect, } from 'react'
import { StyleSheet, Text, View, ImageBackground, ScrollView, FlatList, TouchableOpacity, Pressable } from 'react-native';
import TopnavBar from '../components/TopnavBar'
import { SearchBar } from 'react-native-elements';
import { colors } from '../constants/colors';
import FontAwesome6 from 'react-native-vector-icons/dist/FontAwesome6';
import ProductCom from '../components/ProductCom';
import { windowWidth } from '../utils/deviceInfo';
import Modal from 'react-native-modal'
import Api from '../utils/api';
import Spinner from '../components/Spinner';
import LocationModal from '../components/LocationModal';

const Browse = ({ navigation, route }) => {

  const radioButtons = [
    { id: '0', label: 'Popularity', value: 'popularity', },
    { id: '1', label: 'Price -- Low to high', value: 'LTH', },
    { id: '2', label: 'Price -- High to Low', value: 'HTL', },
    { id: '3', label: 'Alphabetical', value: 'alphabetical', },
  ]

  const listData = [
    { title: 'Sort By', icon: 'arrow-down-short-wide', onPress: () => setModalVisible(true) },
    { title: 'Location', icon: 'location-dot', onPress: () => setLocationModal(true) },
    { title: 'Category', icon: 'list', onPress: () => setCategoriesModal(true) },
  ]

  const categoriesId = route?.params?.categories._id || null
  const categoriesName = route?.params?.categories.name || ''
  const screenName = route?.params?.categories || ''
  console.log('hjaetyv', screenName)
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCategory, setSelectedCategory] = useState(categoriesId);
  const [selectedOption, setSelectedOption] = useState();
  const [searchText, setSearchText] = useState('');
  const [visible, setModalVisible] = useState(false);
  const [sortData, setSortData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [isLocationModal, setLocationModal] = useState(false);
  const [categoriesModal, setCategoriesModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState('');

  const handleSelectOption = async (sort) => {
    setSortBy(sort)
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', async () => {
      setSelectedCategory(route?.params?.categories._id || null)
      setSearchText('')
      setLocation('')
      setSortBy('popularity')
    })
    return focusListener

  }, [navigation])

  useEffect(() => {
    setLoading(true)
    const args = {}
    if (sortBy) args['sortBy'] = sortBy
    if (location) args['location'] = location
    if (selectedCategory) args['categoryId'] = selectedCategory
    if (searchText) args['search'] = searchText

    Api.getProducts(args, async (err, result) => {
      if (result && result?.data && result?.data?.products && result?.data?.products.length > 0) setSortData(result?.data?.products)
      else setSortData([])
      setModalVisible(false)
      setLoading(false)
    })
  }, [sortBy, location, selectedCategory, searchText])


  useEffect(() => {
    if (!selectedOption && radioButtons && radioButtons.length > 0) {
      setSelectedOption(radioButtons[0]?.id)
    }
  }, [radioButtons])


  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  useEffect(() => {
    Api.getCategories({}, async (err, result) => {
      if (result && result?.data && result?.data?.categories) {
        setCategories(result?.data?.categories)
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      {
        screenName === 'Home' ?
          <TopnavBar title={categoriesName ? categoriesName : 'Browse'} from={'back'} />
          :
          <TopnavBar title={categoriesName ? categoriesName : 'Browse'} from={categoriesId ? null : 'Home'} />
      }

      <SearchBar
        placeholder="Search Product"
        value={searchText}
        onChangeText={searchText => setSearchText(searchText)}
        containerStyle={{ backgroundColor: colors.statusBar, borderTopWidth: 0, borderBottomWidth: 0, paddingHorizontal: 20, paddingBottom: 16 }}
        round={true}
        inputContainerStyle={{ backgroundColor: "#fff", fontSize: 10, borderRadius: 40 }}
        inputStyle={{ marginLeft: 0 }}
        searchIcon={{ size: 30, paddingRight: 0, marginLeft: 5 }}
      />

      <View style={styles.topContaint}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal data={listData} renderItem={({ item }) => {
            return (
              <TouchableOpacity style={styles.dataShroting} onPress={() => item?.onPress && item.onPress()}>
                <FontAwesome6 style={{ marginRight: 10 }} name={item.icon} size={windowWidth * 0.04} color={"#fff"} />
                <Text style={{ color: "#fff", fontFamily: "Montserrat-SemiBold" }}>{item.title}</Text>
              </TouchableOpacity>
            )
          }} />
      </View>

      {loading ?
        <Spinner /> :
        <>
          <FlatList
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
            data={sortData} renderItem={({ item }) => <ProductCom from={"horizontolCart"} item={item} />}
            ListEmptyComponent={() => (
              <Text style={styles.notFoundText}>No products found</Text>
            )}
          />

          {/* ******************Short By****************** */}

          <Modal isVisible={visible}
            backdropOpacity={0.40}
            swipeDirection="down"
            onSwipeComplete={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.quitModel}
          >
            <Pressable style={styles.quitContaint}>
              <View style={styles.sortBy}>
                <Text style={styles.nameText}>SORT BY</Text>
              </View>
              <View style={{ marginVertical: 8, paddingBottom: 10 }}>
                {radioButtons.map((item, index) => (
                  <TouchableOpacity activeOpacity={.7} onPress={() => handleSelectOption(item.value)} style={[styles.addAddress,]} key={index}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }} >
                      <Text style={styles.nameText}>{item.label}</Text>
                      <View style={styles.radioButton} >
                        {sortBy === item.value && <View style={styles.innerCircle} />}
                      </View>
                    </View>
                  </TouchableOpacity>

                ))}
              </View>
            </Pressable>
          </Modal>
        </>
      }

      {/* ******************Category By****************** */}

      {isLocationModal &&
        <LocationModal
          location={location}
          isVisible={isLocationModal}
          onClose={() => setLocationModal(false)}
          onChange={lct => handleLocationChange(lct)}
        />
      }

      <Modal isVisible={categoriesModal}
        backdropOpacity={0.40}
        swipeDirection="down"
        onSwipeComplete={() => setCategoriesModal(false)}
        onBackdropPress={() => setCategoriesModal(false)}
        style={styles.quitModel}
      >
        <Pressable style={styles.quitContaint}>
          <View style={styles.sortBy}>
            <Text style={styles.nameText}>CATEGORY</Text>
          </View>
          <View style={{ marginVertical: 8, paddingBottom: 10 }}>
            <TouchableOpacity activeOpacity={.7} onPress={() => [setSelectedCategory(null), setCategoriesModal(false)]} style={[styles.addAddress,]}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }} >
                <Text style={styles.nameText}>All</Text>
                <View style={styles.radioButton} >
                  {selectedCategory === null && <View style={styles.innerCircle} />}
                </View>
              </View>
            </TouchableOpacity>
            {categories?.map((item, index) => (
              <TouchableOpacity activeOpacity={.7} onPress={() => [setSelectedCategory(item._id), setCategoriesModal(false)]} style={[styles.addAddress]} key={index}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }} >
                  <Text style={styles.nameText}>{item.name}</Text>
                  <View style={styles.radioButton} >
                    {selectedCategory === item._id && <View style={styles.innerCircle} />}
                  </View>
                </View>
              </TouchableOpacity>
            ))
            }
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export default Browse

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContaint: {
    backgroundColor: colors.statusBar,
    paddingHorizontal: 12,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dataShroting: {
    borderColor: "#fff",
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 7,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  quitModel: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  quitContaint: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  sortBy: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  addAddress: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    flexDirection: "row",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8
  },
  nameText: {
    color: "#000",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 4
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  notFoundText: {
    color: "#000",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
    marginTop: 20,
    textAlign: 'center'
  }
})
