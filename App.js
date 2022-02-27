import React,{ useState,useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Screen from './components/Screen';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase'
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import SignedInStack from './components/navigation/SignedInStack';
import SignedoutStack from './components/navigation/SignedoutStack';
import rootReducer from './redux/reducers'
 
function App() {
  const [currentUser,setCurrentUser] = useState(null);
  const store = createStore(rootReducer, applyMiddleware(thunk))

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {          
            setCurrentUser(user)
        }
    })
  },[]);
  
  return (
    <Screen>                      
      {
        currentUser ? 
          <Provider store={store}>
            <SignedInStack />
          </Provider> 
          : <SignedoutStack />
      }               
    </Screen>      
  );
}


export default App;