import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignupScreen';

const SignedoutStack = () => {
    const Stack = createStackNavigator();
    const screenOptions = {
        headerShown: false
    }
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='LoginScreen' screenOptions={screenOptions}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default SignedoutStack