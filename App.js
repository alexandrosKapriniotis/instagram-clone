import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import Screen from './components/Screen';
import HomeScreen from './screens/HomeScreen';

function App(props) {
  return (
    <Screen>
      <HomeScreen />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default App;