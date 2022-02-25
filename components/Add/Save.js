import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput,Button } from 'react-native';

import { storage,auth,db } from '../../firebase'
import { ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { serverTimestamp,collection,setDoc,doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function Save(props) {
  const navigation = useNavigation();  
  const [caption,setCaption] = useState();  
  const image = props.route.params.image;
  const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;

  const uploadImage = async () => {      
    const response = await fetch(image);
    const blob     = await response.blob();

    const storageRef = ref(storage,childPath);
    
    const task = uploadBytesResumable(storageRef, blob, {contentType: 'image/jpeg'});

    const taskProgress = snapshot => {
        console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = () => {
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
            savePostData(downloadURL,caption);
            console.log('File available at', downloadURL);
        });
    }

    const taskError = (error) => {
        console.log(error)
    }

    task.on('state_changed',taskProgress,taskError,taskCompleted);
  }

  const savePostData = async (downloadURL,caption) => {
    const subColRef = collection(db, "posts", auth.currentUser.uid, "userPosts");
    setDoc(doc(subColRef), {
        downloadURL,
        caption,
        creation: serverTimestamp()
    }).then((function () {
        navigation.navigate('BottomTabs',{ screen: 'Home'});
    }));
      
  }

  return (
    <View style={styles.container}>
        <Image source={{uri: image}} />
        <TextInput 
            placeholder="Write a Caption . . ."
            onChangeText={(caption) => {setCaption(caption)}}
        />
        <Button title='Save' onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  }
});

export default Save;