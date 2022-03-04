import React,{ useState,useEffect } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, doc, getDocs,getDoc,setDoc, deleteDoc } from "firebase/firestore";
import { FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendNotification } from '../redux/actions/index';
import { container, text, utils } from '../components/styles';
import CachedImage from '../components/CachedImage';
import { auth,db } from '../firebase';
import { signOut } from 'firebase/auth';

const ProfileScreen = (props) => {
  const [userPosts,setUserPosts] = useState([]);
  const [user,setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    const { currentUser, posts } = props;
    if (props.route.params.uid === auth.currentUser.uid) {
      setUser(currentUser)      
      setUserPosts(posts)
      setLoading(false)
  } else {
      const userDocRef = doc(db,"users",props.route.params.uid );
      
      getDoc(userDocRef).then((snapshot) => {                    
          if (snapshot.exists()) { 

            props.navigation.setOptions({
              title: snapshot.data().username,
            })

            setUser({ uid: props.route.params.uid, ...snapshot.data() });                              
          }
          setLoading(false)
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
    
  },[props.route.params.uid, props.following, props.currentUser, props.posts])

  const onFollow = () => {
    const userDocRef = doc(db, "following", auth.currentUser.uid); 
              
    setDoc(doc(collection(userDocRef,"userFollowing"),props.route.params.uid),{});

    props.sendNotification(user.notificationToken, "New Follower", `${props.currentUser.name} Started following you`, { type: 'profile', user: auth.currentUser.uid })
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

  if (loading) {
    return (
        <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
            <ActivityIndicator style={{ alignSelf: 'center', marginBottom: 20 }} size="large" color="#00ff00" />
            <Text style={[text.notAvailable]}>Loading</Text>
        </View>
    )
  }
  if (user === null) {
      return (
          <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
              <FontAwesome5 style={{ alignSelf: 'center', marginBottom: 20 }} name="dizzy" size={40} color="black" />
              <Text style={[text.notAvailable]}>User Not Found</Text>
          </View>
      )
  }
  return (
    <>
    <View style={[container.container,utils.backgroundWhite]}>

      <View style={[container.profileInfo]}>

          <View style={[utils.noPadding, container.row]}>

              {user.image == 'default' ?
                  (
                      <FontAwesome5
                          style={[utils.profileImageBig, utils.marginBottomSmall]}
                          name="user-circle" size={80} color="black" />
                  )
                  :
                  (
                      <Image
                          style={[utils.profileImageBig, utils.marginBottomSmall]}
                          source={{
                              uri: user.profile_picture
                          }}
                      />
                  )
              }

              <View style={[container.container, container.horizontal, utils.justifyCenter, utils.padding10Sides]}>

                  <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                      <Text style={[text.bold, text.large, text.center]}>{userPosts.length}</Text>
                      <Text style={[text.center]}>Posts</Text>
                  </View>
                  <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                      <Text style={[text.bold, text.large, text.center]}>{user.followersCount}</Text>
                      <Text style={[text.center]}>Followers</Text>
                  </View>
                  <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                      <Text style={[text.bold, text.large, text.center]}>{user.followingCount}</Text>
                      <Text style={[text.center]}>Following</Text>
                  </View>
              </View>

          </View>


          <View>
              <Text style={text.bold}>{user.username}</Text>
              <Text style={[text.profileDescription, utils.marginBottom]}>{user.description}</Text>

              {props.route.params.uid !== auth.currentUser.uid ? (
                  <View style={[container.horizontal]}>
                      {following ? (
                          <TouchableOpacity
                              style={[utils.buttonOutlined, container.container, utils.margin15Right]}
                              title="Following"
                              onPress={() => onUnfollow()}>
                              <Text style={[text.bold, text.center, text.green]}>Following</Text>
                          </TouchableOpacity>
                      )
                          :
                          (
                              <TouchableOpacity
                                  style={[utils.buttonOutlined, container.container, utils.margin15Right]}
                                  title="Follow"
                                  onPress={() => onFollow()}>
                                  <Text style={[text.bold, text.center, { color: '#2196F3' }]}>Follow</Text>
                              </TouchableOpacity>

                          )}

                      <TouchableOpacity
                          style={[utils.buttonOutlined, container.container]}
                          title="Follow"
                          onPress={() => props.navigation.navigate('Chat', { user })}>
                          <Text style={[text.bold, text.center]}>Message</Text>
                      </TouchableOpacity>
                  </View>
              ) :
                  <TouchableOpacity
                      style={utils.buttonOutlined}
                      onPress={() => props.navigation.navigate('EditScreen')}>
                      <Text style={[text.bold, text.center]}>Edit Profile</Text>
                  </TouchableOpacity>}
          </View>
      </View>

      <View style={[utils.borderTopGray]}>
          <FlatList
              numColumns={3}
              horizontal={false}
              data={userPosts}
              renderItem={({ item }) => (
                  <TouchableOpacity
                      style={[container.containerImage, utils.borderWhite]}
                      onPress={() => props.navigation.navigate("Post", { item, user })}>

                      {item.type == 0 ?

                          <CachedImage
                              cacheKey={item.id}
                              style={container.image}
                              source={{ uri: item.downloadURLStill }}
                          />

                          :

                          <CachedImage
                              cacheKey={item.id}
                              style={container.image}
                              source={{ uri: item.downloadURL }}
                          />
                      }
                  </TouchableOpacity>

              )}

          />
      </View>
      </View >
      
    </>    
    
  )
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following    
})

const mapDispatchProps = (dispatch) => bindActionCreators({ sendNotification }, dispatch);

export default connect(mapStateToProps,mapDispatchProps)(ProfileScreen)