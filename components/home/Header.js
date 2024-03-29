import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from '../../firebase';

function Header({navigation}) {

  const handleSignout = async () => {
    const auth = getAuth(firebaseApp);

    signOut(auth).then(() => {
      console.log('Sign-out successful.');
      navigation.push('LoginScreen')
    }).catch((error) => {
      console.log(error.message)
    });
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={handleSignout}>
            <Image 
                style={styles.logo} 
                source={require('../../assets/header-logo.png')} 
            />
        </TouchableOpacity>

        <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={ () => navigation.push('NewPostScreen')}>
                <Image 
                    style={styles.icon} 
                    source={require('../../assets/plus-2-math.png')} 
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image 
                    style={styles.icon} 
                    source={require('../../assets/like--v1.png')} 
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>11</Text>
                </View>
                <Image 
                    style={styles.icon} 
                    source={require('../../assets/facebook-messenger.png')} 
                />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    paddingTop: 20    
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain'
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain'
  },
  unreadBadge: {
    backgroundColor: '#FF3250',
    position: 'absolute',
    left: 20,
    bottom: 18,
    width: 32,
    height: 22,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  unreadBadgeText: {
    color: '#fff',
    fontWeight: '600'
  },
  iconsContainer: {
    flexDirection: "row"
  },
  text: {
      color: 'white'
  }
});

export default Header;