import React, { useEffect,useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Post from '../components/home/Post';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';
import { onSnapshot,collectionGroup, orderBy,query } from "firebase/firestore";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { db } from '../firebase'
import { fetchUser,fetchUserPosts } from '../redux/actions/index';

function HomeScreen(props) {
  const navigation = props.navigation;
  const [posts,setPosts] = useState([])

  useEffect( () => {
    // onSnapshot(query(collectionGroup(db, 'posts'),orderBy('createdAt','desc')),snapshot => {      
    //   setPosts(snapshot.docs.map(doc => (
    //     { id: doc.id, ...doc.data() })))
    // })
    let posts = [];

    if (props.usersLoaded == props.following.length) {
      for(let i=0;i < props.following.length; i++) {
        const user = props.users.find(el => el.uid === props.following[i]);

        if(user != undefined){
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort((x,y) => {
        return x.creation - y.creation;
      });

      setPosts(posts);
    }
  },[props.usersLoaded])

  console.log(posts)
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.users    
})

export default connect(mapStateToProps, null)(HomeScreen);