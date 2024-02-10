import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  Linking,
} from 'react-native';
import TopnavBar from '../../components/TopnavBar';
import axios from 'axios';
import config from '../../../config';
import Swiper from 'react-native-swiper';
import {getFileLink} from '../../utils/backblaze';
import Badges from '../../components/Badges';
import MapView, {Marker} from 'react-native-maps';

const ManufacturerDetail = ({route}) => {
  const {manufacturerId} = route.params;
  const [manufacturer, setManufacturer] = useState(null);
  const [markers, setMarkers] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}public/getManufacturer/${manufacturerId}`)
      .then(response => {
        const data = response.data;
        if (data.success) {
          setManufacturer(data.data);
        } else {
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [manufacturerId]);
  const handleVisitWebsite = () => {
    if (manufacturer && manufacturer.website) {
      Linking.openURL(manufacturer.website);
    }
  };

  return (
    <View style={styles.container}>
      <TopnavBar title={'Manufacturer Detail'} from={'ManufacturerDetail'} />
      <View>
        {manufacturer && (
          <ScrollView>
            <View style={styles.card}>
              <Swiper style={styles.swiper} showsButtons={true}>
                {manufacturer.photos.map((photo, index) => {
                  const photoLink = getFileLink(photo.fileName);
                  return (
                    <View key={index}>
                      <Image source={{uri: photoLink}} style={styles.image} />
                    </View>
                  );
                })}
              </Swiper>
              <View style={styles.details}>
                <Text style={styles.name}> {manufacturer.name}</Text>
                <Text style={styles.description}>
                  {manufacturer.description}
                </Text>
                <Text style={styles.location}>{manufacturer.location}</Text>
                <Badges items={manufacturer.keywords} />
                {manufacturer.website && (
                  <Button onPress={handleVisitWebsite} title="Go to website" />
                )}
              </View>
              <View style={styles.mapWrapper}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: manufacturer.latitude,
                    longitude: manufacturer.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: manufacturer.latitude,
                      longitude: manufacturer.longitude,
                    }}
                    title={manufacturer.name}
                  />
                </MapView>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
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
  container: {
    flex: 1,
  },
  mapWrapper: {
    height: 280,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFill,
    flex: 1,
  },
  keywords: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  swiper: {
    height: 230,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    objectFit: 'contain',
  },
  details: {
    marginTop: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 23,
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
  location: {
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

export default ManufacturerDetail;
