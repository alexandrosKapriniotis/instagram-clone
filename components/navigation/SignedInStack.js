import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import {  bindActionCreators } from 'redux';

import NewPostScreen from './../../screens/NewPostScreen';
import EditScreen from './../../screens/EditScreen';
import LoginScreen from './../../screens/LoginScreen';
import SignupScreen from './../../screens/SignupScreen';
import CommentsScreen from '../../screens/CommentsScreen';
import Post from '../home/Post';
import BottomTabs from './BottomTabs';
import Save from '../Add/Save';
import { fetchUser,fetchUserPosts,fetchUserFollowing,clearData } from '../../redux/actions/index';

const SignedInStack = (props) => {
    const Stack = createStackNavigator();
    
    const screenOptions = {
        headerShown: false
    }

    useEffect(() => {
        props.clearData();
        props.fetchUser();
        props.fetchUserPosts();
        props.fetchUserFollowing();        
    },[])

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='BottomTabs' screenOptions={screenOptions}>
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="Save" component={Save} />
            <Stack.Screen name="NewPostScreen" component={NewPostScreen} />            
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="EditScreen" component={EditScreen} />        
            <Stack.Screen name="CommentsScreen" component={CommentsScreen} />        
            <Stack.Screen name="Post" component={Post} />        
        </Stack.Navigator>
    </NavigationContainer>    
  )
}

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser,fetchUserPosts,fetchUserFollowing,clearData }, dispatch);
  
export default connect(null, mapDispatchProps)(SignedInStack)