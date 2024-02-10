import { StyleSheet } from 'react-native'
import React from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { windowWidth } from '../utils/deviceInfo';
import { colors } from '../constants/colors';


const Dropdown = ({ data, title }) => {
  return (
    <SelectDropdown
      defaultButtonText={title}
      buttonStyle={{ backgroundColor: colors.statusBar, width: windowWidth * 0.20, height: 30, justifyContent: "center", borderRadius: 5 }}
      buttonTextStyle={{ color: "#fff", fontSize: 15, }}
      rowTextStyle={{ color: "#000", fontSize: 14, }}
      rowStyle={{ backgroundColor: "#fff", width: windowWidth * 0.20, height: 30, alignItems: "center" }}
      data={data}
      dropdownStyle={{ height: 100, color: "#000" }}
      dropdownIconPosition={"right"}
      onSelect={(selectedItem, index) => {
        console.log(selectedItem, index)
      }}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem
      }}
      rowTextForSelection={(item, index) => {
        return item
      }}
      renderDropdownIcon={() => {
        return <MaterialIcons style={styles.pluseIcon} name={'arrow-drop-down'} size={30} color={"#fff"} />
      }}
    />
  )
}

export default Dropdown

const styles = StyleSheet.create({})