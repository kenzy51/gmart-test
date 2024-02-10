import { StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { colors } from "../constants/colors";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const KeywordBadge = ({
    text,
    badgeStyle,
    textStyle,
    adjustWidth,
    touchable,
    onPressBadge,
}) => {

    const [isPressed, setIsPressed] = useState(false);

    const fontSize = textStyle ? textStyle.fontSize : styles.text.fontSize;
    const averageWidth = fontSize * (text.length * 1.2) ;
    const badgeWidth = adjustWidth ? averageWidth * adjustWidth : averageWidth;

    const view = touchable ?
        (<TouchableOpacity
            style={[styles.badge, badgeStyle, { width: badgeWidth, backgroundColor: isPressed ? colors.statusBar : 'silver' }]}
            onPress={()=>{
                setIsPressed(!isPressed);
                onPressBadge();
            }}
            >
            <Text style={[styles.text, textStyle]}>
                {text}
            </Text>
        </TouchableOpacity>)
        :
        (<View style={[styles.badge, badgeStyle, { width: badgeWidth }]}>
            <Text style={[styles.text, textStyle]}>
                {text}
            </Text>
        </View>)

    return view;

}

const styles = StyleSheet.create({
    badge: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.statusBar,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 100,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
    }
});

export default KeywordBadge;