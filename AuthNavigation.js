import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SignedInStack, { SignedoutStack } from './Navigation';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from './firebase';

function AuthNavigation() {
  const [currentUser,setCurrentUser] = useState(null);
  
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
        if (user) {          
            setCurrentUser(user)
        }
    })
  },[]);
  console.log(currentUser)
  return (
    <>
    {
        currentUser ? <SignedInStack /> : <SignedoutStack />
    }
    </>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default AuthNavigation;