
import { RNText } from '../components/RNText'
import { useNavigation } from '@react-navigation/native'
import { Divider, Modal, useTheme } from 'react-native-paper';
import { View, Text, Image, ScrollView, Alert, Platform, KeyboardAvoidingView, ActivityIndicator, TextInput, Linking, Share } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import * as Calendar from 'expo-calendar';
import { DatePickerInput, DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TitleBar from '../components/TitleBar';
import { useToast } from 'react-native-toast-notifications';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getAddressFromPlaceObject } from '../utils/BasicUtils';
import { scr_height, scr_width } from '../utils/Dimention';



const UpdateEvent = (props) => {
    const editData = props.route.params.updateData
    const theme = useTheme()
    const toast = useToast();
    const locationRef = useRef()
    const navigation = useNavigation()
    const [title, setTitle] = useState(editData.title);
    const [description, setDescription] = useState(editData.notes)
    const [eventDate, setEventDate] = useState(new Date(editData.startDate))
    const [eventDateEnd, setEventDateEnd] = useState(new Date(editData.endDate))
    const [visibleTime, setVisibleTime] = useState(false)
    const [visibleTimeEnd, setVisibleTimeEnd] = useState(false)
    const [open, setOpen] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [colorsList, setColorsList] = useState(editData.color)
    const listOfColors = ["#f76c11", "#633ccf", "#039be5", "#7986cb", "#33b679", "#8e24aa", "#e67c73", "#FF68A8", "#3f51b5", "#0b8043", "#D60000"]
    const [updateEventId, setupdateEventId] = useState(editData.id)


    const [location, setLocation] = useState(editData.location ? editData.location : "")
    const [openUrl, setOpenUrl] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const [reminderCount, setReminderCount] = useState(1)
    const [reminderData, setReminderData] = useState(editData.alarms ? editData.alarms : [])
    const [reminderMethod, setReminderMethod] = useState([{ type: "As notification", isCheck: true }, { type: "As email", isCheck: false }])
    const [reminderType, setReminderType] = useState([{
        type: "Minutes",
        isCheck: true
    },
    {
        type: "Hours",
        isCheck: false
    },
    {
        type: "Days",
        isCheck: false
    },
    {
        type: "Weeks",
        isCheck: false
    }])


    const toggleDropdown = () => {
        setIsVisible(!isVisible);
        setReminderCount(1)

    };
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
        },
        [setVisibleTimeEnd]
    );

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = useCallback(
        (params) => {
            setOpen(false);
            setEventDate(params.date);

        },
        [setOpen, setEventDate]
    );

    const onDismissSingleEndDate = useCallback(() => {
        setOpenEndDate(false);
    }, [setOpenEndDate]);

    const onConfirmSingleEndDate = useCallback(
        (params) => {
            setOpenEndDate(false);
            setEventDateEnd(params.date);
        },
        [setOpenEndDate, setEventDateEnd]
    );




    const updateNote = async (value) => {
        if (title) {
            try {


                const eventDetails = {
                    title: title,
                    startDate: eventDate,
                    endDate: eventDateEnd,
                    allDay: false,
                    alarms: reminderData,
                    notes: description,
                    creationDate: eventDate,
                    guestsCanInviteOthers: true,
                    guestsCanModify: true,
                    isDetached: true,
                    lastModifiedDate: true,
                    originalStartDate: eventDate,
                    location: location,
                    status: Calendar.EventStatus.NONE,

                };

                const updateNoteValue = await Calendar.updateEventAsync(value, eventDetails);
                navigation.goBack()
                alert("Event Update successfully!");

            }
            catch (error) {
                console.log("🚀  file: CalendarScreen.js:77  updateNote ~ error:", error)
            }
        } else {
            Alert.alert("Event Name is Required")
        }

    }

    useEffect(() => {
        locationAddress()
    }, [])


    const shareUrl = async () => {

        try {
            const result = await Share.share({
                message: openUrl,

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



    const locationAddress = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        setOpenUrl(googleMapsUrl)
   
    }


    const addCustomReminder = (val) => {
        let tempData = reminderMethod.map((ele) => {
            return ele.type == val.type ? { ...ele, isCheck: true } : { ...ele, isCheck: false }
        })
        setReminderMethod(tempData)
    }


    const addCustomReminderType = (val) => {
        let tempData = reminderType.map((ele) => {
            return ele.type == val.type ? { ...ele, isCheck: true } : { ...ele, isCheck: false }
        })
        setReminderType(tempData)
    }

    const removeReminderData = (idx) => {
        let tempData = reminderData.filter((e, index) => index != idx)
        setReminderData(tempData)
    }


    const addReminder = () => {
        let getreminderType = reminderType.filter((ele) => ele.isCheck == true)
        let getreminderMethod = reminderMethod.filter((ele) => ele.isCheck == true)


        let emptyData
        if (getreminderType[0].type == "Minutes") {
            emptyData = reminderCount
        } else if (getreminderType[0].type == "Hours") {
            emptyData = reminderCount * 60
        }
        else if (getreminderType[0].type == "Days") {
            emptyData = reminderCount * 1440
        }
        else if (getreminderType[0].type == "Weeks") {
            emptyData = reminderCount * 10080
        }

        let tempData = [...reminderData, {
            "relativeOffset": - Number(emptyData),
            "method": getreminderMethod[0].type == "As notification" ? "alert" : "email"
        }
        ]

        if (reminderData.length < 5) {
            setReminderData(tempData)
        }
        setReminderMethod([{ type: "As notification", isCheck: true }, { type: "As email", isCheck: false }])
        setReminderType([{ type: "Minutes", isCheck: true }, { type: "Hours", isCheck: false }, { type: "Days", isCheck: false }, { type: "Weeks", isCheck: false }])
        setIsVisible(!isVisible)

    }

    function SplitTime(numberOfHours) {
        var Days = Math.floor(numberOfHours / 24);
        var Remainder = numberOfHours % 24;
        var Hours = Math.floor(Remainder);
        var Minutes = Math.floor(60 * (Remainder - Hours));
        return ({ "Days": Days, "Hours": Hours, "Minutes": Minutes })
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TitleBar title={"Edit Event"} onClick={() => navigation.goBack()} />
            <View style={{ flex: 8, paddingHorizontal: 15, marginTop: 15 }}>
                <KeyboardAvoidingView>
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                        <View style={{}}>
                            <View style={{}}>
                                <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
                                    <RNText title={"Event Name"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                </View>
                                <TextInput
                                    value={title}
                                    onChangeText={text => setTitle(text)}
                                    style={{
                                        borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline, height: 50,
                                        width: "98%", alignSelf: "center", paddingHorizontal: 15, fontFamily: "Roboto_Slab"
                                    }} />
                            </View>


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

                            <View style={{}}>
                                <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
                                    <RNText title={"Event Description"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                </View>
                                <TextInput
                                    value={description}
                                    onChangeText={text => setDescription(text)}
                                    multiline
                                    editable
                                    numberOfLines={4}
                                    maxLength={40}
                                    style={{ borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline, height: 90, width: "98%", paddingHorizontal: 15, paddingVertical: 10, fontFamily: "Roboto_Slab" }} />
                            </View>

                            <View style={{ width: "100%" }}>
                                <View style={{ marginHorizontal: 15, marginVertical: 15, flexDirection: "row", width: "100%" }}>
                                    <View style={{ width: "72%" }}>
                                        <RNText title={"Location"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                    </View>
                                    {location != "" && <View style={{ flexDirection: "row", justifyContent: "space-between", width: "18%" }}>
                                        <TouchableOpacity onPress={() => Linking.openURL(openUrl)} style={{ borderWidth: 0.4, borderColor: theme.colors.outline, borderRadius: 999, height: 25, width: 25, justifyContent: "center", alignItems: "center" }}>
                                            <Entypo name="location" size={13} color={theme.colors.primary} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => shareUrl()} style={{ borderWidth: 0.4, borderColor: theme.colors.outline, borderRadius: 999, justifyContent: "center", alignItems: "center", height: 25, width: 25, }}>
                                            <FontAwesome6 name="location-arrow" size={14} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                    </View>}
                                </View>



                                <View style={{}}>
                                    <GooglePlacesAutocomplete
                                        placeholder={location == "" ? "Search Location" : location}
                                        disableScroll
                                        ref={locationRef}
                                        onPress={(data, detail) => {
                                            setOpenUrl(detail.url)
                                            setLocation(data.description)
                                        }}
                                        numberOfLines={5}
                                        styles={{
                                            textInputContainer: {
                                                flexDirection: 'row'
                                            },
                                            textInput: {
                                                borderRadius: 5,
                                                fontSize: 15,
                                                backgroundColor: 'white',

                                            },
                                            poweredContainer: {
                                                display: "none",
                                            },
                                            listView: {
                                                width: '100%',
                                                alignSelf: "center",
                                                backgroundColor: theme.colors.background,
                                            },
                                            row: {
                                                backgroundColor: theme.colors.background,
                                                paddingVertical: 10,
                                                paddingHorizontal: 15,
                                                width: "80%"
                                            },
                                            separator: {
                                                height: 0.5,
                                                backgroundColor: '#c8c7cc',
                                            },
                                            loader: {
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                height: scr_height * 0.07,
                                            },
                                        }}
                                        fetchDetails={true}

                                        textInputProps={{
                                            multiline: true,
                                            numberOfLines: 4,
                                            placeholderTextColor: "black",
                                            borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline, height: 80, width: "98%", paddingHorizontal: 25, paddingVertical: 10, fontFamily: "Roboto_Slab", backgroundColor: "white"
                                        }}
                                        query={{
                                            key: 'AIzaSyAD0Gka1iRjXOF5lmv8rSr28N3fMD_b0ag',
                                            language: 'en',
                                        }}
                                        renderRow={(rowData) => {
                                            const main_title = rowData.structured_formatting.main_text;
                                            const sub_title = rowData.structured_formatting.secondary_text;
                                            return (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', width: "100%" }}>
                                                    <View>
                                                        <View style={{ backgroundColor: "#fbede3", borderRadius: 999, alignItems: "center", height: scr_height * 0.045, justifyContent: "center", width: scr_width * 0.1, aspectRatio: 1 }}>
                                                            <Entypo name="location-pin" size={scr_height * 0.025} color={theme.colors.primary} />
                                                        </View>
                                                    </View>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <RNText fontWeight={'500'} title={main_title} fontSize={13} />
                                                        <RNText color={"#626262"} title={sub_title} fontSize={12} />
                                                    </View>
                                                </View>
                                            );
                                        }}
                                        renderRightButton={() => (
                                            locationRef.current?.getAddressText() &&
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{
                                                    position: "absolute",
                                                    zIndex: 1,
                                                    height: 70,
                                                    right: 5,
                                                    backgroundColor: Platform.OS === "android" && theme.colors.background,
                                                    paddingHorizontal: 5,
                                                    justifyContent: "center",
                                                    borderRadius: 999
                                                }}
                                                onPress={() => {
                                                    locationRef.current?.setAddressText(''), setLocation("")
                                                }}
                                            >
                                                {Platform.OS === "android" && <AntDesign name="close-circle" size={scr_height * 0.022} color={theme.colors.outline} />}
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>

                            </View>

                            <View style={{}}>
                                <View style={{ marginHorizontal: 15, marginVertical: 15, flexDirection: "row", justifyContent: "space-between" }}>
                                    <RNText title={"Notification"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                                    <TouchableOpacity style={{ paddingHorizontal: 8, borderRadius: 5, paddingVertical: 3, marginLeft: 15 }} onPress={() => toggleDropdown()}>
                                        <RNText title={"Add"} color={theme.colors.primary} fontSize={14} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
                                    {reminderData.length != 0 && reminderData.map((ele, idx) => {
                                        let emptyData
                                        let postiveNo = Math.abs(ele.relativeOffset)
                                        if (postiveNo < 60) {
                                            emptyData = `${postiveNo} minutes`
                                        } else {
                                            let tempData = SplitTime(postiveNo / 60)
                                            emptyData = tempData.Days == 0 ? `${tempData.Hours} hour` : tempData.Hours != 0 ? `${tempData.Days} day ${tempData.Hours} hour` : `${tempData.Days} day`

                                        }
                                        return (
                                            <View key={idx} style={{ marginBottom: 10, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", columnGap: 5, borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 25, alignSelf: "center", margin: 5, paddingVertical: 6 }}>
                                                <View style={{}}>
                                                    <RNText title={Platform.OS == "android" ? ele.method == "alert" ? `${emptyData}  before` : `${emptyData}  before as email` : `${emptyData}  before`} color={theme.colors.onBackground} fontSize={14} />
                                                </View>
                                                <TouchableOpacity onPress={() => removeReminderData(idx)}>
                                                    <AntDesign name="close" size={14} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }
                                    )}

                                </View>

                            </View>

                        </View>
                        <View style={{ marginTop: 100, position: "relative" }}>
                            <TouchableOpacity style={{ flexDirection: "row", width: "80%", height: 60, alignSelf: "center", alignItems: "center", backgroundColor: "#2e272a", borderRadius: 15, justifyContent: "center" }} onPress={() => updateNote(updateEventId)}>
                                <RNText title={"UPDATE EVENT"} color={theme.colors.background} fontSize={15} fontWeight="500" />
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>


            <Modal visible={isVisible} animationType="slide" onDismiss={() => setIsVisible(!isVisible)}>
                <View style={{ backgroundColor: "white", height: scr_height - 350, width: scr_width - 50, justifyContent: "center", alignSelf: "center", borderRadius: 15 }}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ marginVertical: 10 }}>
                            <RNText title={"Custom Notification"} fontSize={15} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" />
                        </View>
                        <View>
                            <TextInput
                                value={"" + reminderCount}
                                onChangeText={text => setReminderCount(text)}
                                style={{ borderRadius: 10, borderWidth: 0.5, borderColor: theme.colors.outline, height: 45, width: "98%", paddingHorizontal: 15, paddingVertical: 10, fontFamily: "Roboto_Slab" }} />
                        </View>

                        <View style={{ marginVertical: 20 }}>
                            {reminderType.map((ele, index) => (
                                <TouchableOpacity style={{ flexDirection: "row", width: "100%", marginBottom: 10 }} key={index} activeOpacity={0.7} onPress={() => addCustomReminderType(ele)}>
                                    <View style={{ width: "13%" }}>
                                        {!ele.isCheck ?
                                            <Fontisto name="radio-btn-passive" size={18} color={theme.colors.primary} /> :
                                            <Fontisto name="radio-btn-active" size={18} color={theme.colors.primary} />
                                        }
                                    </View>
                                    <View style={{ width: "80%" }}>
                                        <RNText title={ele.type} fontSize={14} color={theme.colors.onBackground} />
                                    </View>
                                </TouchableOpacity>
                            ))
                            }
                        </View>
                        {/* {Platform.OS == "android" && <View>
                            <Divider />
                            <View style={{ marginVertical: 20 }}>
                                {reminderMethod.map((ele, inx) => (
                                    <TouchableOpacity style={{ flexDirection: "row", width: "100%", marginBottom: 10 }} key={inx} activeOpacity={0.7} onPress={() => addCustomReminder(ele)}>
                                        <View style={{ width: "13%" }}>
                                            {!ele.isCheck ? <Fontisto name="radio-btn-passive" size={18} color={theme.colors.primary} /> :
                                                <Fontisto name="radio-btn-active" size={18} color={theme.colors.primary} />}
                                        </View>
                                        <View style={{ width: "87%" }}>
                                            <RNText title={ele.type} fontSize={14} color={theme.colors.onBackground} />
                                        </View>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
                        </View>} */}
                        <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => addReminder()}>
                            <RNText title={"Done"} fontSize={14} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    )
}

export default UpdateEvent