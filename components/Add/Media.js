import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Button,Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export default function Media() {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const cameraRef = useRef();
  const isFocused = useIsFocused();

  const [camera, setCamera] = useState(true);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  const pickImage = async () => {
    if (!hasGalleryPermission) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    let result = await ImagePicker?.launchImageLibraryAsync({
      mediaTypes: ImagePicker?.MediaTypeOptions?.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result?.cancelled) {
      setImage(result?.uri);
    }

    setCamera(true)
  };


  const takePicture = async () => {
    if(cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
          setImage(data.uri)
      }
    }
  }

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.camera}>
      {camera && isFocused &&
        <Camera
          ref={cameraRef} 
          style={styles.fixedRatio} 
          type={type} 
          ratio={'1:1'}
        /> }
      </View>
      
      <Button
        title='Flip image'
        style={styles.button}
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      <Button 
        title='Take picture' 
        onPress={() => takePicture()} />
      <Button 
        title='Pick Image from gallery' 
        onPress={() => {
          setCamera(false);
          pickImage();
        }} 
      />
      {image && image !== null && <Image source={{uri: image}} style={{flex:1}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
}); 
