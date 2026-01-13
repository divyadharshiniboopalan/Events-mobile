
import { View, Text, TouchableOpacity, Image, Platform, FlatList, ScrollView, ActivityIndicator, SectionList } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Menu, useTheme, Divider, Portal, Dialog, Button } from 'react-native-paper'
import { RNText } from '../components/RNText'
import { AntDesign, MaterialIcons, FontAwesome, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { scr_height } from '../utils/Dimention';
import { useNavigation } from '@react-navigation/native';
import * as Calendars from 'expo-calendar';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import LottieLoader from '../components/LottieLoader';
import { useToast } from 'react-native-toast-notifications';



const CalendarScreen = () => {
    const theme = useTheme()
    const navigation = useNavigation()
    const scrollViewRef = useRef()
    const [listingLoader, setListingLoader] = useState(false)
    const [calendarData, setCalendarData] = useState([])
    const [toggleCalendar, setToggleCalendar] = useState(false)
    const [markedData, setMarkedData] = useState({})
    const [newCalendarListing, setNewCalendarListing] = useState([])
    const [calendarDate, setCalendarDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [visible, setVisible] = useState(false);
    const [DeleteDailogVisible, setDeleteDailogVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [loader, setLoader] = useState(false)
    const [updateEventId, setupdateEventId] = useState("")
    const [eventDate, setEventDate] = useState(new Date())
    const toast = useToast();
    const [calendarPickerToggle, setCalendarPickerToggle] = useState(false)
    const [allData, setAllData] = useState()
    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);


    const showVirtualDeleteDialog = () => setDeleteDailogVisible(true);
    const hideDeleteDialog = () => setDeleteDailogVisible(false);


    useEffect(() => {
        const unsubcribe = navigation.addListener("focus", () => {
            getCalendarData()
        });
        return unsubcribe;
    }, []);



    const getEventId = async (calendars) => {
        let allEvents = [];
        let all = await Promise.all(calendars.map(async (ele) => {
            let events = await Calendars.getEventsAsync([ele.id], new Date(2023, 0, 1, 0, 0, 0, 0), new Date(2035, 0, 1, 0, 0, 0, 0))
            let tempData = events.map((item) => ({ ...item, ...{ "color": ele.color } }))
            allEvents = [...allEvents, ...tempData];
        })
        )
        return allEvents
    }



    const getCalendarData = async () => {
        try {
            setListingLoader(true)
            const calendars = await Calendars.getCalendarsAsync(Calendars.EntityTypes.EVENT);
            // const newCalendatData = await getEventId(calendars.filter((val) => Platform.OS == "ios" && val.type === "local" ? (val) : val.ownerAccount === "personal" ? (val) : null))
            const newCalendatData = await getEventId(calendars)
            const calendarFilteredData = newCalendatData.filter((ele) => ele.allDay == false)
            console.log("🚀 ~ getCalendarData ~ calendarFilteredData:", JSON.stringify(calendarFilteredData))
            setCalendarData(calendarFilteredData)

            let markedDay = {};
            calendarFilteredData.map((item) => {
                markedDay[moment(item.startDate).format("YYYY-MM-DD")] = {
                    marked: true,
                    selectedColor: theme.colors.primary,
                    selectedDotColor: theme.colors.primary,

                };
            });

            setMarkedData(markedDay)
            setAllData(markedDay)
            setListingLoader(false)

        }
        catch (error) {
            console.log("🚀  getCalendarData  error:", error)
            setListingLoader(false)
        }
        finally {
            setListingLoader(false)
        }
    }





    const calendarToggle = () => {
        setToggleCalendar(!toggleCalendar)
    }


    const getcalendarlistings = (date = moment(new Date()).format("YYYY-MM-DD")) => {

        let newDatas = { [moment(date).format("YYYY-MM-DD")]: { color: 'green', selected: true } }
        setAllData({ ...markedData, ...newDatas })

        let newData = calendarData.filter((value) => moment(value.startDate).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"))
        setNewCalendarListing(newData)
        setCalendarDate(moment(date).format("YYYY-MM-DD"))
    }


    const deleteNote = async (id) => {
        setLoader(true)
        const deleteCalendarValue = await Calendars.deleteEventAsync(id, {
            futureEvents: true
        });

        setCalendarData((prev) => prev.filter((ele) => ele.id != id))
        const tempDataList = newCalendarListing.filter((ele) => ele.id != id)
        setNewCalendarListing(tempDataList)

        setCalendarDate(moment(eventDate).format("YYYY-MM-DD"))
        toast.show("Event deleted successfully!", { type: 'success' });
        setLoader(false)

        let newMarkedDate = moment(eventDate).format("YYYY-MM-DD")
        let newObj = { ...markedData };
        delete newObj[newMarkedDate]
        setMarkedData(newObj)
    }


    let eventsUpcomingDatas = calendarData.sort(function (a, b) {
        if (a.startDate < b.startDate) {
            return -1;
        }
        if (a.startDate > b.startDate) {
            return 1;
        }
        return 0;
    }).reduce((prev, currentValue, index) => {

        let tempData = prev.find((ele) => moment(ele.title).format("YYYY-MM-DD") == moment(currentValue.startDate).format("YYYY-MM-DD"))
        if (tempData) {
            tempData.data.push(currentValue)
        } else {
            prev.push({
                "title": currentValue.startDate,
                "data": [currentValue]
            })
        }
        return prev;
    }, [])




    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level0 }}>
            <View style={{ flex: 0.7, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#fbede3", justifyContent: "space-between" }}>
                <View style={{ width: "35%" }}>
                    <AntDesign name="arrowleft" size={20} color={theme.colors.primary} onPress={() => navigation.navigate("Events")} />
                </View>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", width: "55%" }} onPress={() => { calendarToggle(), getcalendarlistings() }} disabled={listingLoader}>
                    <RNText title={"Calendar"} fontSize={20} color={theme.colors.primary} variant="bodyMedium" fontWeight="500" />
                    {toggleCalendar ? <AntDesign name="caretup" size={13} color={theme.colors.primary} style={{ paddingLeft: 10, paddingTop: 4 }} /> :
                        <AntDesign name="caretdown" size={13} color={theme.colors.primary} style={{ paddingLeft: 10, }} />}
                </TouchableOpacity>
                <View>


                </View>
            </View>

            {toggleCalendar ?

                <View style={{ flex: 8 }}>
                    {listingLoader ?
                        <View style={{ justifyContent: "center", marginTop: "50%" }}>
                            <LottieLoader />
                        </View>
                        :
                        <View>
                            <ScrollView style={{ height: "100%" }}>


                                <View>
                                    <Calendar
                                        markedDates={allData}
                                        markingType={'dot'}
                                        enableSwipeMonths={true}
                                        theme={{
                                            selectedDayBackgroundColor: theme.colors.primary, calendarBackground: "white",
                                            dotColor: theme.colors.primary, monthTextColor: theme.colors.primary, textSectionTitleColor: theme.colors.primary, textDayHeaderFontSize: 14,
                                            arrowColor: theme.colors.primary, textDayHeaderFontFamily: "Roboto_Slab", textDayFontFamily: "Roboto_Slab", textMonthFontFamily: "Roboto_Slab"
                                        }}
                                        onDayPress={(item) => { getcalendarlistings(item.dateString), setCalendarDate(item.dateString) }}
                                    />
                                </View>

                                <View style={{ width: "100%", alignItems: "center", marginHorizontal: 10, marginVertical: 15, flexDirection: "row" }} >
                                    <TouchableOpacity style={{ width: 45, alignItems: "center", backgroundColor: "#fbede3", borderRadius: 10, height: 45, justifyContent: "center", marginHorizontal: 5 }} >
                                        <View>
                                            <RNText title={moment(calendarDate).format("ddd")} color={theme.colors.primary} fontSize={13} />
                                        </View>
                                        <RNText title={moment(calendarDate).format("DD")} color={theme.colors.primary} fontSize={15} fontWeight="500" />
                                    </TouchableOpacity>
                                    <View style={{ marginHorizontal: 10 }}>
                                        <RNText title={moment(calendarDate).format("ddd, Do MMMM YYYY").toUpperCase()} color={theme.colors.outline} fontSize={15} fontWeight="500" />
                                    </View>
                                </View>

                                {
                                    newCalendarListing.map((item, index) => (

                                        <View key={index}>
                                            <Card style={{ width: "80%", backgroundColor: "white", margin: 5, borderLeftWidth: 5, borderColor: item.color, alignSelf: "flex-end", marginHorizontal: 20 }}>
                                                <Card.Content>
                                                    <View style={{ flexDirection: "row", width: "80%" }}>
                                                        <View style={{}}>
                                                            <View style={{ marginBottom: 8, flexDirection: "row" }}>
                                                                <View style={{ width: "100%" }}>
                                                                    <RNText title={item.title} color={theme.colors.primary} fontSize={15} fontWeight="500" />
                                                                </View>
                                                                <View>
                                                                    <Menu

                                                                        visible={visible == item.startDate}
                                                                        onDismiss={closeMenu}
                                                                        contentStyle={{ backgroundColor: "white", top: 25, left: 50, width: "82%" }}
                                                                        anchor={
                                                                            <TouchableOpacity onPress={() => setVisible(item.startDate)}>
                                                                                <MaterialCommunityIcons name="dots-vertical" size={scr_height * 0.026} color={"black"} />
                                                                            </TouchableOpacity>
                                                                        }

                                                                    >
                                                                        <Menu.Item onPress={() => { closeMenu(), navigation.navigate("UpdateEvent", { updateData: item }), calendarToggle() }} title="Edit" leadingIcon={"playlist-edit"} />
                                                                        <Divider />
                                                                        <Menu.Item disabled={loader} onPress={() => { showVirtualDeleteDialog(), setupdateEventId(item.id), closeMenu(), setTitle(item.title), setEventDate(new Date(item.startDate)) }} title="Delete" titleStyle={{ color: "red" }} leadingIcon={() => <MaterialCommunityIcons name="trash-can-outline" size={21} color="red" />} />
                                                                    </Menu>
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
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3 }}>
                                                                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6, width: "93%" }}>
                                                                    <View>
                                                                        <Image
                                                                            source={require('../assests/noImage.webp')}
                                                                            style={{ height: 15, width: 15, resizeMode: "contain" }}
                                                                        />
                                                                    </View>
                                                                    <View>
                                                                        <RNText title={`Photographer${index + 1}`} color={theme.colors.onBackground} fontSize={13} />
                                                                    </View>
                                                                </View>
                                                                <TouchableOpacity style={{}}>
                                                                    <RNText title={"Accept"} color={"green"} fontSize={12} />
                                                                </TouchableOpacity>

                                                            </View>
                                                        </View>
                                                    </View>
                                                </Card.Content>
                                            </Card>

                                        </View>


                                    ))
                                }

                                {
                                    newCalendarListing.length == 0 &&
                                    <View>
                                        <View style={{ alignItems: "center" }}>
                                            <Image source={require("../assests/No-Events.png")} style={{ height: 200, width: 200, resizeMode: "contain" }} />
                                        </View>
                                        <View style={{ alignItems: "center" }}>
                                            <RNText title={`No Events Available`} fontSize={20} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                            <View style={{ marginTop: 20 }}>
                                                <RNText title={"Find and booking concert tickets near"} color={"#9597a4"} fontSize={13} textAlign={"center"} />
                                                <RNText title={"you! Invite your friends to watch together"} color={"#9597a4"} fontSize={13} padding={4} />
                                            </View>
                                        </View>
                                        <TouchableOpacity style={{ flexDirection: "row", width: "80%", height: 60, alignSelf: "center", alignItems: "center", backgroundColor: "#2e272a", borderRadius: 15, justifyContent: "center", marginTop: 60 }} onPress={() => navigation.navigate("CreateEvents", { eventStartDate: calendarDate })}>
                                            <RNText title={"EXPLORE EVENTS"} color={theme.colors.background} fontSize={15} fontWeight="500" />
                                        </TouchableOpacity>
                                    </View>
                                }
                                <View style={{ height: 100 }}>
                                </View>
                            </ScrollView>

                        </View>
                    }
                </View>
                :
                <View style={{ flex: 8 }}>
                    <View style={{}}>

                        {listingLoader ?
                            <View style={{ justifyContent: "center", marginTop: "50%" }}>
                                <LottieLoader />
                            </View>
                            :
                            <SectionList
                                ref={scrollViewRef}
                                sections={eventsUpcomingDatas}
                                ListFooterComponent={<View style={{ height: 100 }}>
                                </View>}
                                showsVerticalScrollIndicator={false}
                                style={{ height: "100%" }}
                                keyExtractor={(item, index) => index.toString()}
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




                                    <Card style={{ width: "80%", backgroundColor: "white", margin: 5, borderLeftWidth: 5, borderColor: item.color, alignSelf: "flex-end", marginHorizontal: 20 }}>
                                        <Card.Content>
                                            <View style={{ flexDirection: "row", width: "80%" }}>
                                                <View style={{}}>
                                                    <View style={{ marginBottom: 8, flexDirection: "row" }}>
                                                        <View style={{ width: "100%" }}>
                                                            <RNText title={item.title} color={theme.colors.primary} fontSize={15} fontWeight="500" />
                                                        </View>
                                                        <View>
                                                            <Menu
                                                                visible={visible == item.startDate}
                                                                onDismiss={closeMenu}
                                                                contentStyle={{ backgroundColor: "white", top: 25, left: 50, width: "82%" }}
                                                                anchor={
                                                                    <TouchableOpacity onPress={() => setVisible(item.startDate)}>
                                                                        <MaterialCommunityIcons name="dots-vertical" size={scr_height * 0.026} color={"black"} />
                                                                    </TouchableOpacity>
                                                                }

                                                            >
                                                                <Menu.Item onPress={() => { closeMenu(), navigation.navigate("UpdateEvent", { updateData: item }) }} title="Edit" leadingIcon={"playlist-edit"} />
                                                                <Divider />
                                                                <Menu.Item disabled={loader} onPress={() => { showVirtualDeleteDialog(), setupdateEventId(item.id), closeMenu(), setTitle(item.title), setEventDate(new Date(item.startDate)) }} title="Delete" titleStyle={{ color: "red" }} leadingIcon={() => <MaterialCommunityIcons name="trash-can-outline" size={21} color="red" />} />
                                                            </Menu>

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
                                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3 }}>
                                                        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6, width: "93%" }}>
                                                            <View>
                                                                <Image
                                                                    source={require('../assests/noImage.webp')}
                                                                    style={{ height: 15, width: 15, resizeMode: "contain" }}
                                                                />
                                                            </View>
                                                            <View>
                                                                <RNText title={`Photographer${index + 1}`} color={theme.colors.onBackground} fontSize={13} />
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity style={{}}>
                                                            <RNText title={"Accept"} color={"green"} fontSize={12} />
                                                        </TouchableOpacity>

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
                        }

                    </View>
                </View>


            }

            <Portal>
                <Dialog visible={DeleteDailogVisible} onDismiss={hideDeleteDialog} style={{ backgroundColor: "white", }}>
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                <RNText title={"Are you sure, want to delete"} fontSize={14} />
                                <RNText title={`  ${title} `} fontSize={15} color={theme.colors.primary} />
                                <RNText title={"Event ?"} fontSize={14} />
                            </View>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDeleteDialog} textColor={"black"}>Cancel</Button>
                        <View style={{ position: "relative" }}>
                            {!loader ? <Button onPress={() => { deleteNote(updateEventId), hideDeleteDialog() }} textColor={"red"}>Delete</Button> :
                                <Button textColor={"red"}>Deleting...</Button>}
                        </View>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View >
    )
}

export default CalendarScreen

