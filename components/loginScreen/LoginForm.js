import React from 'react';
import { View, StyleSheet, TextInput, Text, Pressable, TouchableOpacity,Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Validator from 'email-validator';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import firebaseApp from '../../firebase';

function LoginForm({navigation}) {
  const LoginFormSchema = yup.object().shape({
    email: yup.string().email().required('An email is required'),
    password: yup.string().required().min(6,'Your password has to have at least 6 characters')
  });

  const onLogin = (email,password) => {
    
    const auth = getAuth(firebaseApp);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            navigation.push('HomeScreen')
        })
        .catch((error) => {
            Alert.alert(
                'Login Error',
                error.message,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK'),
                        style: 'cancel'
                    },
                    {
                        text: 'Sign Up',
                        onPress: () => navigation.push('SignupScreen')
                    }
                ]
            )
        });
  }

  return (
    <View style={styles.container}>
        <Formik
            initialValues={{email: '',password: ''}}
            onSubmit={(values) => onLogin(values.email,values.password)}
            validationSchema={LoginFormSchema}
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
                    placeholder='Phone number, username or email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    autoFocus={true}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
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
            <View style={{alignItems: 'flex-end',marginBottom: 30}}>
                <Text style={{color: '#6BB0F5'}}>Forgot password?</Text>
            </View>
            <Pressable 
                style={styles.button(isValid)} 
                onPress={handleSubmit} 
                disabled={!isValid}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            <View style={styles.signupContainer}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.push('SignupScreen')} >
                    <Text style={styles.signupText}>Sign Up</Text>
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
  signupContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 50,
  },
  signupText: {
      color: '#6BB0F5'
  }
});

export default LoginForm;