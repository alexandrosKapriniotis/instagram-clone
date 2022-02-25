import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import SignedInStack, { SignedoutStack } from './Navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth,firebaseApp } from './firebase';

function AuthNavigation() {
  const [currentUser,setCurrentUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {          
            setCurrentUser(user)
        }
    })
  },[]);
  
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