import React from 'react';
import {  StyleSheet } from 'react-native';
import Screen from './components/Screen';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './redux/reducers';

function App() {
  const store = createStore(rootReducer, applyMiddleware(thunk))

  return (
    <Screen>
      <Provider store={store}>
        <NavigationContainer>        
          <AuthNavigation />
        </NavigationContainer>
      </Provider>      
    </Screen>      
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default App;