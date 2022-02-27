import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import {  bindActionCreators } from 'redux';

import NewPostScren from './../../screens/NewPostScreen';
import LoginScreen from './../../screens/LoginScreen';
import SignupScreen from './../../screens/SignupScreen';
import BottomTabs from './BottomTabs';
import Save from '../Add/Save';
import { fetchUser,fetchUserPosts } from '../../redux/actions/index';

const SignedInStack = (props) => {
    const Stack = createStackNavigator();
    
    const screenOptions = {
        headerShown: false
    }

    useEffect(() => {
        props.fetchUser();
        props.fetchUserPosts();
    },[])

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='HomeScreen' screenOptions={screenOptions}>
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="Save" component={Save} />
            <Stack.Screen name="NewPostScreen" component={NewPostScren} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
        </Stack.Navigator>
    </NavigationContainer>    
  )
}

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser,fetchUserPosts }, dispatch);
  
export default connect(null, mapDispatchProps)(SignedInStack)