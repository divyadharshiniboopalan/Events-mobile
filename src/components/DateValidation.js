import { TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'react-native-paper'
import { RNText } from '../components/RNText'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { useToast } from 'react-native-toast-notifications'

export const dateFieldValidation = (eventDate, eventDateEnd, title) => {


    // current Date and Start Date and End Date is the Same

    if (moment(new Date()).format("YYYY-MM-DD") === moment(eventDate).format("YYYY-MM-DD") && moment(eventDate).format("YYYY-MM-DD") === moment(eventDateEnd).format("YYYY-MM-DD")) {
        if (moment(eventDate).format() >= moment(new Date()).format()) {
            if ((moment(eventDateEnd).format() > moment(eventDate).format())) {

                if (title.trim() !== "") {
                    return true
                } else {
                    alert("Event Name is Required");
                }

            }
            else if ((moment(eventDate).format("HH:mm") === moment(eventDateEnd).format("HH:mm"))) {
                alert('Start time and end time is same. ');
            }

            else {
                alert('Start time is valid, but end time is before start time. ');
            }
        }
        else if (moment(eventDateEnd).format() > moment(new Date()).format()) {
            alert('Start time is in the past.');
        }
        else {
            alert('Both times are in the past.');
        }

    }    // start Date and End Date is Same.

    else if (moment(new Date()).format("YYYY-MM-DD") !== moment(eventDate).format("YYYY-MM-DD") && moment(eventDate).format("YYYY-MM-DD") === moment(eventDateEnd).format("YYYY-MM-DD") && (moment(eventDate).format("HH:mm") > moment(eventDateEnd).format("HH:mm"))) {
        alert(' Start time is valid, but end time is before start time.');
    }

    else if (moment(new Date()).format("YYYY-MM-DD") !== moment(eventDate).format("YYYY-MM-DD") && moment(eventDate).format("YYYY-MM-DD") === moment(eventDateEnd).format("YYYY-MM-DD") && (moment(eventDate).format("HH:mm") === moment(eventDateEnd).format("HH:mm"))) {
        alert("start time and end time is same.")
    }

    // current Date and start Date is Same.
    else if (moment(new Date()).format("YYYY-MM-DD") === moment(eventDate).format("YYYY-MM-DD") && moment(eventDate).format("YYYY-MM-DD") !== moment(eventDateEnd).format("YYYY-MM-DD") && (moment(new Date()).format("HH:mm") > moment(eventDate).format("HH:mm"))) {
        alert('Start time is in the past.');
    }

    else {
        if (title) {
            return true
        } else {
            alert("Event Name is Required");
        }

    }

}

const DateValidation = ({ startDate = () => { }, endDate = () => { }, isDisabledDate = false }) => {

    const [eventDate, setEventDate] = useState(new Date())
    const [eventDateEnd, setEventDateEnd] = useState(new Date())
    const [visibleTime, setVisibleTime] = useState(false)
    const [visibleTimeEnd, setVisibleTimeEnd] = useState(false)
    const [open, setOpen] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const theme = useTheme()
    const toast = useToast()


    const onDismiss = useCallback(() => {
        setVisibleTime(false)
    }, [setVisibleTime])

    const onConfirm = useCallback(
        ({ hours, minutes }) => {
            setVisibleTime(false);
            setEventDate((prev) => {
                prev.setHours(hours)
                prev.setMinutes(minutes)
                return prev
            }
            )
            startDate(eventDate)
        },
        [setVisibleTime]
    );

    const onDismissEnd = useCallback(() => {
        setVisibleTimeEnd(false)
    }, [setVisibleTimeEnd])

    const onConfirmEnd = useCallback(
        ({ hours, minutes }) => {
            setVisibleTimeEnd(false);
            setEventDateEnd((prev) => {
                prev.setHours(hours)
                prev.setMinutes(minutes)
                return prev
            }
            )
            endDate(eventDateEnd)
        },
        [setVisibleTimeEnd]
    );

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = useCallback(
        (params) => {

            if (params.date >= new Date()) {
                setOpen(false);
                setEventDate(params.date);
                startDate(params.date)
            } else {
                setOpen(false);
                alert("Invalid date. Only dates after are allowed");
            }

        },
        [setOpen, setEventDate]
    );

    const onDismissSingleEndDate = useCallback(() => {
        setOpenEndDate(false);
    }, [setOpenEndDate]);

    const onConfirmSingleEndDate = useCallback(
        (params) => {

            if (params.date >= new Date()) {
                setOpenEndDate(false);
                endDate(params.date)
                setEventDateEnd(params.date);
            } else {
                setOpenEndDate(false);
               alert("Invalid date. Only dates after are allowed");
            }

        },
        [setOpenEndDate, setEventDateEnd]
    );



    return (
        <View style={{}}>
            <View style={{ flexDirection: "row", width: "100%", marginVertical: 15 }}>
                <View style={{ marginHorizontal: 15, width: "57%" }}>
                    <RNText title={"Start Date"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                </View>
                <View style={{ width: "40%" }}>
                    <RNText title={"Start Time"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <TouchableOpacity style={{
                    borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline,
                    width: "55%", alignSelf: "center", paddingHorizontal: 15, height: 50, flexDirection: "row", justifyContent: "space-around", alignItems: "center"
                }} activeOpacity={1} onPress={() => setOpen(true)}>
                    <RNText title={`${moment(eventDate).format("DD/MM/YYYY")}`} color={theme.colors.onBackground} fontSize={15} fontWeight="500" />
                    <FontAwesome5 name="calendar-day" size={16} color="black" />
                </TouchableOpacity>

                <DatePickerModal
                    locale="en-GB"
                    mode="single"
                    visible={open}
                    onDismiss={onDismissSingle}
                    date={eventDate}
                    validRange={isDisabledDate ? { startDate: new Date() } : { startDate: null }}
                    onConfirm={onConfirmSingle}
                />

                <TouchableOpacity style={{
                    borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline,
                    width: "40%", alignSelf: "center", paddingHorizontal: 15, height: 50, flexDirection: "row", justifyContent: "space-around", alignItems: "center"
                }} activeOpacity={1} onPress={() => setVisibleTime(true)}>
                    <RNText title={`${moment(eventDate).format("LT")}`} color={theme.colors.onBackground} fontSize={15} fontWeight="500" />
                    <MaterialCommunityIcons name="clock-time-three" size={18} color="black" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <TimePickerModal
                        visible={visibleTime}
                        onDismiss={onDismiss}
                        onConfirm={onConfirm}
                        hours={12}
                        minutes={14}
                        use24HourClock={false}
                    />
                </TouchableOpacity>

            </View>

            <View style={{ flexDirection: "row", width: "100%", marginVertical: 15 }}>
                <View style={{ marginHorizontal: 15, width: "57%" }}>
                    <RNText title={"End Date"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                </View>
                <View style={{ width: "40%" }}>
                    <RNText title={"End Time"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", alignSelf: "center", width: "100%" }}>
                <TouchableOpacity style={{
                    borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline,
                    width: "55%", alignSelf: "center", paddingHorizontal: 15, height: 50, flexDirection: "row", justifyContent: "space-around", alignItems: "center"
                }} activeOpacity={1} onPress={() => setOpenEndDate(true)}>
                    <RNText title={`${moment(eventDateEnd).format("DD/MM/YYYY")}`} color={theme.colors.onBackground} fontSize={15} fontWeight="500" />
                    <FontAwesome5 name="calendar-day" size={16} color="black" />
                </TouchableOpacity>
                <DatePickerModal
                    locale="en-GB"
                    mode="single"
                    visible={openEndDate}
                    onDismiss={onDismissSingleEndDate}
                    date={eventDateEnd}
                    onConfirm={onConfirmSingleEndDate}
                />
                <TouchableOpacity style={{
                    borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline,
                    width: "40%", alignSelf: "center", paddingHorizontal: 15, height: 50, flexDirection: "row", justifyContent: "space-around", alignItems: "center"
                }} activeOpacity={1} onPress={() => setVisibleTimeEnd(true)}>
                    <RNText title={`${moment(eventDateEnd).format("LT")}`} color={theme.colors.onBackground} fontSize={15} fontWeight="500" />
                    <MaterialCommunityIcons name="clock-time-three" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <TimePickerModal
                        visible={visibleTimeEnd}
                        onDismiss={onDismissEnd}
                        onConfirm={onConfirmEnd}
                        hours={12}
                        minutes={14}
                        use24HourClock={false}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default DateValidation











// example to use 







// import { Image, Linking, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { Avatar, useTheme } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
// import { RNText } from '../components/RNText'
// import { AntDesign, MaterialIcons, Ionicons, FontAwesome6, Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import axios from 'axios'
// import TitleBar from '../components/TitleBar'
// import { DatePickerInput, DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
// import moment from 'moment';

// import { useToast } from 'react-native-toast-notifications'
// import DateValidation, { DateFieldValidation, dateFieldValidation } from '../components/DateValidation'

// const Members = () => {
//     const theme = useTheme()
//     const navigation = useNavigation()
//     const [eventDate, setEventDate] = useState(new Date())
//     const [eventDateEnd, setEventDateEnd] = useState(new Date())
//     const [title, setTitle] = useState("sdasd")
//     const [isDisabledDate,setIsDisabledDate] = useState(false)




//     const createCalendar = () => {
//        if( dateFieldValidation(eventDate, eventDateEnd, title)){
//         console.log("success")
//        }
//     }



//     return (
//         <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level0 }}>
//             <TitleBar title={"Invite Friend"} onClick={() => navigation.goBack()} />
//             <View style={{ flex: 8 }}>
//                 <DateValidation startDate={(e) => setEventDate(e)} endDate={(e) => {setEventDateEnd(e)  }} isDisabledDate={isDisabledDate} />

//                 <TouchableOpacity style={{ marginTop: 10 }} onPress={() => createCalendar()}>
//                     <RNText title="Click me" />
//                 </TouchableOpacity>
//             </View>
//         </View >
//     )
// }

// export default Members

// const styles = StyleSheet.create({})