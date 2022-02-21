import React from 'react';
import {  StyleSheet } from 'react-native';
import Screen from './components/Screen';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';

function App() {
  return (
    <Screen>
      <NavigationContainer>        
        <AuthNavigation />
        {/* <BottomTabs /> */}
      </NavigationContainer>
    </Screen>      
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default App;