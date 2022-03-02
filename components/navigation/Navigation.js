import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider,connect } from 'react-redux';
import { applyMiddleware, createStore,bindActionCreators } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../../redux/reducers';
import NewPostScren from '../../screens/NewPostScreen';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignupScreen';
import BottomTabs from './BottomTabs';
import Save from '../Add/Save';

const Stack = createStackNavigator();
const store = createStore(rootReducer, applyMiddleware(thunk))

const screenOptions = {
    headerShown: false
}

const SignedInStack = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomeScreen' screenOptions={screenOptions}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Save" component={Save} />
        <Stack.Screen name="NewPostScreen" component={NewPostScren} />        
      </Stack.Navigator>
    </NavigationContainer>   
  </Provider>   
)

export const SignedoutStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='LoginScreen' screenOptions={screenOptions}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  </NavigationContainer>      
)

export default SignedInStack