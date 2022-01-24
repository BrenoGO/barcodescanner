import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FieldScreen from '../screens/FieldScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Início') {
            return <TabBarIcon
              focused={focused}
              name={
                Platform.OS === 'ios'
                  ? `ios-information-circle${focused ? '' : '-outline'}`
                  : 'md-information-circle'
              }
            />
          }
          if (route.name === 'Leitor') {
            return <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
          }
          if (route.name === 'Digitar') {
            return <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
          }
          if (route.name === 'Configuração') {
            return <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
          }
        },
        // tabBarActiveTintColor: 'tomato',
        // tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        component={HomeScreen}
        name="Início"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={ScannerScreen}
        name="Leitor"
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={FieldScreen}
        name="Digitar"
        tabBarIcon={({ focused }) => (
          <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
        )}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name="Configuração"
        options={{
          headerShown: false,
        }}
      />
      
    </Tab.Navigator>
  )
}

/*
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const ScannerStack = createStackNavigator(
  {
    Scanner: ScannerScreen,
  },
  config
);

ScannerStack.navigationOptions = {
  tabBarLabel: 'Scanner',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

ScannerStack.path = '';

const FieldStack = createStackNavigator(
  {
    Field: FieldScreen,
  },
  config
);

FieldStack.navigationOptions = {
  tabBarLabel: 'Field',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

FieldStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  ScannerStack,
  FieldStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
*/
