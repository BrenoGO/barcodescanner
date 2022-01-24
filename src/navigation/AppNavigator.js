import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
// import WelcomeNavigator from './WelcomeNavigator';
import Welcome from '../screens/Welcome';

// export default createAppContainer(
//   createSwitchNavigator({
//     Welcome: WelcomeNavigator,
//     Main: MainTabNavigator,
//   }),
//   {
//     default: Welcome,
//   }
// );

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
