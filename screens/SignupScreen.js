import React from 'react';
import { View, StyleSheet,Image } from 'react-native';
import SignupForm from '../components/signupScreen/signupForm';

const INSTAGRAM_LOGO = '../assets/5772032.png';

function SignupScreen({navigation}) {
  
  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require(INSTAGRAM_LOGO)} />
        </View>
        <SignupForm navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100
  }
});

export default SignupScreen;