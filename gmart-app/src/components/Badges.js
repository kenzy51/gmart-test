import { StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import KeywordBadge from "./KeywordBadge";
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";

const Badges = ({
    items,
    badgeStyle,
    textStyle,
    adjustWidth,
    style,
    touchable,
    onPressBadge,
    alignWidth,
}) => {

    const calculateBadgeWidth = (text) => {
        const fontSize = textStyle?.fontSize ? textStyle.fontSize : 18;
        const averageWidth = fontSize * (text.length * 1.3);
        const badgeWidth = adjustWidth ? averageWidth * adjustWidth : averageWidth;

        return badgeStyle?.marginHorizontal ? badgeWidth * (1 + badgeStyle.marginHorizontal / badgeWidth) : badgeWidth * (1 + 5 / badgeWidth);
    }

    const calculateBadgeHeight = () => {
        const fontSize = textStyle?.fontSize ? textStyle.fontSize : 18;
        return fontSize;
    }

    let begEnd = [];

    const measureRef = useRef(null);

    const collect = () => {
        const width = alignWidth ? alignWidth : 200;
        let sum = 0;
        let last = 0;
        let list = [];
        for (let i = 0; i < items.length; i++) {
            const badgeWidth = calculateBadgeWidth(items[i])
            if (sum + badgeWidth < width)
                sum += badgeWidth;
            else {
                list.push({
                    beg: last,
                    end: i,
                })
                sum = 0;
                last = i;
            }
        }

        if (items.length - last != 0)
            list.push({
                beg: last,
                end: items.length,
            });

        begEnd = list;
    };

    collect();

    return (
        <View
            style={style}
            ref={measureRef}
            onLayout={(event) => { }}
        >
            {
                begEnd.map((begEndItem) => (
                    <View
                        style={{
                            height: calculateBadgeHeight() * 2.5,
                            flexDirection: 'row',
                        }}
                    >
                        {
                            items.slice(begEndItem.beg, begEndItem.end).map((item, index) => {
                                return <KeywordBadge text={item} badgeStyle={badgeStyle} textStyle={textStyle} touchable={touchable} onPressBadge={() => onPressBadge(index + begEndItem.beg)}/>
                            })
                        }
                    </View>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({

});

export default Badges;