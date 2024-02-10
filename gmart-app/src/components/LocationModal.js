import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Modal from 'react-native-modal';
import { colors } from '../constants/colors';
import config from '../../config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { windowHeight } from '../utils/deviceInfo';

const LocationModal = ({ isVisible, onClose, onChange, location }) => {
  const addressRef = useRef();

  useEffect(() => {
    addressRef?.current?.setAddressText(location)
  }, [])

  const updateLocation = (lct) => {
    setTimeout(() => {
      onChange(lct);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
      backdropOpacity={0.40}
      style={styles.quitModel}
      animationInTiming={300}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.quitContaint}>
          <Text style={styles.titleText}>Location</Text>
          <Text style={styles.infoText}>Change your location to see Lovxo members in other cities</Text>
          <GooglePlacesAutocomplete
            ref={addressRef}
            placeholder={'Location'}
            minLength={2}
            returnKeyType={'search'}
            listViewDisplayed={false}
            fetchDetails={true}
            onPress={(data) => {
              data.description &&
                updateLocation(data.description)
            }}
            query={{
              key: config.google.apiKey,
              language: 'en',
            }}
            styles={{
              textInputContainer: styles.locationInputContainer,
              textInput: styles.locationInput
            }}
            enablePoweredByContainer={false}
            debounce={200}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default LocationModal

const styles = StyleSheet.create({
  quitModel: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  quitContaint: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    height: windowHeight * 0.4
  },
  locationInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.statusBar,
    borderRadius: 24,
  },
  locationInput: {
    position: 'relative',
    backgroundColor: 'transparent',
    fontSize: 16,
    color: colors.black,
    paddingHorizontal: 15,
  },
  locationBtnStyle: {
    position: 'relative',
    height: 35,
    width: 100,
    borderRadius: 5,
    alignSelf: 'center',
    paddingLeft: 10,
    marginTop: 15
  },
  locationBtnTextStyle: {
    width: 'auto',
    color: colors.statusBar
  },
  titleText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
    fontFamily: "Montserrat-SemiBold",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray,
    marginTop: 5,
    marginBottom: 12,
    fontFamily: "Montserrat-SemiBold",
  },
});