import React from 'react';
import {  StyleSheet } from 'react-native';
import Screen from './components/Screen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './components/home/BottomTabs';
import SignedInStack from './screens/Navigation';

function App(props) {
  return (
    <Screen>
      <NavigationContainer>        
        <SignedInStack />
        {/* <BottomTabs /> */}
      </NavigationContainer>
    </Screen>      
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default App;