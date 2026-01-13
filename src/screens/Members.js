


import { Image, Linking, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { RNText } from '../components/RNText'
import { AntDesign, MaterialIcons, Ionicons, FontAwesome6, Entypo } from '@expo/vector-icons';
import axios from 'axios'
import TitleBar from '../components/TitleBar'
import DateValidation from '../components/DateValidation'

const Members = () => {
    const theme = useTheme()
    const navigation = useNavigation()
    const [userData, setUserData] = useState([

        {
            "first_name": "Vinith Kumar",
            "last_name": "G",
            "phone": "+9790272834"

        },
        {
            "first_name": "Dharshini",
            "last_name": "S",
            "phone": "+9790359447"

        },
        {
            "first_name": "Veeramanikandan",
            "last_name": "S",
            "phone": "+8973209469"

        },

        {
            "first_name": "Pritham",
            "last_name": "P",
            "phone": "+8903782920"

        },
        {
            "first_name": "RanjithKumar",
            "last_name": "K",
            "phone": "9080955852"

        },
        {
            "first_name": "Hariharan",
            "last_name": "M.V",
            "phone": "+8122845688"

        },
      
        {
            "first_name": "Deepa",
            "last_name": "K",
            "phone": "+6380007352"

        },
        {
            "first_name": "Kavin Kannan",
            "last_name": "P.P",
            "phone": "+9080395658"

        },
        {
            "first_name": "Jayasuriya",
            "last_name": " V.P",
            "phone": "+8903483100"

        },
        {
            "first_name": "Divyadharshini",
            "last_name": "B",
            "phone": "+6369148067"

        },
        {
            "first_name": "Lavanya",
            "last_name": "A",
            "phone": "+9025528704"

        },
        {
            "first_name": "Sripathi",
            "last_name": "C",
            "phone": "+8220947769"

        },
        {
            "first_name": "Thamarai selvam",
            "last_name": "C",
            "phone": "+9384579944"

        },
        {
            "first_name": "Mohammed Rafiq",
            "last_name": "F",
            "phone": "+8072074854"

        },
        {
            "first_name": "Vishnu",
            "last_name": "R",
            "phone": "+9159134555"

        },
        {
            "first_name": "Vasanth",
            "last_name": "",
            "phone": "+7402655253"

        },
        {
            "first_name": "Siva kumar",
            "last_name": "",
            "phone": "1234567890"

        },
    ])
    const [searchText, setSearchText] = useState("")



    const DialPage = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else { phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
    }


    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Receipt'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level0 }}>
             <TitleBar title={"Invite Friend"} onClick={()=>navigation.goBack()}/>
            <View style={{ flex: 8, paddingHorizontal: 15 ,marginTop:15}}>
                <View>
                    <View style={{ position: "relative" }}>
                        <TextInput placeholder="Search..."
                            value={searchText}
                            onChangeText={(val) => setSearchText(val)}
                            style={{
                                borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline,
                                height: 50, width: "98%", alignSelf: "center", paddingHorizontal: 15,
                                paddingRight: 40, backgroundColor: theme.colors.background,fontFamily:"Roboto_Slab"
                            }} />
                        {searchText == "" ? <View style={{ position: "absolute", right: 15, top: 14 }}>
                            <AntDesign name="search1" size={22} color={theme.colors.primary} />
                        </View> :
                            <TouchableOpacity style={{ position: "absolute", right: 15, top: 14 }} onPress={() => setSearchText("")}>
                                <Entypo name="cross" size={22} color={theme.colors.primary} />
                            </TouchableOpacity>}
                    </View>
                </View>


                 <ScrollView style={{ height: "80%", marginTop: 15 }} showsVerticalScrollIndicator={false}>
                    {userData.filter((ele) => ele.first_name.toLowerCase().includes(searchText.toLowerCase())).map((item, index) => (
                        <View key={index}>
                            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", marginHorizontal: 10, margin: 10 }}>
                                <View style={{ width: "15%" }}>
                                    <Avatar.Text size={40} label={item.first_name.charAt(0)} color='white' labelStyle={{ fontWeight: "600" }} />
                                </View>
                                <View style={{ justifyContent: "center", width: "55%", marginHorizontal: 5, marginTop: 5 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                        <RNText title={item.first_name} fontSize={16} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                        <RNText title={` ${item.last_name}`} fontSize={16} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                    </View>
                                    <RNText title={item.phone} fontSize={13} color={"gray"} variant="bodyMedium" fontWeight="500" />
                                </View>
                                <View style={{ width: "25%", justifyContent: "space-around", flexDirection: "row", alignItems: "center", }}>
                                    <TouchableOpacity onPress={() => DialPage(item.phone)}>
                                        <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onShare}>
                                        <Ionicons name="share-outline" size={20} color={theme.colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                    }
                    <View style={{ height: 50 }}></View>
                </ScrollView> 
                  




            </View>
        </View >
    )
}

export default Members

const styles = StyleSheet.create({})









