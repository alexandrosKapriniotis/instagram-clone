import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions,Text,Image, TouchableOpacity } from 'react-native';
import { Divider, Snackbar } from 'react-native-paper';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc,getDoc,onSnapshot,setDoc,updateDoc } from 'firebase/firestore';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import ParsedText from 'react-native-parsed-text';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';

import { fetchUserPosts,deletePost } from '../../redux/actions';
import { container,text,utils } from '../styles';
import { timeDifference } from '../utils';
import CachedImage from '../CachedImage';
import { auth, db } from '../../firebase';

const WINDOW_WIDTH = Dimensions.get("window").width;

function Post(props) {
  const navigation = useNavigation();
  const post = props.post;
  const [item, setItem] = useState(props.route.params.item)
  const [user, setUser] = useState(props.route.params.user)
  const [currentUserLike, setCurrentUserLike] = useState(false)
  const [unmutted, setUnmutted] = useState(true)
  const [videoref, setvideoref] = useState(null)
  const [sheetRef, setSheetRef] = useState(useRef(null))
  const [modalShow, setModalShow] = useState({ visible: false, item: null })
  const [isValid, setIsValid] = useState(true);
  const [exists, setExists] = useState(false);
  const [loaded, setLoaded] = useState(false);

  
  const isFocused = useIsFocused();
    useEffect(() => {

        if (props.route.params.notification != undefined) {
            const userDoc = doc(db,"users",props.route.params.user);
            getDoc(userDoc).then((snapshot) => {
                if (snapshot.exists) {
                    let user = snapshot.data();
                    user.uid = snapshot.id;

                    setUser(user)
                }
            }).catch( error => console.log(error))

            const userPostsRef = collection(db,"posts",props.route.params.user,"userPosts");    
            const userPostRef = doc(userPostsRef, props.route.params.item);
            getDoc(userPostRef).then((snapshot) => {
                if (snapshot.exists) {
                    let post = snapshot.data();
                    post.id = snapshot.id;

                    setItem(post)
                    setLoaded(true)
                    setExists(true)
                }
            }).catch( error => console.log(error))

            const likesRef = collection(userPostsRef,props.route.params.item,"likes");
            const currentUserDocRef = doc(likesRef, auth.currentUser.uid);

            return onSnapshot(currentUserDocRef,snapshot => {   
                let currentUserLike = false;
                if (snapshot.exists) {
                    currentUserLike = true;
                }
                setCurrentUserLike(currentUserLike)       
            })
        }
        else {
            const currentUserRef = doc(db,"posts",props.route.params.user.uid,"userPosts",props.route.params.item.id,"likes",auth.currentUser.uid);
            
            onSnapshot(currentUserRef, (snapshot) => {
                let currentUserLike = false;
                if (snapshot.exists) {
                    currentUserLike = true;
                }
                setCurrentUserLike(currentUserLike)
            });
            
            setItem(props.route.params.item)
            setUser(props.route.params.user)
            setLoaded(true)
            setExists(true)
        }

    }, [props.route.params.notification, props.route.params.item])

    useEffect(() => {
        if (videoref !== null) {
            videoref.setIsMutedAsync(props.route.params.unmutted)
        }
        setUnmutted(props.route.params.unmutted)
    }, [props.route.params.unmutted])

    useEffect(() => {
        if (videoref !== null) {
            if (isFocused) {
                videoref.playAsync()
            } else {
                videoref.stopAsync()

            }
        }

    }, [props.route.params.index, props.route.params.inViewPort])

  const handleLike = () => {
    const currentLikeStatus = !post.likes_by_users?.includes(auth.currentUser.uid);  
    const postRef = collection(db, "users", post.owner_email, "posts");

    updateDoc(doc(postRef,post.id), {
        likes_by_users: currentLikeStatus 
            ? arrayUnion(auth.currentUser.uid) 
            : arrayRemove(auth.currentUser.uid)
    }).then( () => {
        console.log('Document successfully added')
    }).catch( error => {
        console.log('Error updating document: ', error.message)
    })
  }
  
  const handleComment = (post) => {       
      navigation.navigate('CommentsScreen',{ postId: post.id, uid: auth.currentUser.uid }) 
  }

  const onUsernamePress = (username, matchIndex) => {
    navigation.navigate("Profile", { username, uid: undefined })
  }

const onLikePress = (userId, postId, item) => {
    item.likesCount += 1;
    setCurrentUserLike(true)

    const currentUserRef = doc(db,"posts",userId,"userPosts",postId,"likes",auth.currentUser.uid);
    setDoc(currentUserRef, {});
    // props.sendNotification(user.notificationToken, "New Like", `${props.currentUser.name} liked your post`, { type: 0, postId, user: firebase.auth().currentUser.uid })
}
const onDislikePress = (userId, postId, item) => {
    const currentUserRef = doc(db,"posts",userId,"userPosts",postId,"likes",auth.currentUser.uid);

    deleteDoc(currentUserRef);
}

if (!exists && loaded) {
    return (
        <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
            <FontAwesome5 style={{ alignSelf: 'center', marginBottom: 20 }} name="dizzy" size={40} color="black" />
            <Text style={[text.notAvailable]}>Post does not exist</Text>
        </View>
    )
}

if (!loaded) {
    return (<View></View>)

}
if (user == undefined) {
    return (<View></View>)
}
if (item == null) {
    return (<View />)
}

const _handleVideoRef = (component) => {
    setvideoref(component);

    if (component !== null) {
        component.setIsMutedAsync(props.route.params.unmutted)
    }
}

if (videoref !== null) {
    videoref.setIsMutedAsync(unmutted)
    if (isFocused && props.route.params.index == props.route.params.inViewPort) {
        videoref.playAsync()
    } else {
        videoref.stopAsync()
    }
}


if (sheetRef.current !== null && !props.route.params.feed) {
    if (modalShow.visible) {
        sheetRef.snapTo(0)
    } else {
        sheetRef.snapTo(1)
    }
}

  return (
    <View style={[container.container, utils.backgroundWhite]}>
        <>
        <View style={[container.horizontal, { alignItems: 'center', padding: 10 }]}>
                <TouchableOpacity
                    style={[container.horizontal, { alignItems: 'center' }]}
                    onPress={() => navigation.navigate("BottomTabs",{ screen: "ProfileScreen", params: { uid: user.uid, username: undefined }})}>

                    {user.image == 'default' ?
                        (
                            <FontAwesome5
                                style={[utils.profileImageSmall]}
                                name="user-circle" size={35} color="black" />
                        )
                        :
                        (
                            <Image
                                style={[utils.profileImageSmall]}
                                source={{
                                    uri: user.profile_picture
                                }}
                            />
                        )
                    }
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={[text.bold, text.medium, { marginBottom: 0 }]} >{user.username}</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity
                    style={[{ marginLeft: 'auto' }]}

                    onPress={() => {
                        if (props.route.params.feed) {
                            props.route.params.setModalShow({ visible: true, item })
                        } else {
                            setModalShow({ visible: true, item })
                        }
                    }}>
                    <Feather
                        name="more-vertical" size={20} color="black" />
                </TouchableOpacity>
                
            </View>
            {item.type == 0 ?
                <>
                    {props.route.params.index == props.route.params.inViewPort && isFocused ?
                        <View>
                            <VideoPlayer
                                videoProps={{
                                    isLooping: true,
                                    shouldPlay: true,
                                    resizeMode: Video.RESIZE_MODE_COVER,
                                    source: {
                                        uri: item.downloadURL,
                                    },
                                    videoRef: _handleVideoRef,
                                }}
                                inFullscreen={false}
                                showControlsOnLoad={true}
                                showFullscreenButton={false}
                                height={WINDOW_WIDTH}
                                width={WINDOW_WIDTH}
                                shouldPlay={true}
                                isLooping={true}
                                style={{
                                    aspectRatio: 1 / 1, height: WINDOW_WIDTH,
                                    width: WINDOW_WIDTH, backgroundColor: 'black'
                                }}
                            />

                            <TouchableOpacity
                                style={{ position: 'absolute', borderRadius: 500, backgroundColor: 'black', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', margin: 10, right: 0 }}
                                activeOpacity={1}
                                onPress={() => {
                                    if (videoref == null) {
                                        return;
                                    }
                                    if (unmutted) {
                                        if (props.route.params.setUnmuttedMain == undefined) {
                                            setUnmutted(false)
                                        } else {
                                            props.route.params.setUnmuttedMain(false)
                                        }

                                    } else {
                                        if (props.route.params.setUnmuttedMain == undefined) {
                                            setUnmutted(true)
                                        } else {
                                            props.route.params.setUnmuttedMain(true)
                                        }

                                    }

                                }}>
                                {!unmutted ?
                                    <Feather name="volume-2" size={20} color="white" />
                                    :
                                    <Feather name="volume-x" size={20} color="white" />
                                }
                            </TouchableOpacity>
                        </View>

                        :
                        <View style={{ marginTop: 4 }}>

                            <CachedImage
                                cacheKey={item.id}
                                style={[container.image]}
                                source={{ uri: item.downloadURLStill }}
                            />
                        </View>
                    }
                </>
                :
                <CachedImage
                    cacheKey={item.id}
                    style={[container.image]}
                    source={{ uri: item.downloadURL }}
                />
            }

            <View style={[utils.padding10, container.horizontal,{zIndex: 999}]}> 
                {currentUserLike ?
                    (
                        <TouchableOpacity onPress={() => onDislikePress(user.uid, item.id, item)}>
                            <Entypo name="heart" size={30} color="red" />
                        </TouchableOpacity>
                    )
                    :
                    (
                        <TouchableOpacity onPress={() => onLikePress(user.uid, item.id, item)}>
                            <Feather name="heart" size={30} color="black" />
                        </TouchableOpacity>                        
                    )
                }
                
                <Feather style={utils.margin15Left} name="message-square" size={30} color="black" onPress={() => navigation.navigate('CommentsScreen', { postId: item.id, uid: user.uid, user })} />

                <Feather style={utils.margin15Left} name="share" size={26} color="black" onPress={() => navigation.navigate('ChatList', { postId: item.id, post: { ...item, user: user }, share: true })} />
            </View>
            <View style={[container.container, utils.padding10Sides,{zIndex: 999}]}>
                <Text style={[text.bold, text.medium]}>
                    {item.likesCount} likes
                </Text>
                <Text style={[utils.margin15Right, utils.margin5Bottom]}>
                    <Text style={[text.bold]}
                        onPress={() => navigation.navigate("BottomTabs",{screen: "ProfileScreen",params: { uid: user.uid, username: undefined }})}>
                        {user.username}
                    </Text>

                    <Text>    </Text>
                    <ParsedText
                        parse={
                            [
                                { pattern: /@(\w+)/, style: { color: 'green', fontWeight: 'bold' }, onPress: onUsernamePress },
                            ]
                        }
                    >{item.caption}</ParsedText>

                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('CommentsScreen', { postId: item.id, uid: user.uid, user })}>
                    <Text
                        style={[text.grey, utils.margin5Bottom]} >
                        View all {item.commentsCount} Comments
                    </Text>
                </TouchableOpacity>
                
                <Text
                    style={[text.grey, text.small, utils.margin5Bottom]}>
                    {timeDifference(new Date(), item.creation?.toDate())}
                </Text>
            </View>
        </>

        <BottomSheet
            bottomSheerColor="#FFFFFF"
            ref={setSheetRef}
            initialPosition={0} //200, 300
            snapPoints={[300, 0]}
            isBackDrop={true}
            isBackDropDismissByPress={true}
            isRoundBorderWithTipHeader={true}
            backDropColor="black"
            isModal
            containerStyle={{ backgroundColor: "white" }}
            tipStyle={{ backgroundColor: "white" }}
            headerStyle={{ backgroundColor: "white", flex: 1 }}
            bodyStyle={{ backgroundColor: "white", flex: 1, borderRadius: 20 }}
            body={

                <View>

                    {modalShow.item != null ?
                        <View>
                            <TouchableOpacity style={{ padding: 20 }}
                                onPress={() => {
                                    navigation.navigate("Profile", { uid: modalShow.item.user.uid, username: undefined });
                                    setModalShow({ visible: false, item: null });
                                }}>
                                <Text >Profile</Text>
                            </TouchableOpacity>
                            <Divider />
                            {props.route.params.user.uid == auth.currentUser.uid ?
                                <TouchableOpacity style={{ padding: 20 }}
                                    onPress={() => {
                                        props.deletePost(modalShow.item).then(() => {
                                            props.fetchUserPosts()
                                            navigation.popToTop()
                                        })
                                        setModalShow({ visible: false, item: null });
                                    }}>
                                    <Text >Delete</Text>
                                </TouchableOpacity>
                                : null}

                            <Divider />
                            <TouchableOpacity style={{ padding: 20 }} onPress={() => setModalShow({ visible: false, item: null })}>
                                <Text >Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        : null}

                </View>
            }
        />
        <Snackbar
            visible={isValid.boolSnack}
            duration={2000}
            onDismiss={() => { setIsValid({ boolSnack: false }) }}>
            {isValid.message}
        </Snackbar>
    </View>
)
} 

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserPosts,deletePost }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Post);