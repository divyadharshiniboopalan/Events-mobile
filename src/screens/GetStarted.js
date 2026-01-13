import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { scr_height, scr_width } from "../utils/Dimention";
import { RNText } from "../components/RNText";
import { useNavigation } from "@react-navigation/native";
import * as Calendar from "expo-calendar";
import { useToast } from "react-native-toast-notifications";

const GetStarted = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [stepper, setStepper] = useState(1);
  const [isallowed, setIsAllowed] = useState(false);
  const Toast = useToast();

  useEffect(() => {
    calendarRemainder();
  }, []);


  
  const openPermission = () => {
    Linking.openSettings();
  };

  const calendarRemainder = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        alert("App permission denied.Allow app to access your calendar.");
        openPermission();
      } else {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        setIsAllowed(true);
      }
    } catch (error) {
      console.log(
        "Debug ~ file: AppointmentListing.jsx:572 ~ calendarRemainder ~ error:",
        error
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {stepper == 1 && (
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 2.8, alignSelf: "center", justifyContent: "center" }}
          >
            <Image
              source={require("../assets/home1.png")}
              style={{
                height: scr_height * 0.59,
                width: 350,
                resizeMode: "cover",
              }}
            />
          </View>
          <View
            style={{
              height: 100,
              backgroundColor: theme.colors.primary,
              justifyContent: "flex-start",
              flex: 2,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          >
            <View style={{ alignItems: "center", padding: 35 }}>
              <View style={{ marginBottom: 20 }}>
                <RNText
                  title={"Explore Upcoming and"}
                  color={theme.colors.background}
                  fontSize={18}
                  fontWeight="500"
                />
                <RNText
                  title={"Nearby Events"}
                  color={theme.colors.background}
                  fontSize={18}
                  textAlign={"center"}
                  fontWeight="500"
                />
              </View>
              <View style={{}}>
                <RNText
                  title={"In publishing and graphic design,"}
                  color={"rgba(255,255,255, 0.7)"}
                  fontSize={13}
                  textAlign={"center"}
                />
                <RNText
                  title={"Lorem is a placeholder text commonly"}
                  color={"rgba(255,255,255, 0.7)"}
                  fontSize={13}
                  padding={4}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "70%",
                marginTop: 15,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setStepper(3)}>
                <RNText title={"Skip"} color={"#fcbd96"} fontSize={16} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  width: "20%",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: theme.colors.background,
                  }}
                ></View>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: "#faa36b",
                  }}
                ></View>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: "#faa36b",
                  }}
                ></View>
              </View>
              <TouchableOpacity onPress={() => setStepper(2)}>
                <RNText
                  title={"Next"}
                  color={theme.colors.background}
                  fontSize={16}
                  fontWeight="500"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {stepper == 2 && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2.6 }}>
            <Image
              source={require("../assets/home2.png")}
              style={{
                height: scr_height * 0.56,
                width: 355,
                resizeMode: "cover",
              }}
            />
          </View>
          <View
            style={{
              height: 100,
              backgroundColor: theme.colors.primary,
              justifyContent: "flex-start",
              flex: 2,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          >
            <View style={{ alignItems: "center", padding: 35 }}>
              <View style={{ marginBottom: 20 }}>
                <RNText
                  title={"Create and Find Events"}
                  color={theme.colors.background}
                  fontSize={18}
                  fontWeight="500"
                />
                <RNText
                  title={"Easily in one Place"}
                  color={theme.colors.background}
                  fontSize={18}
                  textAlign={"center"}
                  fontWeight="500"
                />
              </View>
              <View style={{}}>
                <RNText
                  title={"In this app you can create any kind of"}
                  color={"rgba(255,255,255, 0.7)"}
                  fontSize={13}
                  textAlign={"center"}
                />
                <RNText
                  title={"events and you can join all events"}
                  color={"rgba(255,255,255, 0.7)"}
                  fontSize={13}
                  padding={4}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "70%",
                marginTop: 15,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setStepper(3)}>
                <RNText title={"Skip"} color={"#fcbd96"} fontSize={16} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  width: "20%",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: "#faa36b",
                  }}
                ></View>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: theme.colors.background,
                  }}
                ></View>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: "#faa36b",
                  }}
                ></View>
              </View>
              <TouchableOpacity onPress={() => setStepper(3)}>
                <RNText
                  title={"Next"}
                  color={theme.colors.background}
                  fontSize={16}
                  fontWeight="500"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {stepper == 3 && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2.6 }}>
            <Image
              source={require("../assets/home3.png")}
              style={{ height: 400, width: 355, resizeMode: "cover" }}
            />
          </View>
          <View
            style={{
              height: 110,
              backgroundColor: theme.colors.primary,
              justifyContent: "flex-start",
              flex: 2.2,
              borderRadius: 15,
              width: "98%",
              alignSelf: "center",
            }}
          >
            <View style={{ alignItems: "center", padding: 35, marginTop: 20 }}>
              <View style={{ marginBottom: 20 }}>
                <RNText
                  title={"Watching Free"}
                  color={theme.colors.background}
                  fontSize={18}
                  fontWeight="500"
                  textAlign={"center"}
                />
                <RNText
                  title={"Concerts with Friends"}
                  color={theme.colors.background}
                  fontSize={18}
                  fontWeight="500"
                />
              </View>
              <View style={{}}>
                <RNText
                  title={"Find and booking concert tickets near"}
                  color={"rgba(255,255,255, 0.7)"}
                  fontSize={13}
                  textAlign={"center"}
                />
                <RNText
                  title={"you! Invite your friends to watch together"}
                  color={"rgba(255,255,255, 0.7)"}
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
              onPress={() =>
                isallowed
                  ? navigation.navigate("Dashboard")
                  : calendarRemainder()
              }
            >
              <RNText
                title={"GET STARTED"}
                color={theme.colors.background}
                fontSize={15}
                fontWeight="500"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default GetStarted;
