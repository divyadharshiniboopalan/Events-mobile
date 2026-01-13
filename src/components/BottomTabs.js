import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Foundation } from '@expo/vector-icons';
import { RNText } from './RNText';
import Events from '../screens/Events';
import CreateEvents from '../screens/CreateEvents';
import Notes from '../screens/Notes';
import { tabView } from '../utils/DeviceType';
import { scr_height } from '../utils/Dimention';


const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    const theme = useTheme()
    return (

        <Tab.Navigator
            initialRouteName="Events"

            screenOptions={{
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: { backgroundColor: "red", paddingTop: 15, borderTopWidth: 0, },
            }}>
            <Tab.Screen
                name="Events"
                component={Events}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <MaterialIcons name="event" size={tabView ? scr_height * 0.030 : scr_height * 0.02} color={focused ? theme.colors.primary : theme.colors.onBackground} />
                            <View style={{ paddingTop: 3 }}>
                                <RNText title={"Events"} fontSize={10} color={focused ? theme.colors.primary : theme.colors.onBackground} variant="bodyMedium" />
                            </View>
                        </View>
                    ),
                }} />

            <Tab.Screen
                name="CreateEvents"
                component={CreateEvents}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <FontAwesome name="plus" size={24} color={focused ? theme.colors.primary : theme.colors.onBackground} />

                        </View>
                    ),
                }} />
            <Tab.Screen
                name="Notes"
                component={Notes}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 2 }}>
                            <Foundation name="clipboard-notes" size={tabView ? scr_height * 0.027 : scr_height * 0.02} color={focused ? theme.colors.primary : theme.colors.onBackground} />
                            <View style={{ paddingTop: 4 }}>
                                <RNText title={"Notes"} fontSize={10} color={focused ? theme.colors.primary : theme.colors.onBackground} variant="bodyMedium" />
                            </View>
                        </View>
                    ),
                }} />
        </Tab.Navigator>
    )
}

export default BottomTabs