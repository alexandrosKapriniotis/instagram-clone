import { View, Text,Image,FlatList,StyleSheet } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { connect } from 'react-redux';
import { collection, doc, getDocs,getDoc } from "firebase/firestore";

import { auth,db } from '../firebase';

const ProfileScreen = (props) => {
  const [userPosts,setUserPosts] = useState([]);
  const [user,setUser] = useState(null);
  const { currentUser, posts } = props;
  
  useEffect(() => {
    
    if(props.route.params.email === auth.currentUser.email) {
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      const userDocRef = doc(db,"users",props.route.params.email );
      
      getDoc(userDocRef).then((snapshot) => {                    
          if (snapshot.exists()) {                
              setUser(snapshot.data());

              const postDocRef = doc(db, "posts", user.owner_uid); 

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
          } else {
              console.log('does not exist')
          }
      })
             
    } 
    
  },[props.route.params.email])

  if (user === null) {
    return <View />
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{ user.username }</Text>
        <Text>{ user.email }</Text>
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
  posts: store.userState.posts    
})

export default connect(mapStateToProps,null)(ProfileScreen)