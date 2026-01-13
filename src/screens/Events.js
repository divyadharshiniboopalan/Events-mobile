import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ScrollView,
  ActivityIndicator,
  SectionList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Menu,
  useTheme,
  Entypo,
  Divider,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import { RNText } from "../components/RNText";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { scr_height } from "../utils/Dimention";
import { useNavigation } from "@react-navigation/native";
import * as Calendar from "expo-calendar";
import moment from "moment";
import LottieLoader from "../components/LottieLoader";
import { useToast } from "react-native-toast-notifications";

export default function Events() {
  const theme = useTheme();
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [ChooseEventsType, setchooseEventsType] = useState("Upcoming");
  const [upcomingEvents, setupcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [listingLoader, setListingLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [DeleteDailogVisible, setDeleteDailogVisible] = useState(false);
  const [updateEventId, setupdateEventId] = useState("");
  const [title, setTitle] = useState("");
  const [loader, setLoader] = useState(false);
  const toast = useToast();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const showVirtualDeleteDialog = () => setDeleteDailogVisible(true);
  const hideDeleteDialog = () => setDeleteDailogVisible(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCalendarData();
    });
    return unsubscribe;
  }, []);

  const getEventId = async (calendars) => {
    let allEvents = [];
    let all = await Promise.all(
      calendars.map(async (ele) => {
        let events = await Calendar.getEventsAsync(
          [ele.id],
          new Date(2023, 0, 1, 0, 0, 0, 0),
          new Date(2035, 0, 1, 0, 0, 0, 0)
        );
        let tempData = events.map((item) => ({
          ...item,
          ...{ color: ele.color },
        }));
        allEvents = [...allEvents, ...tempData];
      })
    );
    return allEvents;
  };

  const getEventIdHolidays = async (calendars) => {
    let allEvents = calendars.map((ele) => ele.id);
    let events = await Calendar.getEventsAsync(
      allEvents,
      new Date(2023, 0, 1, 0, 0, 0, 0),
      new Date(2035, 0, 1, 0, 0, 0, 0)
    );
    return events;
  };

  const getCalendarData = async () => {
    try {
      setListingLoader(true);
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const newCalendatData = await getEventId(calendars);
      let FilteredData = newCalendatData.filter((ele) => ele.allDay == false);
      const newCalendatDataholiday = await getEventIdHolidays(calendars);
      setHolidays(newCalendatDataholiday);

      let upcomingEventsData = FilteredData.filter((value) => {
        return moment(value.startDate).format() >= moment(new Date()).format();
      });

      let pastEventsData = FilteredData.filter((value) => {
        return moment(value.startDate).format() <= moment(new Date()).format();
      });

      setupcomingEvents(
        upcomingEventsData.sort(function (a, b) {
          if (a.startDate < b.startDate) {
            return -1;
          }
          if (a.startDate > b.startDate) {
            return 1;
          }
          return 0;
        })
      );

      setPastEvents(pastEventsData.reverse());
      setListingLoader(false);
    } catch (error) {
      console.log("🚀  getCalendarData  error:", error);
    } finally {
      setListingLoader(false);
    }
  };

  const deleteNote = async (id) => {
    setLoader(true);
    const deleteCalendarValue = await Calendar.deleteEventAsync(id, {
      futureEvents: true,
    });

    const tempData = upcomingEvents.filter((ele) => ele.id != id);
    setupcomingEvents(tempData);

    const pasttempData = pastEvents.filter((ele) => ele.id != id);
    setPastEvents(pasttempData);
    alert("Event deleted successfully!");
    setLoader(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level0 }}>
      <View
        style={{
          flex: 0.7,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#fbede3",
          justifyContent: "space-between",
        }}
      >
        <AntDesign
          name="arrow-left"
          size={22}
          color={theme.colors.primary}
          onPress={() => navigation.goBack()}
        />
        <RNText
          title={"Events"}
          fontSize={20}
          color={theme.colors.primary}
          variant="bodyMedium"
          fontWeight="500"
        />
        <TouchableOpacity
          style={{ marginHorizontal: 5 }}
          onPress={() => navigation.navigate("CalendarScreen")}
        >
          <FontAwesome5
            name="calendar-day"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: scr_height * 0.08,
          backgroundColor: "#f3f3f3",
          width: "90%",
          borderRadius: 15,
          alignSelf: "center",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          padding: 10,
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          style={{
            width: "30%",
            backgroundColor:
              ChooseEventsType === "Upcoming"
                ? theme.colors.background
                : "#f3f3f3",
            height: scr_height * 0.06,
            alignSelf: "center",
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={() => setchooseEventsType("Upcoming")}
          activeOpacity={1}
        >
          <RNText
            title={"UPCOMING"}
            fontSize={12}
            color={
              ChooseEventsType === "Upcoming" ? theme.colors.primary : "#8a8c8f"
            }
            variant="bodyMedium"
            fontWeight="500"
            textAlign="center"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "30%",
            backgroundColor:
              ChooseEventsType === "PastEvents"
                ? theme.colors.background
                : "#f3f3f3",
            height: scr_height * 0.06,
            alignSelf: "center",
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={() => setchooseEventsType("PastEvents")}
          activeOpacity={1}
        >
          <RNText
            title={"PAST EVENTS"}
            fontSize={12}
            color={
              ChooseEventsType === "PastEvents"
                ? theme.colors.primary
                : "#8a8c8f"
            }
            variant="bodyMedium"
            fontWeight="500"
            textAlign="center"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "30%",
            backgroundColor:
              ChooseEventsType === "Holidays"
                ? theme.colors.background
                : "#f3f3f3",
            height: scr_height * 0.06,
            alignSelf: "center",
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={() => setchooseEventsType("Holidays")}
          activeOpacity={1}
        >
          <RNText
            title={"HOLIDAYS"}
            fontSize={12}
            color={
              ChooseEventsType === "Holidays" ? theme.colors.primary : "#8a8c8f"
            }
            variant="bodyMedium"
            fontWeight="500"
            textAlign="center"
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 8 }}>
        {ChooseEventsType === "Upcoming" && (
          <View style={{ marginTop: 10 }}>
            {listingLoader ? (
              <View style={{ justifyContent: "center", marginTop: "50%" }}>
                <LottieLoader />
              </View>
            ) : (
              <FlatList
                data={upcomingEvents}
                keyExtractor={(ele, index) => (ele.id + index).toString()}
                ListFooterComponent={<View style={{ height: 100 }}></View>}
                ListEmptyComponent={
                  <View style={{ marginTop: 60, alignItems: "center" }}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={require("../assets/noevent.png")}
                        style={{
                          height: 300,
                          width: 300,
                          resizeMode: "cover",
                          borderRadius: 20,
                        }}
                      />
                    </View>
                    <View style={{ alignItems: "center", marginVertical: 30 }}>
                      {/* <RNText title={`No Events Available`} fontSize={20} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" /> */}
                      <View style={{}}>
                        <RNText
                          title={"Find and booking concert tickets near"}
                          color={"#9597a4"}
                          fontSize={13}
                          textAlign={"center"}
                        />
                        <RNText
                          title={"you! Invite your friends to watch together"}
                          color={"#9597a4"}
                          fontSize={13}
                          padding={4}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        width: "80%",
                        height: 60,
                        alignSelf: "center",
                        alignItems: "center",
                        backgroundColor: "#2e272a",
                        borderRadius: 15,
                        justifyContent: "center",
                      }}
                      onPress={() => navigation.navigate("CreateEvents")}
                    >
                      <RNText
                        title={"EXPLORE EVENTS"}
                        color={theme.colors.background}
                        fontSize={15}
                        fontWeight="500"
                      />
                    </TouchableOpacity>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      width: "90%",
                      backgroundColor: "white",
                      margin: 5,
                      alignSelf: "center",
                      borderLeftWidth: 5,
                      borderColor: item.color,
                    }}
                  >
                    <Card.Content>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ width: "20%" }}>
                          <Image
                            source={require("../assets/home2.png")}
                            style={{ width: 40, height: 40,borderRadius:50 }}
                            resizeMode={"cover"}
                          />
                        </View>
                        <View style={{}}>
                          <View
                            style={{ marginBottom: 8, flexDirection: "row" }}
                          >
                            <View style={{ width: "82%" }}>
                              <RNText
                                title={item.title}
                                color={theme.colors.primary}
                                fontSize={15}
                                fontWeight="500"
                              />
                            </View>
                            <View>
                              <Menu
                                visible={visible == item.startDate}
                                onDismiss={closeMenu}
                                contentStyle={{
                                  backgroundColor: "white",
                                  top: 25,
                                  left: 50,
                                  width: "82%",
                                }}
                                anchor={
                                  <TouchableOpacity
                                    onPress={() => setVisible(item.startDate)}
                                  >
                                    <MaterialCommunityIcons
                                      name="dots-vertical"
                                      size={scr_height * 0.026}
                                      color={"black"}
                                    />
                                  </TouchableOpacity>
                                }
                              >
                                <Menu.Item
                                  onPress={() => {
                                    closeMenu(),
                                      navigation.navigate("UpdateEvent", {
                                        updateData: item,
                                      });
                                  }}
                                  title="Edit"
                                  leadingIcon={"playlist-edit"}
                                />
                                <Divider />
                                <Menu.Item
                                  onPress={() => {
                                    showVirtualDeleteDialog(),
                                      setupdateEventId(item.id),
                                      closeMenu(),
                                      setTitle(item.title);
                                  }}
                                  title="Delete"
                                  titleStyle={{ color: "red" }}
                                  leadingIcon={() => (
                                    <MaterialCommunityIcons
                                      name="trash-can-outline"
                                      size={21}
                                      color="red"
                                    />
                                  )}
                                />
                              </Menu>
                            </View>
                          </View>
                          {item.notes && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                                width: "80%",
                                columnGap: 6,
                              }}
                            >
                              <MaterialIcons
                                name="event-note"
                                size={15}
                                color="black"
                              />
                              <RNText
                                title={item.notes}
                                color={theme.colors.onBackground}
                                fontSize={14}
                              />
                            </View>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 5,
                              columnGap: 6,
                            }}
                          >
                            <MaterialIcons
                              name="event"
                              size={15}
                              color="black"
                            />
                            <RNText
                              title={`${moment(item.startDate).format(
                                "DD-MMM-YYYY"
                              )} to ${moment(item.endDate).format(
                                "DD-MMM-YYYY"
                              )}`}
                              color={theme.colors.onBackground}
                              fontSize={13}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 5,
                              columnGap: 6,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="calendar-clock"
                              size={15}
                              color="black"
                            />
                            <RNText
                              title={`${moment(item.startDate).format(
                                "LT"
                              )} - ${moment(item.endDate).format("LT")}`}
                              color={theme.colors.onBackground}
                              fontSize={13}
                            />
                          </View>
                       
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}
              />
            )}
          </View>
        )}

        {ChooseEventsType === "PastEvents" && (
          <View style={{ marginTop: 10 }}>
            {listingLoader ? (
              <View style={{ justifyContent: "center", marginTop: "50%" }}>
                <LottieLoader />
              </View>
            ) : (
              <FlatList
                data={pastEvents}
                keyExtractor={(ele, index) => (ele.id + index).toString()}
                ListFooterComponent={<View style={{ height: 100 }}></View>}
                ListEmptyComponent={
                  <View style={{ marginTop: 60, alignItems: "center" }}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={require("../assets/noevent.png")}
                        style={{
                          height: 300,
                          width: 300,
                          resizeMode: "cover",
                          borderRadius: 20,
                        }}
                      />
                    </View>
                    <View style={{ alignItems: "center", marginVertical: 30 }}>
                      {/* <RNText title={`No Events Available`} fontSize={20} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" /> */}
                      <View style={{}}>
                        <RNText
                          title={"Find and booking concert tickets near"}
                          color={"#9597a4"}
                          fontSize={13}
                          textAlign={"center"}
                        />
                        <RNText
                          title={"you! Invite your friends to watch together"}
                          color={"#9597a4"}
                          fontSize={13}
                          padding={4}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        width: "80%",
                        height: 60,
                        alignSelf: "center",
                        alignItems: "center",
                        backgroundColor: "#2e272a",
                        borderRadius: 15,
                        justifyContent: "center",
                      }}
                      onPress={() => navigation.navigate("CreateEvents")}
                    >
                      <RNText
                        title={"EXPLORE EVENTS"}
                        color={theme.colors.background}
                        fontSize={15}
                        fontWeight="500"
                      />
                    </TouchableOpacity>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      width: "90%",
                      backgroundColor: "white",
                      margin: 5,
                      alignSelf: "center",
                      borderLeftWidth: 5,
                      borderColor: item.color,
                    }}
                  >
                    <Card.Content>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ width: "20%" }}>
                          <Image
                            source={require("../assets/home2.png")}
                            style={{ width: 40, height: 40,borderRadius:50 }}
                            resizeMode={"cover"}
                          />
                        </View>
                        <View style={{}}>
                          <View
                            style={{ marginBottom: 8, flexDirection: "row" }}
                          >
                            <View style={{ width: "82%" }}>
                              <RNText
                                title={item.title}
                                color={theme.colors.primary}
                                fontSize={15}
                                fontWeight="500"
                              />
                            </View>
                            <View>
                              <Menu
                                visible={visible == item.startDate}
                                onDismiss={closeMenu}
                                contentStyle={{
                                  backgroundColor: "white",
                                  top: 25,
                                  left: 50,
                                  width: "82%",
                                }}
                                anchor={
                                  <TouchableOpacity
                                    onPress={() => setVisible(item.startDate)}
                                  >
                                    <MaterialCommunityIcons
                                      name="dots-vertical"
                                      size={scr_height * 0.026}
                                      color={"black"}
                                    />
                                  </TouchableOpacity>
                                }
                              >
                                <Menu.Item
                                  onPress={() => {
                                    closeMenu(),
                                      navigation.navigate("UpdateEvent", {
                                        updateData: item,
                                      });
                                  }}
                                  title="Edit"
                                  leadingIcon={"playlist-edit"}
                                />
                                <Divider />
                                <Menu.Item
                                  onPress={() => {
                                    showVirtualDeleteDialog(),
                                      setupdateEventId(item.id),
                                      closeMenu(),
                                      setTitle(item.title);
                                  }}
                                  title="Delete"
                                  titleStyle={{ color: "red" }}
                                  leadingIcon={() => (
                                    <MaterialCommunityIcons
                                      name="trash-can-outline"
                                      size={21}
                                      color="red"
                                    />
                                  )}
                                />
                              </Menu>
                            </View>
                          </View>
                          {item.notes && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                                width: "80%",
                                columnGap: 6,
                              }}
                            >
                              <MaterialIcons
                                name="event-note"
                                size={15}
                                color="black"
                              />
                              <RNText
                                title={item.notes}
                                color={theme.colors.onBackground}
                                fontSize={14}
                              />
                            </View>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 5,
                              columnGap: 6,
                            }}
                          >
                            <MaterialIcons
                              name="event"
                              size={15}
                              color="black"
                            />
                            <RNText
                              title={`${moment(item.startDate).format(
                                "DD-MMM-YYYY"
                              )} to ${moment(item.endDate).format(
                                "DD-MMM-YYYY"
                              )}`}
                              color={theme.colors.onBackground}
                              fontSize={13}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              columnGap: 6,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="calendar-clock"
                              size={15}
                              color="black"
                            />
                            <RNText
                              title={`${moment(item.startDate).format(
                                "LT"
                              )} - ${moment(item.endDate).format("LT")}`}
                              color={theme.colors.onBackground}
                              fontSize={13}
                            />
                          </View>
                          
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}
              />
            )}
          </View>
        )}

        {ChooseEventsType === "Holidays" && (
          <View style={{ marginTop: 10 }}>
            {listingLoader ? (
              <View style={{ justifyContent: "center", marginTop: "50%" }}>
                <LottieLoader />
              </View>
            ) : (
              <FlatList
                data={holidays}
                keyExtractor={(ele, index) => (ele.id + index).toString()}
                ListFooterComponent={<View style={{ height: 100 }}></View>}
                ListEmptyComponent={
                  <View style={{ marginTop: 60, alignItems: "center" }}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={require("../assets/noevent.png")}
                        style={{
                          height: 300,
                          width: 300,
                          resizeMode: "cover",
                          borderRadius: 20,
                        }}
                      />
                    </View>
                    <View style={{ alignItems: "center", marginVertical: 30 }}>
                      {/* <RNText title={`No Events Available`} fontSize={20} color={theme.colors.onBackground} variant="bodyMedium" fontWeight="500" /> */}
                      <View style={{}}>
                        <RNText
                          title={"Find and booking concert tickets near"}
                          color={"#9597a4"}
                          fontSize={13}
                          textAlign={"center"}
                        />
                        <RNText
                          title={"you! Invite your friends to watch together"}
                          color={"#9597a4"}
                          fontSize={13}
                          padding={4}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        width: "80%",
                        height: 60,
                        alignSelf: "center",
                        alignItems: "center",
                        backgroundColor: "#2e272a",
                        borderRadius: 15,
                        justifyContent: "center",
                      }}
                      onPress={() => navigation.navigate("CreateEvents")}
                    >
                      <RNText
                        title={"EXPLORE EVENTS"}
                        color={theme.colors.background}
                        fontSize={15}
                        fontWeight="500"
                      />
                    </TouchableOpacity>
                  </View>
                }
                renderItem={({ item, index }) =>
                  item.allDay == false ||
                  (item.organizerEmail !=
                    "addressbook#contacts@group.v.calendar.google.com" && (
                    <View>
                      <Card
                        style={{
                          width: "90%",
                          backgroundColor: "white",
                          margin: 5,
                          borderLeftWidth: 5,
                          borderColor: "#33b679",
                          alignSelf: "flex-end",
                          marginHorizontal: 20,
                        }}
                      >
                        <Card.Content>
                          <RNText
                            title={item.title}
                            color={theme.colors.primary}
                            fontSize={15}
                            fontWeight="500"
                          />
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 5,
                              columnGap: 6,
                            }}
                          >
                            <MaterialIcons
                              name="event"
                              size={15}
                              color="black"
                            />
                            <RNText
                              title={moment(item.startDate).format(
                                "DD-MMM-YYYY"
                              )}
                              fontSize={13}
                            />
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                  ))
                }
              />
            )}
          </View>
        )}
      </View>

      <Portal>
        <Dialog
          visible={DeleteDailogVisible}
          onDismiss={hideDeleteDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title style={{ fontFamily: "Roboto_Slab" }}>
            Alert
          </Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                flexWrap: "wrap",
              }}
            >
              <RNText title={"Are you sure, want to delete"} fontSize={14} />
              <RNText
                title={`  ${title} `}
                fontSize={15}
                color={theme.colors.primary}
              />
              <RNText title={"Event ?"} fontSize={14} />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog} textColor={"black"}>
              Cancel
            </Button>
            <View style={{ position: "relative" }}>
              {!loader ? (
                <Button
                  onPress={() => {
                    deleteNote(updateEventId), hideDeleteDialog();
                  }}
                  textColor={"red"}
                >
                  Delete
                </Button>
              ) : (
                <Button textColor={"red"}>Deleting...</Button>
              )}
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
