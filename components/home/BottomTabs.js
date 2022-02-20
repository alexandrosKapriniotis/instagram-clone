import { StyleSheet, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import NewPostScreen from '../../screens/NewPostScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

//   const Icon = ({icon}) => {
//     <TouchableOpacity onPress={() => setActiveTab(icon.name)}>
//         <Image source={{uri: icon.active}} style={styles.icon} />
//     </TouchableOpacity>
//   }

  return (
    // <View style={styles.container}>
    //   {icons.map((icon,index) => {
    //       <Icon key={index} icon={icon} />
    //   })}
    // </View>
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
            name="Add new post" 
            component={NewPostScreen} 
            options={{  
                tabBarIcon: ({ focused, color, size }) => (
                    focused ? 
                      <Image source={require('../../assets/plus-2-math.png')} style={[styles.icon,styles.activeTab]} />
                    : <Image source={require('../../assets/plus-2-math.png')} style={styles.icon} />
                )
            }}
        />
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
    activeTab: {

    },
    profilePic: (activeTab = '') => ({
        borderRadius: 50,
        borderWidth: activeTab === 'Profile' ? 2 : 0,
        borderColor: '#fff'
    })
})