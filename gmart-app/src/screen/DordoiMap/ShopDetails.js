import { View } from "react-native";
import TopnavBar from "../../components/TopnavBar";
import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { Text } from "react-native-elements";

const ShopDetails = ({ navigation }) => {
    return (
        <View>
            <TopnavBar title={"Shop Details"}/>
            <View style={styles.container}>
                <Text style={styles.titleStyle}>
                    Container
                </Text>
            </View>
        </View>
    )
};

export default ShopDetails;


const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
    },
    buttonStyle: {
        width: 100,
        height: 40,
        marginHorizontal: 20,
        backgroundColor: colors.statusBar,
        alignSelf: "center",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    titleStyle: {
        color: colors.black,
        marginHorizontal: 20,
        fontSize: 14,
        marginBottom: 0,
        fontFamily: "Montserrat-Regular"
    },
})