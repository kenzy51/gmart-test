import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import TopnavBar from '../../components/TopnavBar';
import MapView from 'react-native-maps';

const MapComponent = () => {
  return (
    <View>
      <TopnavBar title={'Dordoi map'} from={'MapComponent'} />
      <ScrollView>
        <Text>Here should be map or coordinates</Text>
        {/* <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        /> */}
      </ScrollView>
    </View>
  );
};

export default MapComponent;
