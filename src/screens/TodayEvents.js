import { StyleSheet, Text, TouchableOpacity, View, Platform, ActivityIndicator, Image } from 'react-native'
import { Card, useTheme } from 'react-native-paper'
import { RNText } from '../components/RNText'
import { MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import * as Calendar from 'expo-calendar';
import { SectionList } from 'react-native';
import TitleBar from '../components/TitleBar';
import LottieLoader from '../components/LottieLoader';

const TodayEvents = (props) => {
    const TodayEvents = props.route.params.todayEvents
    const theme = useTheme()
    const navigation = useNavigation()
    const scrollViewRef = useRef()



    let eventsUpcomingDatas = TodayEvents.reduce((prev, currentValue, index) => {

        let tempData = prev.find((ele) => moment(ele.title).format("YYYY-MM-DD") == moment(currentValue.startDate).format("YYYY-MM-DD"))
        if (tempData) {
            tempData.data.push(currentValue)
        } else {
            prev.push({
                "title": currentValue?.startDate,
                "data": [currentValue]
            })
        }
        return prev
    }, [])



    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level0 }}>
            <TitleBar title={"Today Events"} onClick={() => navigation.goBack()} />
            <View style={{ flex: 8 }}>
                <View style={{}}>

                    <SectionList
                        ref={scrollViewRef}
                        sections={eventsUpcomingDatas}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={{ height: 100 }}>
                        </View>}
                        style={{ height: "100%" }}
                        keyExtractor={(item, index) => item + index.toString()}
                        ListEmptyComponent={
                            <View>
                                <View style={{ alignItems: "center", marginTop: 10 }}>
                                    <Image source={require("../assests/No-Events.png")} style={{ height: 300, width: 350, resizeMode: "contain" }} />
                                </View>
                                <View style={{ alignItems: "center" }}>
                                    <RNText title={`No Events Available`} fontSize={20} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                    <View style={{ marginTop: 20 }}>
                                        <RNText title={"Find and booking concert tickets near"} color={"#9597a4"} fontSize={13} textAlign={"center"} />
                                        <RNText title={"you! Invite your friends to watch together"} color={"#9597a4"} fontSize={13} padding={4} />
                                    </View>
                                </View>
                                <TouchableOpacity style={{ flexDirection: "row", width: "80%", height: 60, alignSelf: "center", alignItems: "center", backgroundColor: "#2e272a", borderRadius: 15, justifyContent: "center", marginTop: 60 }} onPress={() => navigation.navigate("CreateEvents")}>
                                    <RNText title={"EXPLORE EVENTS"} color={theme.colors.background} fontSize={15} fontWeight="500" />
                                </TouchableOpacity>
                            </View>}
                        stickySectionHeadersEnabled={false}
                        renderItem={({ item, index }) => (


                            <Card style={{ width: "80%", backgroundColor: "white", margin: 5, borderLeftWidth: 5, borderColor: item.color, alignSelf: "flex-end", marginHorizontal: 20 }} key={index}>
                                <Card.Content>
                                    <View style={{ flexDirection: "row", width: "80%" }}>
                                        <View style={{}}>
                                            <View style={{ marginBottom: 8, flexDirection: "row" }}>
                                                <View style={{ width: "100%" }}>
                                                    <RNText title={item.title} color={theme.colors.primary} fontSize={15} fontWeight="500" />
                                                </View>

                                            </View>
                                            {item.notes && <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, width: "80%", columnGap: 6 }}>
                                                <MaterialIcons name="event-note" size={15} color="black" />
                                                <RNText title={item.notes} color={theme.colors.onBackground} fontSize={14} />
                                            </View>}
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, columnGap: 6 }}>
                                                <MaterialIcons name="event" size={15} color="black" />
                                                <RNText title={`${moment(item.startDate).format("DD-MMM-YYYY")} to ${moment(item.endDate).format("DD-MMM-YYYY")}`} color={theme.colors.onBackground} fontSize={13} />
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, columnGap: 6 }}>
                                                <MaterialCommunityIcons name="calendar-clock" size={15} color="black" />
                                                <RNText title={`${moment(item.startDate).format("LT")} - ${moment(item.endDate).format("LT")}`} color={theme.colors.onBackground} fontSize={13} />
                                            </View>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>

                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={{ width: "100%", alignItems: "center", marginHorizontal: 10, marginVertical: 15, flexDirection: "row" }} >
                            <TouchableOpacity style={{ width: 45, alignItems: "center", backgroundColor: "#fbede3", borderRadius: 10, height: 45, justifyContent: "center", marginHorizontal: 5 }} >
                                <View>
                                    <RNText title={moment(title).format("ddd")} color={theme.colors.primary} fontSize={13} />
                                </View>
                                <RNText title={moment(title).format("DD")} color={theme.colors.primary} fontSize={15} fontWeight="500" />
                            </TouchableOpacity>
                            <View style={{ marginHorizontal: 10 }}>
                                <RNText title={moment(title).format("ddd, Do MMMM YYYY").toUpperCase()} color={theme.colors.outline} fontSize={15} fontWeight="500" />

                            </View>
                        </View>
                        )}
                    />
                    {/* } */}
                </View>
            </View>
        </View>
    )
}

export default TodayEvents

const styles = StyleSheet.create({})








