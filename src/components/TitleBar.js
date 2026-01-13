import { View } from 'react-native'
import { useTheme } from 'react-native-paper';
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { RNText } from './RNText';

const TitleBar = ({ title, onClick, bgColor = 'white' }) => {
    const theme = useTheme();
    return (
        <View style={{ flex: 0.7, flexDirection: "row", alignItems: "center", paddingHorizontal: 20,backgroundColor:"#fbede3",justifyContent:"space-between" }}>
            <AntDesign name="arrowleft" size={22} color={theme.colors.primary} onPress={onClick} />
            <RNText title={title} fontSize={20} color={theme.colors.primary} variant="bodyMedium" fontWeight="500"/>
            <View></View>
        </View>
    )
}

export default TitleBar