import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Post from '../components/home/Post';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';
import { POSTS } from '../data/posts';

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
        <Header navigation={navigation} />
        <Stories />
        <ScrollView>
          { 
            POSTS.map( (post,index) => (<Post post={post} key={index} />) )
          }
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'black',
      flex: 1
  }
});

export default HomeScreen;