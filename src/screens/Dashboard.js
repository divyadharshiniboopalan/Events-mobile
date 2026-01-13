import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView, Image } from 'react-native'
import { Card, useTheme } from 'react-native-paper'
import { RNText } from '../components/RNText'
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Foundation, Entypo, FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import React, { useState, useEffect, useRef } from "react";
import { scr_height, scr_width } from '../utils/Dimention';
import { tabView } from '../utils/DeviceType';
import { useNavigation } from '@react-navigation/native';
import * as Calendar from 'expo-calendar';
import Skeleton from '../components/Skeleton';
import CircularProgress from 'react-native-circular-progress-indicator';
import LottieLoader from '../components/LottieLoader';
import { LinearGradient } from 'expo-linear-gradient';



const Dashboard = () => {
    const theme = useTheme()
    const navigation = useNavigation()
    const [date, setCurrentDate] = useState(new Date());
    const [title, setTitle] = useState("WELCOME")
    const [newDate, setNewDate] = useState(0)
    const [newHours, setHours] = useState(0)
    const [newMinutes, setminutes] = useState(0)
    const [newSeconds, setseconds] = useState(0)
    const [listingLoader, setListingLoader] = useState(false)
    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [pastEvents, setPastEvents] = useState([])
    const [totalEvents, setTotalEvents] = useState([])
    const [currentdt, setCurrentDt] = useState(new Date());
    const [todayEvent, setTodayEvents] = useState([])
    const animation = useRef(null);



    useEffect(() => {

        {
            let secTimer = setInterval(() => {
              let  date_future = new Date(date);
              let  date_now = new Date();
               let seconds = Math.floor((date_future - (date_now)) / 1000);
               let minutes = Math.floor(seconds / 60);
               let hours = Math.floor(minutes / 60);
               let days = Math.floor(hours / 24);
                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                setCurrentDt(new Date())
                setNewDate(days),
                    setHours(hours),
                    setminutes(minutes),
                    setseconds(seconds)
                { moment(date).format() == moment(new Date()).format() && getCalendarData() }
            }, 1000)
            return () => clearInterval(secTimer);
        }
    }, [date]);


    useEffect(() => {
        const unsubcribe = navigation.addListener("focus", () => {
            getCalendarData()

        });
        return unsubcribe;
    }, []);

    const getEventId = async (calendars) => {
        let allEvents = [];
        let all = await Promise.all(calendars.map(async (ele) => {
            let events = await Calendar.getEventsAsync([ele.id], new Date(2023, 0, 1, 0, 0, 0, 0), new Date(2035, 0, 1, 0, 0, 0, 0))
            let tempData = events.map((item) => ({ ...item, ...{ "color": ele.color } }))
            allEvents = [...allEvents, ...tempData];
        })
        )
        return allEvents
    }



    const getCalendarData = async () => {
        try {
            setListingLoader(true)
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const newCalendatData = await getEventId(calendars)
            const calendarFilteredData = newCalendatData.filter((ele) => ele.allDay == false)

            let upcomingEventsData = calendarFilteredData.filter((value) => {
                return moment(value.startDate).format() >= moment(new Date()).format()
            })
            let pastEventsData = calendarFilteredData.filter((value) => {
                return moment(value.startDate).format() <= moment(new Date()).format()
            })

            let todayEventsData = calendarFilteredData.filter((value) => {
                return moment(value.startDate).format("DD-MM-YYYY") == moment(new Date()).format("DD-MM-YYYY")
            })


            setTodayEvents(todayEventsData)
            setUpcomingEvents(upcomingEventsData)
            setPastEvents(pastEventsData)
            setTotalEvents(calendarFilteredData)


            const data = upcomingEventsData.sort(function (a, b) {
                if (a.startDate < b.startDate) {
                    return -1;
                }
                else {
                    return 0;
                }
            })

            setCurrentDate(data[0] ? data[0].startDate : new Date())
            setTitle(data[0] ? data[0].title : "WELCOME")
            setListingLoader(false)

        }
        catch (error) {
            console.log("🚀  getCalendarData  error:", error)
        }
        finally {
            setListingLoader(false)
        }
    }

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: theme.colors.primary,
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0, 104, 116, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };




    const data = [
        {
            name: "Today",
            population: todayEvent.length == 0 ? 0 : todayEvent.length,
            color: '#FCCB30',
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "pending",
            population: upcomingEvents.length == 0 ? 0 : upcomingEvents.length,
            color: "#FF8048",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Completed",
            population: pastEvents.length == 0 ? 0 : pastEvents.length,
            color: "#00BEAE",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Total",
            population: totalEvents.length == 0 ? 0 : totalEvents.length,
            color: "#00AFC7",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },

    ];


    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: scr_height * 0.35, backgroundColor: "#fbede3", width: scr_width }} >
                {!listingLoader ?
                    <View>
                        {upcomingEvents.length != 0 ?

                            <View style={{ marginHorizontal: 15 }}>
                                <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between", marginHorizontal: 3 }}>
                                    <RNText title={"Dashboard"} color={theme.colors.primary} fontSize={18} fontWeight="500" />
                                    {/* <TouchableOpacity style={{ marginHorizontal: 10 }} >
                                        <FontAwesome5 name="users" size={23} color={theme.colors.primary} />
                                    </TouchableOpacity> */}
                                </View>
                                <Card style={{ height: scr_height * 0.2, backgroundColor: theme.colors.background, justifyContent: "center", width: scr_width - 30, marginTop: 20 }}>

                                    <View style={{ height: 60, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                        <View style={{ width: "10%" }}>
                                            <FontAwesome5 name="calendar-day" size={22} color={theme.colors.primary} />
                                        </View>
                                        <View style={{ width: "75%" }}>
                                            <RNText title={title} color={theme.colors.primary} fontSize={17} fontWeight="500" />
                                        </View>
                                    </View>
                                    <View >
                                        <LinearGradient
                                            colors={["#ff9966", '#ff5e62']}
                                            style={{ height: 100, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
                                        >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%", alignSelf: "center", borderRadius: 20, padding: 15 }}>
                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={newDate ? "" + newDate : "0"} color={theme.colors.background} fontSize={24} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"DAYS"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 12 }}>
                                                    <Entypo name="dots-two-vertical" size={14} color={theme.colors.background} />
                                                </View>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={newHours ? "" + newHours : "0"} color={theme.colors.background} fontSize={24} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"HOURS"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 12 }}>
                                                    <Entypo name="dots-two-vertical" size={14} color={theme.colors.background} />
                                                </View>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={newMinutes ? "" + newMinutes : "0"} color={theme.colors.background} fontSize={24} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"MINUTES"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 12 }}>
                                                    <Entypo name="dots-two-vertical" size={14} color={theme.colors.background} />
                                                </View>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={newSeconds ? "" + newSeconds : "0"} color={theme.colors.background} fontSize={24} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"SECONDS"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </View>


                                </Card>

                            </View>


                            :
                            <View style={{ marginHorizontal: 15 }}>
                                <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
                                    <RNText title={"Dashboard"} color={theme.colors.primary} fontSize={18} fontWeight="500" />
                                    {/* <TouchableOpacity style={{ marginHorizontal: 10 }} >
                                        <FontAwesome5 name="users" size={23} color={theme.colors.primary} />
                                    </TouchableOpacity> */}
                                </View>

                                <Card style={{ height: scr_height * 0.2, backgroundColor: theme.colors.background, justifyContent: "center", width: scr_width - 30, marginTop: 15 }}>

                                    <View style={{ height: 60, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                        <View style={{ width: "10%" }}>
                                            <FontAwesome5 name="calendar-day" size={22} color={theme.colors.primary} />
                                        </View>
                                        <View style={{ width: "73%" }}>
                                            <RNText title={moment(new Date()).format("ddd, Do MMMM YYYY").toUpperCase()} color={theme.colors.primary} fontSize={17} fontWeight="500" />
                                        </View>
                                    </View>
                                    <View >
                                        <LinearGradient
                                            colors={["#ff9966", '#ff5e62']}
                                            style={{ height: 100, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
                                        >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", alignSelf: "center", borderRadius: 20, padding: 15 }}>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={currentdt ? moment(new Date(currentdt)).format("hh") : "0"} color={theme.colors.background} fontSize={26} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"HOURS"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 12 }}>
                                                    <Entypo name="dots-two-vertical" size={14} color={theme.colors.background} />
                                                </View>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={currentdt ? moment(new Date(currentdt)).format("mm") : "0"} color={theme.colors.background} fontSize={26} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"MINUTES"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 12 }}>
                                                    <Entypo name="dots-two-vertical" size={14} color={theme.colors.background} />
                                                </View>

                                                <View style={{ alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                                        <RNText title={currentdt ? moment(new Date(currentdt)).format("ss") : "0"} color={theme.colors.background} fontSize={26} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                    <View>
                                                        <RNText title={"SECONDS"} color={theme.colors.background} fontSize={12} fontWeight="500" textAlign={"center"} />
                                                    </View>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </View>


                                </Card>

                            </View>
                        }
                    </View> :

                    <View>

                        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between", marginHorizontal: 18 }}>
                            <RNText title={"Dashboard"} color={theme.colors.primary} fontSize={18} fontWeight="500" />
                            {/* <TouchableOpacity style={{ marginHorizontal: 10 }} >
                                <FontAwesome5 name="users" size={23} color={theme.colors.primary} />
                            </TouchableOpacity> */}
                        </View>


                        <Card style={{ height: scr_height * 0.2, backgroundColor: theme.colors.background, justifyContent: "center", width: scr_width - 30, marginTop: 15, alignSelf: "center" }}>

                            <View style={{ height: 60, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", marginHorizontal: 10 }}>
                                <View style={{ width: "20%" }}>
                                    <Skeleton height={40} width={40} borderRadius={999} />
                                </View>
                                <View style={{ width: "73%" }}>
                                    <Skeleton height={10} width={scr_width * 0.3} borderRadius={10} />
                                </View>
                            </View>
                            <View >
                                <LinearGradient
                                    colors={["#ff9966", '#ff5e62']}
                                    style={{ height: 100, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
                                >
                                    <View style={{ justifyContent: "center", marginTop: 10 }}>
                                        <LottieLoader height={"90%"} width={"90%"} />
                                    </View>
                                </LinearGradient>


                            </View>


                        </Card>
                    </View>
                }
            </View >

            <View style={{ flex: 8, backgroundColor: "#fbede3", }}>
                {/* <View style={{ flex: 4.5, }}>
                    <View style={{ marginHorizontal: 15 }}>
                        <RNText title={"Overview"} color={theme.colors.primary} fontSize={18} fontWeight="500" />
                    </View>

                    {
                        !listingLoader ?
                            <PieChart
                                data={data}
                                width={scr_width - 30}
                                height={scr_height * 0.255}
                                chartConfig={chartConfig}
                                accessor={"population"}
                                backgroundColor={theme.colors.background}
                                paddingLeft={"10"}
                                style={{
                                    borderRadius: 15, alignSelf: "center", marginTop: 10, shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.22,
                                    shadowRadius: 2.22,
                                    elevation: 3,
                                }}

                                // center={[10, 50]}
                                absolute
                            /> :

                            <View style={{
                                alignItems: "center", justifyContent: "center", height: 180, backgroundColor: theme.colors.background, borderRadius: 15, alignSelf: "center", marginTop: 10, shadowColor: '#000', width: scr_width - 30,
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22,
                                elevation: 3,
                            }}>
                                <LottieView
                                    autoPlay
                                    ref={animation}
                                    style={{ width: 200, height: 200, marginBottom: 20 }}
                                    source={require("../assests/piechartloading.json")}
                                    resizeMode='contain'
                                />
                            </View>

                    }
                </View> */}


                <View style={{ marginHorizontal: 15 }}>
                    <RNText title={"Your progress"} color={theme.colors.primary} fontSize={18} fontWeight="500" />
                </View>

                <View style={{ padding: 5, flex: 3 }}>

                    <ScrollView showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", alignSelf: "center", width: "95%" }}>

                            <Card style={{ backgroundColor: theme.colors.background, width: scr_width * 0.42, height: 120, marginVertical: 10, justifyContent: "center", margin: 10 }} onPress={() => !listingLoader ? navigation.navigate("TodayEvents", { todayEvents: todayEvent }) : null}>
                                <Card.Content>
                                    <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                        <CircularProgress
                                            value={todayEvent.length == 0 ? "0" : todayEvent.length}
                                            radius={25}
                                            progressValueColor={'black'}
                                            activeStrokeColor={theme.colors.primary}
                                            inActiveStrokeColor={'lightgray'}
                                            inActiveStrokeOpacity={0.5}
                                            inActiveStrokeWidth={10}
                                            activeStrokeWidth={10}
                                        />
                                    </View>
                                    <RNText title={"Today"} color={theme.colors.primary} fontSize={15} fontWeight="400" textAlign={"center"} />
                                </Card.Content>
                            </Card>

                            <Card style={{ backgroundColor: theme.colors.background, width: scr_width * 0.42, height: 120, marginVertical: 10, justifyContent: "center", margin: 5 }} onPress={() => { !listingLoader ? navigation.navigate("Pending", { upcomingEventsData: upcomingEvents }) : null }}>
                                <Card.Content>
                                    <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                        <CircularProgress
                                            value={upcomingEvents.length == 0 ? "0" : upcomingEvents.length}
                                            radius={25}
                                            progressValueColor={'black'}
                                            activeStrokeColor={theme.colors.primary}
                                            inActiveStrokeColor={'lightgray'}
                                            inActiveStrokeOpacity={0.5}
                                            inActiveStrokeWidth={10}
                                            activeStrokeWidth={10}
                                        />
                                    </View>
                                    <RNText title={"Pending"} color={theme.colors.primary} fontSize={15} fontWeight="400" textAlign={"center"} />
                                </Card.Content>
                            </Card>

                            <Card style={{ backgroundColor: theme.colors.background, width: scr_width * 0.42, height: 120, marginVertical: 10, justifyContent: "center", margin: 10 }} onPress={() => !listingLoader ? navigation.navigate("Completed", { pastEventsData: pastEvents }) : null}>
                                <Card.Content>
                                    <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                        <CircularProgress
                                            value={pastEvents.length == 0 ? "0" : pastEvents.length}
                                            radius={25}
                                            progressValueColor={'black'}
                                            activeStrokeColor={theme.colors.primary}
                                            inActiveStrokeColor={'lightgray'}
                                            inActiveStrokeOpacity={0.5}
                                            inActiveStrokeWidth={10}
                                            activeStrokeWidth={10}
                                        />
                                    </View>
                                    <RNText title={"Completed"} color={theme.colors.primary} fontSize={15} fontWeight="400" textAlign={"center"} />
                                </Card.Content>
                            </Card>

                            <Card style={{ backgroundColor: theme.colors.background, width: scr_width * 0.42, height: 120, marginVertical: 10, justifyContent: "center", margin: 5 }} onPress={() => !listingLoader ? navigation.navigate("Total", { totalEventsData: totalEvents }) : null}>
                                <Card.Content>
                                    <View style={{ alignSelf: "center", marginBottom: 10 }}>
                                        <CircularProgress
                                            value={totalEvents.length == 0 ? "0" : totalEvents.length}
                                            radius={25}
                                            progressValueColor={'black'}
                                            activeStrokeColor={theme.colors.primary}
                                            inActiveStrokeColor={'lightgray'}
                                            inActiveStrokeOpacity={0.5}
                                            inActiveStrokeWidth={10}
                                            activeStrokeWidth={10}
                                        />
                                    </View>
                                    <RNText title={"Total"} color={theme.colors.primary} fontSize={15} fontWeight="400" textAlign={"center"} />
                                </Card.Content>
                            </Card>



                        </View>
                    </ScrollView>
                </View>



            </View>
            <View style={{ height: scr_height / 12, backgroundColor: "#fbede3", width: "100%", justifyContent: "space-around", flexDirection: "row", elevation: 4 }}>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate("Events")} activeOpacity={1}>
                    <MaterialIcons name="event" size={tabView ? scr_height * 0.030 : scr_height * 0.02} color={theme.colors.primary} />
                    <View style={{ paddingTop: 3 }}>
                        <RNText title={"Events"} fontSize={10} color={theme.colors.primary} variant="bodyMedium" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", }} onPress={() => navigation.navigate("CreateEvents")} activeOpacity={1}>
                    <FontAwesome name="plus" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", paddingTop: 2 }} onPress={() => navigation.navigate("Notes")} activeOpacity={1}>
                    <Foundation name="clipboard-notes" size={tabView ? scr_height * 0.027 : scr_height * 0.02} color={theme.colors.primary} />
                    <View style={{ paddingTop: 4 }}>
                        <RNText title={"Notes"} fontSize={10} color={theme.colors.primary} variant="bodyMedium" />
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default Dashboard
