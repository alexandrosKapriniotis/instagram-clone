import { StyleSheet, Text, TextInput, View,Image,Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as yup from 'yup';
import { Formik } from 'formik';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import validUrl from 'valid-url';
import { db, firebaseApp, auth } from '../../firebase'
import { doc, serverTimestamp, onSnapshot,setDoc, collection } from "firebase/firestore";

const PLACEHOLDER_IMAGE = '../../assets/empty-image.png';

const uploadPostSchema = yup.object().shape({
    imageUrl: yup.string().url().required('A URL is required'),
    caption: yup.string().max(2200,'Caption has reached the character limit.')
});

export default function FormikPostUploader({ navigation }) {
  const [thumbnailUrl,setThumbnailUrl] = useState(null)
  const [currentLoggedInUser,setCurrentLoggedInUser] = useState(null)

  const getUser = () => {
    const user = auth.currentUser;

    const docRef = doc(db, "users", user.email);
    
    const unsubscribe = onSnapshot(docRef,doc => {   
        setCurrentLoggedInUser({
            username: doc.data().username,
            profilePicture: doc.data().profile_picture,
            email: user.email
        })   
    })
    return unsubscribe;
  }
  
  useEffect( () => {
    getUser()
  },[])

  const uploadPost = async (imageUrl,caption) => {
      try {
        const subColRef = collection(db, "users", currentLoggedInUser.email, "posts");

        await setDoc(doc(subColRef), {
            imageUrl: imageUrl,
            username: currentLoggedInUser.username,
            profile_picture: currentLoggedInUser.profilePicture && '',
            owner_id: auth.currentUser.uid,
            owner_email: currentLoggedInUser.email,
            caption: caption,
            createdAt: serverTimestamp(),
            likes: 0,
            likes_by_users: [],
            comments: []
        });
      } catch (error) {
          console.log('Error: ',error.message)
      }
      return navigation.goBack();
  }

  return (
    <Formik 
        initialValues={{caption: '',imageUrl: ''}}
        onSubmit={(values) => {
            uploadPost(values.imageUrl,values.caption)
        }}
        validationSchema={uploadPostSchema}
        validateOnMount={true}
    >
        {({handleBlur,handleChange,handleSubmit,values,errors,isValid}) => (
            <>
            <View style={styles.container}>
                <Image source={validUrl.isUri(thumbnailUrl) ? {uri: thumbnailUrl} : require(PLACEHOLDER_IMAGE)} style={styles.image} />

                <View style={{flex: 1,marginLeft: 12}}>
                    <TextInput 
                        style={{color:'white',fontSize: 18}}
                        placeholder='Write a caption' 
                        placeholderTextColor='gray'
                        multiline={true}
                        onChangeText={handleChange('caption')}
                        onBlur={handleBlur('caption')}
                        value={values.caption}                    
                    />
                    {
                        errors.caption && (
                            <Text style={{fontSize: 10,color: 'red'}}>
                                {errors.caption}
                            </Text>
                        )
                    }
                </View>                
            </View>
            <Divider width={0.2} orientation='vertical' />
            <TextInput 
                    onChange={e => setThumbnailUrl(e.nativeEvent.text)}
                    style={{color:'white',fontSize: 16}}
                    placeholder='Enter Image Url' 
                    placeholderTextColor='gray'
                    onChangeText={handleChange('imageUrl')}
                    onBlur={handleBlur('imageUrl')}
                    value={values.imageUrl}    
                />
                {
                    errors.imageUrl && (
                        <Text style={{fontSize: 10,color: 'red'}}>
                            {errors.imageUrl}
                        </Text>
                    )
                }

                <Button onPress={handleSubmit} title='Share' disabled={!isValid} color='#2196F3' />
            </>
        )}
    </Formik>
  )
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        justifyContent:'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    image: {
        width: 100,
        height: 100
    },
    button: {
        backgroundColor: '#000',
        color: 'blue'
    }
})