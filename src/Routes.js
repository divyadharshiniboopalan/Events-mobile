import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import GetStarted from './screens/GetStarted';
import Dashboard from './screens/Dashboard';
import Events from './screens/Events';
import CreateEvents from './screens/CreateEvents';
import Notes from './screens/Notes';
import Members from './screens/Members';
import ReadNotesPage from './screens/ReadNotesPage';
import Completed from './screens/Completed';
import CalendarScreen from './screens/CalendarScreen';
import UpdateEvent from './screens/UpdateEvent';
import Pending from './screens/Pending';
import Total from './screens/Total';
import TodayEvents from './screens/TodayEvents';
import DocumentScanner from './screens/DocumentScanner';

const Routes = () => {
    const Stack = createNativeStackNavigator();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen options={{ headerShown: false }} name="GetStarted" component={GetStarted} />
                        <Stack.Screen options={{ headerShown: false }} name="Dashboard" component={Dashboard} />
                        <Stack.Screen options={{ headerShown: false }} name="Events" component={Events} />
                        <Stack.Screen options={{ headerShown: false }} name="CreateEvents" component={CreateEvents} />
                        <Stack.Screen options={{ headerShown: false }} name="Notes" component={Notes} />
                        <Stack.Screen options={{ headerShown: false }} name="Members" component={Members} />
                        <Stack.Screen options={{ headerShown: false }} name="ReadNotesPage" component={ReadNotesPage} />
                        <Stack.Screen options={{ headerShown: false }} name="Completed" component={Completed} />
                        <Stack.Screen options={{ headerShown: false }} name="CalendarScreen" component={CalendarScreen} />
                        <Stack.Screen options={{ headerShown: false }} name="UpdateEvent" component={UpdateEvent} />
                        <Stack.Screen options={{ headerShown: false }} name="Pending" component={Pending} />
                        <Stack.Screen options={{ headerShown: false }} name="Total" component={Total} />
                        <Stack.Screen options={{ headerShown: false }} name="TodayEvents" component={TodayEvents}/>
                        <Stack.Screen options={{ headerShown: false }} name="DocumentScanner" component={DocumentScanner}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default Routes