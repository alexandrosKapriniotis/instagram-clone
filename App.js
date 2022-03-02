import React,{ useState } from 'react';
import Screen from './components/Screen';
import { auth } from './firebase'
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import SignedInStack from './components/navigation/SignedInStack';
import SignedoutStack from './components/navigation/SignedoutStack';
import rootReducer from './redux/reducers'
import { onAuthStateChanged } from 'firebase/auth';
 
function App() {
  const store = createStore(rootReducer, applyMiddleware(thunk))
  const [loggedIn,setLoggedIn] = useState(false)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  });

  return (
    <Screen>                      
      {
        loggedIn ? 
          <Provider store={store}>
            <SignedInStack />
          </Provider> 
          : <SignedoutStack />
      }               
    </Screen>      
  );
}


export default App;