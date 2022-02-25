
import { StyleSheet, Image } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { doc, onSnapshot } from 'firebase/firestore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reload } from '../../redux/actions/index';

import * as Notifications from 'expo-notifications';

import HomeScreen from '../../screens/HomeScreen';
import Media from '../Add/Media'
import NewPostScreen from '../../screens/NewPostScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import { auth, db } from '../../firebase';

const Tab = createBottomTabNavigator();

function BottomTabs({navigation}) {
  const [currentLoggedInUser,setCurrentLoggedInUser] = useState(null)
  const [unreadChats, setUnreadChats] = useState(false)
  const [lastNot, setLastNot] = useState(false)

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const getUser = () => {
    const user = auth.currentUser;

    const docRef = doc(db, "users", user.email);
    
    const unsubscribe = onSnapshot(docRef,doc => {   
        
        setCurrentLoggedInUser({
            username: doc.data().username,
            profilePicture: doc.data().profile_picture,
            email: user.email
        })   
    })
    return unsubscribe;
  }
  
  useEffect( () => {
    getUser()
  },[])

  return (    
    <Tab.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#000',
                borderTopColor: '#ddd' 
            }
        }}
    >
        <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{  
                tabBarIcon: ({ focused, color, size }) => (
                    focused ? 
                      <Image source={require('../../assets/home.png')} style={[styles.icon,styles.activeTab]} />
                    : <Image source={require('../../assets/home-inactive.png')} style={styles.icon} />
                )
            }}
        />
        <Tab.Screen 
            name="Media" 
            component={Media} 
            options={{  
                tabBarIcon: ({ focused, color, size }) => (
                    focused ? 
                      <Image source={require('../../assets/plus-2-math.png')} style={[styles.icon,styles.activeTab]} />
                    : <Image source={require('../../assets/plus-2-math.png')} style={styles.icon} />
                )
            }}            
        />

        {
            currentLoggedInUser &&
            <Tab.Screen 
                name="ProfileScreen"
                component={ProfileScreen}
                options={{  
                    tabBarIcon: ({ focused, color, size }) => (                     
                        <Image source={{uri: currentLoggedInUser.profilePicture}} style={styles.profilePic} />
                    )
                }}
            />
        }
        
    </Tab.Navigator>    
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    icon: {
        width: 30,
        height: 30
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff'
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    chats: store.userState.chats,
    friendsRequestsReceived: store.userState.friendsRequestsReceived,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ reload }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(BottomTabs);
