import { View, Text,Image,FlatList,StyleSheet,Button } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { connect } from 'react-redux';
import { collection, doc, getDocs,getDoc,setDoc, deleteDoc } from "firebase/firestore";

import { auth,db } from '../firebase';
import { signOut } from 'firebase/auth';

const ProfileScreen = (props) => {
  const [userPosts,setUserPosts] = useState([]);
  const [user,setUser] = useState(null);
  const { currentUser, posts } = props;
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if(props.route.params.uid === auth.currentUser.uid) {      
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      const userDocRef = doc(db,"users",props.route.params.uid );
      
      getDoc(userDocRef).then((snapshot) => {                    
          if (snapshot.exists()) {                
              setUser(snapshot.data());                              
          } else {
              console.log('does not exist')
          }
      }).catch((err) => {
        console.error("Failed to retrieve data", err);
      });
    
      const postDocRef = doc(db, "posts", props.route.params.uid); 
              
      getDocs(collection(postDocRef,"userPosts")).then((snapshot) => {
    
        let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
        })      
        setUserPosts(posts)  
                                                  
      }).catch((err) => {
          console.error("Failed to retrieve data", err);
      });
    }
    
    if (props.following.indexOf(props.route.params.uid) > -1){
      setFollowing(true)
    } else {
      setFollowing(false)
    }
    
  },[props.route.params.uid,props.following])

  const onFollow = () => {    
    const userDocRef = doc(db, "following", auth.currentUser.uid); 
              
    setDoc(doc(collection(userDocRef,"userFollowing"),props.route.params.uid),{});
  }

  const onUnfollow = () => {
    const postDocRef = doc(db, "following", auth.currentUser.uid);
    
    deleteDoc(doc(collection(postDocRef,"userFollowing"),props.route.params.uid));    
  }

  const onLogout = () => {
    signOut(auth).then(() => {
      console.log('Sign-out successful.');
      props.navigation.push('LoginScreen')
    }).catch((error) => {
      console.log(error.message)
    });
  }

  
  if (user === null) {
    return <View />
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{ user.username }</Text>
        <Text>{ user.email }</Text>
        {props.route.params.uid !== auth.currentUser.uid ? (
          <View>
            {following ? (
              <Button 
                title='Following' 
                onPress={() => onUnfollow()}
              />
            ) : (<Button 
                  title='Follow'
                  onPress={() => onFollow()}
                  />)}
          </View>
        ) : <Button 
          title='Logout'
          onPress={() => onLogout()}
          /> }
      </View>

      <View style={styles.containerGallery}>
        <FlatList 
          numColumns={3} 
          horizontal={false} 
          data={userPosts} 
          renderItem={
              ({item}) => (
                <View style={styles.containerImage}>
                  <Image style={styles.image} source={{uri: item.downloadURL}} />
                </View>
              )
            } />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  containerInfo: {
    margin: 10
  },
  containerGallery: {
    flex: 1,
  },
  image: {    
    flex: 1,
    aspectRatio: 1/1
  },
  containerImage:{
    flex: 1/3
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following    
})

export default connect(mapStateToProps,null)(ProfileScreen)