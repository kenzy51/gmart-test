import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  Pressable,
} from 'react-native';
import TopnavBar from '../../components/TopnavBar';
import axios from 'axios';
import config from '../../../config';
import Spinner from '../../components/Spinner';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {getFileLink} from '../../utils/backblaze';
import {colors} from '../../constants/colors';

const Manufacturers = ({navigation}) => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useSelector(state => state.app);
  const isFocused = useIsFocused();

  useEffect(() => {
    axios
      .get(`${config.apiUrl}public/getManufacturers`)
      .then(response => {
        const data = response.data;
        console.log(data, 'manufactory');
        if (data.success) {
          setManufacturers(data.manufacturers);
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
      <TopnavBar title={'Manufacturers List'} from={'Manufacturers'} />
      {user && user.token && (
        <Pressable
          style={styles.topButton}
          onPress={() =>
            navigation.navigate('AddManufacturer', {
              screen: 'AddManufacturer',
            })
          }>
          <Text style={styles.topButtonText}>Add manufacturer</Text>
        </Pressable>
      )}
      {user && !user.token && (
        <Text style={{color: colors.darkGray}}>
          To enable creation of manufacturer, please log in
        </Text>
      )}
      {loading ? (
        <View style={styles.loaderContainer}>
          <Spinner size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.innerBlock}>
          {manufacturers.map(manufacturer => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ManufacturerDetail', {
                  manufacturerId: manufacturer._id,
                })
              }
              key={manufacturer}>
              <View key={manufacturer._id} style={styles.manufacturerContainer}>
                {manufacturer.photos.map(photo => {
                  const link = getFileLink(photo.fileName);
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ManufacturerDetail', {
                          manufacturerId: manufacturer._id,
                        })
                      }>
                      <Image
                        style={styles.manufacturerImage}
                        source={{uri: link}}></Image>
                    </TouchableOpacity>
                  );
                })}
                <View style={styles.manufacturerContent}>
                  <Text style={styles.manufacturerName}>
                    {manufacturer.name}
                  </Text>
                  <Text style={styles.manufacturerDescription}>
                    {manufacturer.description.slice(0, 45) + '...'}
                  </Text>
                  {manufacturer.comment ? (
                    <View>
                      <View style={styles.manufacturerCommentRow}>
                        <Image
                          source={require('../../../assets/Image/comment.png')}
                          style={styles.manufacturerCommentImage}
                        />
                        <View style={styles.manufacturerCommentLine} />
                      </View>
                      <Text style={styles.manufacturerComment}>
                        {manufacturer.comment.slice(0, 100) + '...'}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Manufacturers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paleGray,
  },
  topButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  topButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: colors.statusBar,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paleGray,
  },
  innerBlock: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  manufacturerContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 0.6,
    borderRadius: 26,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    elevation: 2, // for shadow (Android)
    shadowColor: '#000', // for shadow (iOS)
    shadowOpacity: 0.2, // for shadow (iOS)
    shadowOffset: {width: 0, height: 2}, // for shadow (iOS)
  },
  manufacturerContent: {
    marginTop: 6,
  },
  manufacturerImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
  },
  manufacturerName: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: colors.black,
  },
  manufacturerDescription: {
    fontSize: 12,
    marginBottom: 5,
    color: colors.black,
  },
  manufacturerCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manufacturerCommentImage: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  manufacturerCommentLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  manufacturerComment: {
    fontSize: 12,
    marginBottom: 5,
    color: colors.black,
  },
});
