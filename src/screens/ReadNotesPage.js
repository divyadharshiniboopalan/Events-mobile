import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons';
import { RNText } from '../components/RNText';

const ReadNotesPage = (props) => {
    const navigation = useNavigation()
    let notesData = props?.route?.params?.data

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ right: 15, marginVertical: 5, }}>
                    <AntDesign name="arrow-left" size={22} color="black" />
                </TouchableOpacity>
                <View >
            
                    <RNText title={notesData.title}  fontSize={20} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never' style={{ marginVertical: 10 }}>
              { notesData.designation &&  <View style={{ borderWidth: 0.6, borderColor: "gray", borderRadius: 5, padding: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "600", lineHeight: 40 }}>Designation</Text>
            
                    <RNText title={notesData.designation}  fontSize={16} />
                </View>}

                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: "600", lineHeight: 40, }}>Description</Text>
                    <RNText title={notesData.description}  fontSize={16} />
                </View>
            </ScrollView>
        </View>
    )
}

export default ReadNotesPage