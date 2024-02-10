import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import TopnavBar from '../components/TopnavBar'
import { windowWidth } from '../utils/deviceInfo'
import TextInputCom from '../components/TextInputCom'
import { colors } from '../constants/colors'

const CreateStore = () => {

  const [state, setState] = useState({
    storeName: '',
    storeAddress: '',
    storeDescription: '',
    storeType: '',
    address: '',
    city: '',
    country: '',
    courierName: '',
    Tagline: ''
  })

  return (
    <View style={styles.container}>
      <TopnavBar title={'My Store'} from={'back'} />
      <ScrollView>
        <Image style={{ alignSelf: "center", marginVertical: 20 }} source={require('../../assets/Image/mystore.png')} />
        <Text style={{ alignSelf: "center", color: "#000", fontSize: 15, fontFamily: "Montserrat-Regular" }}>This information is used to set up </Text>
        <Text style={{ alignSelf: "center", color: "#000", fontSize: 15, fontFamily: "Montserrat-Regular" }}>your shop </Text>
        <View style={styles.medalContaint}>

          <TextInputCom title={"StoreName"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Gmart Store"}
            returnKeyType={'next'}
            onChangeText={storeName => setState({ ...state, storeName })}
            value={state.storeName}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Store Web Address"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"gmart.app"}
            returnKeyType={'next'}
            onChangeText={storeAddress => setState({ ...state, storeAddress })}
            value={state.storeAddress}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Store Description"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Sell Groceries and homecare produ t"}
            returnKeyType={'next'}
            onChangeText={storeDescription => setState({ ...state, storeDescription })}
            value={state.storeDescription}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Store Type"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Groceries Store"}
            returnKeyType={'next'}
            onChangeText={storeType => setState({ ...state, storeType })}
            value={state.storeType}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Address"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"125 Crescent Ave, Woodbury"}
            returnKeyType={'next'}
            onChangeText={address => setState({ ...state, address })}
            value={state.address}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"City"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Washington"}
            returnKeyType={'next'}
            onChangeText={city => setState({ ...state, city })}
            value={state.city}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Country"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"USA"}
            returnKeyType={'next'}
            onChangeText={country => setState({ ...state, country })}
            value={state.country}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Courier Name"}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Blue Dart"}
            returnKeyType={'next'}
            onChangeText={courierName => setState({ ...state, courierName })}
            value={state.courierName}
            onSubmitEditing={() => { emailInput.focus(); }}
          />
          <TextInputCom title={"Courier Name "}
            from={"Name"}
            inputRef={(e) => { nameInput = e; }}
            placeholder={"Blue Dart"}
            returnKeyType={'next'}
            onChangeText={Tagline => setState({ ...state, Tagline })}
            value={state.Tagline}
            onSubmitEditing={() => { emailInput.focus(); }}
          />

          <TouchableOpacity style={[styles.buttonStyle]}>
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-SemiBold" }}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default CreateStore

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  medalContaint: {
    backgroundColor: "#fff",
    width: windowWidth,
    paddingVertical: 15,
    marginTop: 15
  },
  buttonStyle: {
    width: windowWidth - 80,
    height: 40,
    backgroundColor: colors.statusBar,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  }
})