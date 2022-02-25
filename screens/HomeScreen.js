import React, { useEffect,useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Post from '../components/home/Post';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';
import { onSnapshot,collectionGroup, orderBy,query } from "firebase/firestore";
import { db } from '../firebase'

function HomeScreen({navigation}) {
  const [posts,setPosts] = useState([])

  useEffect( () => {
    onSnapshot(query(collectionGroup(db, 'posts'),orderBy('createdAt','desc')),snapshot => {      
      setPosts(snapshot.docs.map(doc => (
        { id: doc.id, ...doc.data() })))
    })
  },[])

  return (
    <View style={styles.container}>
        <Header navigation={navigation} />
        <Stories />
                
        <ScrollView>
          { 
            posts.map( (post,index) => (<Post post={post} key={index} />) )
          }
        </ScrollView>          
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'black'
  }
});

export default HomeScreen;