import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, TouchableOpacity, Alert, AppState } from 'react-native';
import Routes from './src/Routes';
import { PaperProvider, Provider, useTheme } from 'react-native-paper';
import { darkTheme, lightTheme } from './src/components/Theme';
import { enGB, registerTranslation } from 'react-native-paper-dates'
import { ToastProvider } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import { scr_height, scr_width } from './src/utils/Dimention';
import { RNText } from './src/components/RNText';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';



export default function App() {
  const colorScheme = useColorScheme()
  const theme = useTheme()
  registerTranslation('en-GB', enGB)




  const [fontsLoaded, fontError] = useFonts({
    'Roboto_Slab': require('./src/assests/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <Provider onLayout={onLayoutRootView}>
      <PaperProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
        <ToastProvider
          duration={3000}
          placement='bottom'
          animationType='zoom-in'
          animationDuration={250}
          successColor="#22bb33"
          dangerColor="#bb2124"
          warningColor="#f0ad4e"
          normalColor="gray"
          // offset for both top and bottom toasts

          successIcon={<LottieView
            autoPlay
            loop={false}
            style={{ width: scr_width * 0.083, height: scr_height * 0.041, position: "relative", justifyContent: "center" }}
            source={require("/Users/hariharan/Documents/Divya/events-mobile/src/assests/success.json")}
          />}
          dangerIcon={<LottieView
            autoPlay
            loop={false}
            style={{ width: scr_width * 0.083, height: scr_height * 0.041, position: "relative", justifyContent: "center" }}
            source={require("/Users/hariharan/Documents/Divya/events-mobile/src/assests/error.json")}
          />}
          warningIcon={<LottieView
            autoPlay
            loop={false}
            style={{ width: 40, height: 40, position: "relative", justifyContent: "center" }}
            source={require("/Users/hariharan/Documents/Divya/events-mobile/src/assests/info.json")}
          />}
          swipeEnabled={true}

          renderToast={(toastOptions) =>
            <View style={[styles.toastContainer]}>
              <View style={{ flexDirection: "row", alignItems: "center", width: scr_width - 55 }}>
                <View>
                  {toastOptions.type == "success" && toastOptions.successIcon}
                  {toastOptions.type == "danger" && toastOptions.dangerIcon}
                  {toastOptions.type == "warning" && toastOptions.warningIcon}
                </View>
                <View style={{ marginLeft: 5, width: "100%", }}>
                  <View style={{ width: "75%" }}>
                    <RNText style={styles.toastText} title={toastOptions.message} variant={'titleMedium'} color={theme.colors.background} />
                  </View>
                </View>
              </View>

              {
                (toastOptions.button && toastOptions.onPressFunction) &&
                <TouchableOpacity onPress={toastOptions.onPressFunction} style={{ alignSelf: 'center', backgroundColor: theme.colors.outline, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 50, marginTop: 10 }}>
                  <RNText style={styles.toastText} title={toastOptions.button ? toastOptions.button : ""} variant={'titleMedium'} color={theme.colors.background} />
                </TouchableOpacity>
              }
            </View>}

        >
          <Routes />
          <StatusBar backgroundColor={"#fbede3"} />
        </ToastProvider>
      </PaperProvider>
    </Provider>
  );
}


const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 10,
    bottom: 20,
    zIndex: 999,
    width: scr_width - 60,
    alignSelf: "center",
    margin: 5
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'justify',
    left: 10,
    width: "86%"
  },
})

// import React from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';

// const BACKGROUND_FETCH_TASK = 'background-fetch';

// // 1. Define the task by providing a name and the function that should be executed
// // Note: This needs to be called in the global scope (e.g outside of your React components)
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   const now = Date.now();

//   console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

//   // Be sure to return the successful result type!
//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

// // 2. Register the task at some point in your app by providing the same name,
// // and some configuration options for how the background fetch should behave
// // Note: This does NOT need to be in the global scope and CAN be used in your React components!
// async function registerBackgroundFetchAsync() {
//   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     minimumInterval: 10, // 15 minutes
//     stopOnTerminate: false, // android only,
//     startOnBoot: true, // android only
//   });
// }

// // 3. (Optional) Unregister tasks by specifying the task name
// // This will cancel any future background fetch calls that match the given name
// // Note: This does NOT need to be in the global scope and CAN be used in your React components!
// async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
// }

// export default function App() {
//   const [isRegistered, setIsRegistered] = React.useState(false);
//   const [status, setStatus] = React.useState(null);

//   React.useEffect(() => {
//     checkStatusAsync();
//   }, []);

//   const checkStatusAsync = async () => {
//     const status = await BackgroundFetch.getStatusAsync();
//     const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
//     console.log("🚀 ~ checkStatusAsync ~ isRegistered:", isRegistered)
//     setStatus(status);
//     setIsRegistered(isRegistered);
//   };

//   const toggleFetchTask = async () => {
//     if (isRegistered) {
//       await unregisterBackgroundFetchAsync();
//     } else {
//       await registerBackgroundFetchAsync();
//     }

//     checkStatusAsync();
//   };

//   return (
//     <View style={styles.screen}>
//       <View style={styles.textContainer}>
//         <Text>
//           Background fetch status:{' '}
//           <Text style={styles.boldText}>
//             {status && BackgroundFetch.BackgroundFetchStatus[status]}
//           </Text>
//         </Text>
//         <Text>
//           Background fetch task name:{' '}
//           <Text style={styles.boldText}>
//             {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
//           </Text>
//         </Text>
//       </View>
//       <View style={styles.textContainer}></View>
//       <Button
//         title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
//         onPress={toggleFetchTask}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textContainer: {
//     margin: 10,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
// });



