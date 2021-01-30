import { createStackNavigator } from 'react-navigation-stack';

import WelcomeScreen from '../screens/Welcome';

const WelcomeStack = createStackNavigator(
  {
    Welcome: WelcomeScreen,
  },
  {
    screenOptions: {
      headerShown: false
    }
  }
);

export default WelcomeStack;