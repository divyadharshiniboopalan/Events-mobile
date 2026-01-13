import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import LottieView from 'lottie-react-native';

const LottieLoader = ({ height = "65%", width = "65%" }) => {
    const animation = useRef(null);
    return (
        <View style={{}}>
            <LottieView
                autoPlay
                ref={animation}
                style={{ width: width, height: height,justifyContent:"center",alignSelf:"center",alignItems:"center" }}
                source={require("../assets/loader.json")}
                resizeMode='contain'
            />
        </View>
    )
}

export default LottieLoader