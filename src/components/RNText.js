import { View, Text, useWindowDimensions, Platform, PixelRatio, Dimensions } from 'react-native'
import React from 'react'
import { tabView } from '../utils/DeviceType';
import { useTheme } from 'react-native-paper';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');
// based on iphone 5s's scale

const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export const RNText = (props) => {
    const { fontScale } = useWindowDimensions();
    let title = props.title ? props.title : ""
    let variant = props.variant
    const theme = useTheme()



    return (
        <View style={{
            // padding: 3,
        }} >
            {tabView ?
                <View>
                    <Text
                        numberOfLines={props?.numberOfLines}
                    
                        style={{
                            fontSize:
                                variant == "bodySmall" ? props.fontSize ? props.fontSize / fontScale : 12 / fontScale :
                                    variant == "bodyMedium" ? props.fontSize ? props.fontSize / fontScale : 14 / fontScale :
                                        variant == "bodyLarge" ? props.fontSize ? props.fontSize / fontScale : 16 / fontScale :
                                            variant == "titleSmall" ? props.fontSize ? props.fontSize / fontScale : 14 / fontScale :
                                                variant == "titleMedium" ? props.fontSize ? props.fontSize / fontScale : 16 / fontScale :
                                                    variant == "titleLarge" ? props.fontSize ? props.fontSize / fontScale : 19 / fontScale :
                                                        (props.fontSize ? props.fontSize / fontScale : 14 / fontScale),
                            color: props.color ? props.color : theme.colors.onBackground,
                            textAlign: props.textAlign,
                            padding: props.padding,
                            width: props.width,
                            top: props.top,
                            bottom: props.bottom,
                            right: props.right,
                            left: props.left,
                            lineHeight: props.lineHeight,
                            fontFamily:"Roboto_Slab",
                            fontWeight:
                                variant == "bodySmall" ? (props.fontWeight ? props.fontWeight : "normal") :
                                    variant == "bodyMedium" ? (props.fontWeight ? props.fontWeight : "normal") :
                                        variant == "bodyLarge" ? (props.fontWeight ? props.fontWeight : "normal") :
                                            variant == "titleSmall" ? (props.fontWeight ? props.fontWeight : "normal") :
                                                variant == "titleMedium" ? (props.fontWeight ? props.fontWeight : "400") :
                                                    variant == "titleLarge" ? (props.fontWeight ? props.fontWeight : "600") : props.fontWeight ? props.fontWeight : "normal"
                        }}>{title}</Text>
                </View>
                :
                <View>
                    <Text
                        numberOfLines={props?.numberOfLines}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={1}
                        maxFontSizeMultiplier={1}
                        allowFontScaling={true}
                        style={{
                            fontFamily:"Roboto_Slab",
                            fontSize:
                                variant == "bodySmall" ? props.fontSize ? normalize(5) : normalize(5) :
                                    variant == "bodyMedium" ? props.fontSize ? normalize(7) : normalize(7) :
                                        variant == "bodyLarge" ? props.fontSize ? normalize(9) : normalize(9) :
                                            variant == "titleSmall" ? props.fontSize ? normalize(7) : normalize(7) :
                                                variant == "titleMedium" ? props.fontSize ? normalize(9) : normalize(9) :
                                                    variant == "titleLarge" ? props.fontSize ? normalize(11) : normalize(11) :
                                                        props.fontSize ? normalize(9) : normalize(8),
                            color: props.color ? props.color : theme.colors.onBackground,
                            textAlign: props.textAlign,
                            padding: props.padding,
                            width: props.width,
                            top: props.top,
                            bottom: props.bottom,
                            right: props.right,
                            left: props.left,
                            lineHeight: props.lineHeight,
                            fontWeight:
                                variant == "bodySmall" ? (props.fontWeight ? props.fontWeight : "normal") :
                                    variant == "bodyMedium" ? (props.fontWeight ? props.fontWeight : "normal") :
                                        variant == "bodyLarge" ? (props.fontWeight ? props.fontWeight : "normal") :
                                            variant == "titleSmall" ? (props.fontWeight ? props.fontWeight : "normal") :
                                                variant == "titleMedium" ? (props.fontWeight ? props.fontWeight : "400") :
                                                    variant == "titleLarge" ? (props.fontWeight ? props.fontWeight : "600") : props.fontWeight ? props.fontWeight : "normal"
                        }}>{title}</Text>
                </View>
            }

        </View>
    )
}

