import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'

const Skeleton = (props) => {
    const opacity = useRef(new Animated.Value(0.3))

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 500,
                }),
                Animated.timing(opacity.current, {
                    toValue: 0.3,
                    useNativeDriver: true,
                    duration: 500,
                })
            ])).start()
    }, [opacity])

    return (
        <View>
            <Animated.View style={{
                opacity: opacity.current,
                height: props?.height,
                width: props?.width,
                backgroundColor: "lightgray",
                borderRadius: props?.borderRadius
            }}>

            </Animated.View>
            

        </View>

    )
}

export default Skeleton