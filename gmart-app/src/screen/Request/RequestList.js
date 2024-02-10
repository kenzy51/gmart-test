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

const RequestList = ({navigation}) => {
  const [Requests, setRequests] = useState([]);
  // const [Requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useSelector(state => state.app);
  const isFocused = useIsFocused();

  useEffect(() => {
    axios
      .get(`${config.apiUrl}public/getRequests`)
      .then(response => {
        const data = response.data.requests;
        setRequests(data);
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
      <TopnavBar title={'Requests List'} from={'Requests'} />
      <Button
        onPress={() =>
          navigation.navigate('Request', {
            screen: 'Request',
          })
        }
        title="Add Request"
        color={colors.black}
      />

      <ScrollView style={styles.innerBlock}>
        {Requests.map(request => (
          <TouchableOpacity key={request.name}>
            <View key={request._id} style={styles.requestContainer}>
              <Text style={styles.requestName}>{request.title}</Text>
              <Text style={styles.requestDescription}>
                Request description:
                {` ` + request.requestDescription.slice(0, 40) + '...'}
              </Text>
              {request.photos.map(photo => {    
                const link = getFileLink(photo.fileName);
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('RequestDetail', {
                        requestId: request._id,
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
    </View>
  );
};

export default RequestList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerBlock: {
    paddingHorizontal: 10,
    // paddingVertical: 20,
  },
  requestContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
  },
  requestName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.black,
  },
  requestDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.darkGray,
  },
  requestImage: {
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
