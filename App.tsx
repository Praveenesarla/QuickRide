import 'react-native-reanimated';
import 'react-native-get-random-values';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Provider} from 'react-redux';

import WalletScreen from './src/screens/WalletScreen';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

import {UserProvider, useUser} from './src/context/UserContext';
import store from './src/redux/slices/store';
import ProfileScreen from './src/screens/ProfileScreen';
import QuickRide from './src/screens/QuickRide';
import ServiceCenterList from './src/screens/ServiceCenterList';
import RidesHistory from './src/screens/RidesHistory';
import RiderServiceSignup from './src/screens/RiderServiceSignup';
import ServiceCenterSignup from './src/screens/ServiceCenterSignup';
import AllRides from './src/screens/AllRides';
import {SafeAreaView, StatusBar} from 'react-native';
import SafeViewAndroid from './src/utils/SafeViewAndroid';
import OtpEnters from './src/screens/OtpEnters';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tabs (Bottom Navigation)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName;
        if (route.name === 'Service') iconName = 'miscellaneous-services';
        else if (route.name === 'Quick Ride') iconName = 'directions-car';
        else if (route.name === 'Wallet') iconName = 'account-balance-wallet';
        else if (route.name === 'Profile') iconName = 'person';
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#B82929',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>
    <Tab.Screen name="Service" component={ServiceCenterList} />
    <Tab.Screen name="Quick Ride" component={AllRides} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main Stack Navigation
const MainStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="RidePickup" component={QuickRide} />
    <Stack.Screen name="history" component={RidesHistory} />
    <Stack.Screen name="otpEnters" component={OtpEnters} />
  </Stack.Navigator>
);

// Authentication Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="RideServiceSignup" component={RiderServiceSignup} />
    <Stack.Screen name="ServiceCenterSignup" component={ServiceCenterSignup} />
  </Stack.Navigator>
);

const App = () => {
  const {user} = useUser();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
          {user ? <MainStack /> : <AuthStack />}
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default () => (
  <UserProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </UserProvider>
);
