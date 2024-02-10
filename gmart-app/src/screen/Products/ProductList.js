import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';
import TopnavBar from '../../components/TopnavBar';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import config from '../../../config';
import {useIsFocused} from '@react-navigation/native';
import {colors} from '../../constants/colors';
import {getFileLink} from '../../utils/backblaze';

const ProductList = ({navigation}) => {
  const [products, setProducts] = useState([
    // {name: 'name', description: 'description'},
    // {name: 'name', description: 'description'},
  ]);
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useSelector(state => state.app);
  const isFocused = useIsFocused();

  useEffect(() => {
    axios
      .get(`${config.apiUrl}public/getProducts`)
      .then(response => {
        const data = response.data;
        console.log(data, 'rendering productList');
        if (data.success) {
          setProducts(data.Products);
        } else {
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <TopnavBar title={'Products List'} from={'Products'} />
      <Button
        onPress={() =>
          navigation.navigate('ProductAdd', {
            screen: 'ProductAdd',
          })
        }
        title="Add product"
        color={colors.black}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <Spinner size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.innerBlock}>
          {products.map(product => (
            <TouchableOpacity
              style={{color: colors.darkGray}}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productId: product._id,
                })
              }
              key={product.name}>
              <View key={product._id} style={styles.productContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>
                  description:
                  {` ` + product.description.slice(0, 40) + '...'}
                </Text>
                {/* <Text style={styles.price}>
                  price:{` ` + product.price}
                </Text> */}
                {product.photos.map(photo => {
                  const link = getFileLink(photo.fileName);
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductDetail', {
                          productId: product._id,
                        })
                      }>
                      <Image
                        style={{
                          width: '100%',
                          height: 180,
                          marginHorizontal: 7,
                          borderRadius: 10,
                        }}
                        source={{uri: link}}></Image>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerBlock: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  productContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.black,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.darkGray,
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: colors.blue,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  price: {
    fontSize: 19,
    color: colors.darkGray,
  },
});
