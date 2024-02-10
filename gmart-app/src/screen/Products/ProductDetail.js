import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  Linking,
  TouchableOpacity,
} from 'react-native';
import TopnavBar from '../../components/TopnavBar';
import axios from 'axios';
import config from '../../../config';
import Swiper from 'react-native-swiper';
import {getFileLink} from '../../utils/backblaze';

const ProductDetail = ({route, navigation}) => {
  const {productId} = route.params;
  const [product, setProduct] = useState(null);
  useEffect(() => {
    axios
      .get(`${config.apiUrl}public/getProductDetails/${productId}`)
      .then(response => {
        const data = response.data;
        if (data.success) {
          setProduct(data.data);
        } else {
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [productId]);
  return (
    <View>
      <TopnavBar title={'Product Detail'} from={'ProductDetail'} />
      <ScrollView>
        {product && (
          <View style={styles.card}>
            {/* <Swiper style={styles.swiper} showsButtons={true}> */}
            {/* {product.photos.map((photo, index) => (
                <View key={index}>
                  <Image source={{uri: photo}} style={styles.image} />
                </View>
              ))} */}
            {/* </Swiper> */}
            {product.photos.map((photo, index) => {
              const photoLink = getFileLink(photo.fileName);
              return (
                <View key={index}>
                  <Image source={{uri: photoLink}} style={styles.image} />
                </View>
              );
            })}
            <View style={styles.details}>
              <Text style={styles.name}>Name: {product.name}</Text>
              <Text style={styles.name}>Location: {product.location}</Text>
              <Text style={styles.name}>Prict: {product?.price}</Text>
              <Text style={styles.description}>{product.description}</Text>
              {/* <Button
                title={product.manufacturerId?.name.toString()}
                onPress={() =>
                  navigation.navigate('ManufacturerDetail', {
                    manufacturerId: product.manufacturerId._id,
                  })
                }
              /> */}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    padding: 10,
  },
  swiper: {
    height: 160,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  details: {
    marginTop: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: '#108ee9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 4,
    marginRight: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ProductDetail;
