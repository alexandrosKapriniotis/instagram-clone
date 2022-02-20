import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import NewPostScren from './NewPostScreen';

const Stack = createStackNavigator();

const screenOptions = {
    headerShown: false
}
const SignedInStack = () => (
    <Stack.Navigator initialRouteName='HomeScreen' screenOptions={screenOptions}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NewPostScreen" component={NewPostScren} />
    </Stack.Navigator>
)


const styles = StyleSheet.create({})

export default SignedInStack