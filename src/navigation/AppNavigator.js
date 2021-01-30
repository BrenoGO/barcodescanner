import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import WelcomeNavigator from './WelcomeNavigator';
import Welcome from '../screens/Welcome';

export default createAppContainer(
  createSwitchNavigator({
    Welcome: WelcomeNavigator,
    Main: MainTabNavigator,
  }),
  {
    default: Welcome,
  }
);
