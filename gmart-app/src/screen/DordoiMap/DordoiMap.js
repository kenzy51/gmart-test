import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { enableLatestRenderer } from 'react-native-maps';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import TopnavBar from '../../components/TopnavBar';
import { useEffect, useRef, useState } from 'react';
import Api from '../../utils/api';
import { colors } from '../../constants/colors';
import { getFileLink } from '../../utils/backblaze';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { Text } from 'react-native-elements';
import { Image } from 'react-native-elements';
import Badges from '../../components/Badges';
import { useIsFocused } from '@react-navigation/native';


enableLatestRenderer();

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        top: '100%',
        height: height,
        width: width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        ...StyleSheet.absoluteFill,
        flex: 1,
    },
    popup: {
        width: 300,
        height: 410,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3, // for shadow (Android)
        shadowColor: '#000', // for shadow (iOS)
        shadowOpacity: 0.2, // for shadow (iOS)
        shadowOffset: { width: 0, height: 2 }, // for shadow (iOS)
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    carousel: {
        flex: 1,
        width: 1000,
    },
    indexButton: {
        borderRadius: 100,
        backgroundColor: colors.statusBar,
        width: 50,
        height: 50,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleStyle: {
        color: "grey",
        marginHorizontal: 20,
        marginVertical: 3,
        fontSize: 19,
        fontFamily: "Montserrat-Regular"
    },
});


const DordoiMap = ({ navigation }) => {

    const [shopsData, setShopsData] = useState(null);
    let [markers, setMarkers] = useState(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        const fetch = async () => {
            Api.getShops((err, res) => {
                if (err !== null) console.log('Error fetching data');
                if (res !== null) {
                    setShopsData(res.data.shops);

                    setMarkers(res.data.shops.map((item, index) => {
                        return {
                            name: item.container,
                            coordinates: {
                                latitude: item.latitude,
                                longitude: item.longitude,
                            },
                        }
                    })
                    );
                }
            })
        }

        fetch();
    }, [navigation, isFocused]);

    const [currentShopId, setCurrentShopId] = useState(-1);

    const [region, setRegion] = useState({
        latitude: 42.882882,
        longitude: 74.6051,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const DrawMarkers = () => {
        const view = markers ? markers.map((item, index) =>
        (<Marker
            coordinate={item.coordinates}
            title={item.name}
            onPress={() => setCurrentShopId(index)}
        />)) : null;
        return view;
    }


    const ShowShop = () => {
        let shop = null;
        if (currentShopId != -1)
            shop = shopsData[currentShopId];

        return currentShopId != -1 &&
            <View style={styles.popup}>
                <View style={{
                    ...StyleSheet.absoluteFill,
                    flex: 1,
                }}>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >

                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                left: 10,
                            }}
                            onPress={() => { setCurrentShopId(-1) }}
                        >
                            <MaterialIcons name={"close"} size={25} color={colors.statusBar} />
                        </TouchableOpacity>
                        <Text style={styles.titleStyle}>
                            {
                                shop.container
                            }
                        </Text>
                    </View>
                    <View>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                alignItems: 'center',
                                margin: 10,
                            }}

                        >
                            {
                                shop.photos.map((photo) => {
                                    const link = getFileLink(photo.fileName);
                                    //console.log('link: ', link);
                                    return (<TouchableOpacity>
                                        <Image
                                            style={{
                                                width: 70,
                                                height: 80,
                                                marginHorizontal: 7,
                                                borderRadius: 10,
                                            }}
                                            source={{ uri: link }}
                                        >
                                        </Image>
                                    </TouchableOpacity>)
                                })
                            }
                        </ScrollView>
                    </View>
                    <Badges
                        items={shop.keywords}
                        textStyle={{
                            fontSize: 10,
                        }}
                        style={{
                            margin: 10,
                        }}
                    />
                    <View>
                        <Text style={{
                            fontFamily: "Montserrat-Regular",
                            marginHorizontal: 10,
                        }}>
                            Description
                        </Text>
                        <View style={{
                            height: 70,
                            marginHorizontal: 20,
                        }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: "Montserrat-Regular",
                                }}>
                                    {shop.description ? shop.description : "no description"}
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            alignContent: 'space-around',
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            style={styles.indexButton}
                            onPress={() => {
                                //previous
                                let id = currentShopId;
                                if (id - 1 == -1)
                                    id = shopsData.length - 1;
                                else
                                    id -= 1
                                setCurrentShopId(id);
                            }}
                        >
                            <MaterialIcons name={"chevron-left"} size={45} color={"#fff"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.indexButton}
                            onPress={() => {
                                //next
                                let id = currentShopId;
                                if (id + 1 == shopsData.length)
                                    id = 0;
                                else
                                    id += 1
                                setCurrentShopId(id);
                            }}
                        >
                            <MaterialIcons name={"chevron-right"} size={45} color={"#fff"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>;
    }


    return (
        <View>
            <TopnavBar title={'Dordoi Map'} from={'DordoiMap'} />
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={region}
                >
                    <DrawMarkers />
                </MapView>
                <ShowShop />
            </View>
        </View>
    )
}

export default DordoiMap;
