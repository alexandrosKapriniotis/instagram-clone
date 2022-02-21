import React from 'react';
import { View, StyleSheet,Image } from 'react-native';
import LoginForm from '../components/loginScreen/LoginForm';

const INSTAGRAM_LOGO = '../assets/5772032.png';

function LoginScreen({navigation}) {
  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require(INSTAGRAM_LOGO)} />
        </View>
        <LoginForm navigation={navigation} />
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

export default LoginScreen;