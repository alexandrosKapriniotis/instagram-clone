import React from 'react';
import { View, StyleSheet, TextInput, Text, Pressable, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Validator from 'email-validator';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { LogBox } from 'react-native';

import { firebaseApp, db } from '../../firebase';

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

function signupForm({navigation}) {
  const signupFormSchema = yup.object().shape({
    email: yup.string().email().required('An email is required'),
    username: yup.string().required().min(2,'A username is required and has to be at least 2 characters'),
    password: yup.string().required().min(6,'Your password has to have at least 6 characters')
  });

  const getRandomProfilePicture = async () => {
      const response = await fetch('https://randomuser.me/api/')
      const data     = await response.json()

      return data.results[0].picture.large
  }

  const saveUser = async (user) => {
    try {
        await setDoc(doc(db, "users",user.email), {
            owner_uid: user.uid,
            username: user.username,
            email: user.email,
            profile_picture: await getRandomProfilePicture()
          }).catch(error => {
            console.log('Something went wrong',error.message)
          });
    } catch (error) {
        console.log('Something went wrong',error.message)
    }
    
}

  const onSignup = async (email,username,password) => {
    const auth = getAuth(firebaseApp);

    createUserWithEmailAndPassword(auth, email, password)
      .then( (userCredential) => {
        // Signed in 
        const user = userCredential.user;

        saveUser({uid: user.uid,email: user.email,username});
        
        navigation.push('HomeScreen')
      })
      .catch((error) => {
        const errorMessage = error.message;

        console.log('Something went wrong',errorMessage)
      });
  }; 

  return (
    <View style={styles.container}>
        <Formik
            initialValues={{email: '',username: '',password: ''}}
            onSubmit={(values) => onSignup(values.email,values.username,values.password)}
            validationSchema={signupFormSchema}
            validateOnMount={true}
        >
        {({handleBlur,handleChange,handleSubmit,values,errors,isValid}) => (
            <>
            <View style={[
                styles.inputField,
                {
                    borderColor: 
                    values.email.length < 1 || Validator.validate(values.email) 
                    ? '#ddd' 
                    : 'red'
                }
            ]} >
                <TextInput 
                    placeholder='Email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    autoFocus={true}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                />
            </View>

            <View style={[
                styles.inputField,
                {
                    borderColor: 
                    values.username.length === 0 || values.username.length > 2 || Validator.validate(values.username) 
                    ? '#ddd' 
                    : 'red'
                }
            ]} >
                <TextInput 
                    placeholder='Username'
                    autoCapitalize='none'
                    textContentType='username'
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                />
            </View>

            <View style={[styles.inputField,
                    {
                        borderColor: 
                        values.password.length < 1 || values.password.length >= 6 
                        ? '#ddd' 
                        : 'red'
                    }
            ]}>
                <TextInput 
                    placeholder='Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType='password'
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                />
            </View>            
            <Pressable 
                style={styles.button(isValid)} 
                onPress={handleSubmit} 
                disabled={!isValid}
            >
                <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>

            <View style={styles.loginContainer}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.push('LoginScreen')}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
            </>
        )}
        </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50
      },
    inputField: {
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD'
    },
    button: isValid => ({
        backgroundColor: isValid ? '#0096F6' : '#9aCAF7',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        fontSize: 20,
        minHeight: 42,
        borderRadius: 4
    }),
    buttonText: {
        fontWeight: '600',
        color:'#FFF'
    },
    loginContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 50,
    },
    loginText: {
        color: '#6BB0F5'
    }
});

export default signupForm;