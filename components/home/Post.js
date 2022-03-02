import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { arrayRemove, arrayUnion, collection, doc,updateDoc,collectionGroup } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { fetchUserPosts } from '../../redux/actions';
import { container,text,utils } from '../styles';
import { timeDifference } from '../utils';

const Post = (props) => {
  
  const post = props.post;
  const [user, setUser] = useState(props.route.params.user)
  const navigation = useNavigation();
  
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

  return (
    <View style={[container.container, utils.backgroundWhite]}>

        <View>
            <View style={[container.horizontal, { alignItems: 'center', padding: 10 }]}>
                <TouchableOpacity
                    style={[container.horizontal, { alignItems: 'center' }]}
                    onPress={() => props.navigation.navigate("ProfileOther", { uid: user.uid, username: undefined })}>

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
                                    uri: user.image
                                }}
                            />
                        )
                    }
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={[text.bold, text.medium, { marginBottom: 0 }]} >{user.name}</Text>
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
                <View>
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

                </View>

                :

                <CachedImage
                    cacheKey={item.id}
                    style={container.image}
                    source={{ uri: item.downloadURL }}
                />
            }

            <View style={[utils.padding10, container.horizontal]}>
                {currentUserLike ?
                    (
                        <Entypo name="heart" size={30} color="red" onPress={() => onDislikePress(user.uid, item.id, item)} />
                    )
                    :
                    (
                        <Feather name="heart" size={30} color="black" onPress={() => onLikePress(user.uid, item.id, item)} />

                    )
                }
                <Feather style={utils.margin15Left} name="message-square" size={30} color="black" onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: user.uid, user })} />
                <Feather style={utils.margin15Left} name="share" size={26} color="black" onPress={() => props.navigation.navigate('ChatList', { postId: item.id, post: { ...item, user: user }, share: true })} />


            </View>
            <View style={[container.container, utils.padding10Sides]}>
                <Text style={[text.bold, text.medium]}>
                    {item.likesCount} likes
                </Text>
                <Text style={[utils.margin15Right, utils.margin5Bottom]}>
                    <Text style={[text.bold]}
                        onPress={() => props.navigation.navigate("ProfileOther", { uid: user.uid, username: undefined })}>
                        {user.name}
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
                <Text
                    style={[text.grey, utils.margin5Bottom]} onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: user.uid, user })}>
                    View all {item.commentsCount} Comments
                </Text>
                <Text
                    style={[text.grey, text.small, utils.margin5Bottom]}>
                    {timeDifference(new Date(), item.creation.toDate())}
                </Text>
            </View>
        </View>

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
                                    props.navigation.navigate("ProfileOther", { uid: modalShow.item.user.uid, username: undefined });
                                    setModalShow({ visible: false, item: null });
                                }}>
                                <Text >Profile</Text>
                            </TouchableOpacity>
                            <Divider />
                            {props.route.params.user.uid == firebase.auth().currentUser.uid ?
                                <TouchableOpacity style={{ padding: 20 }}
                                    onPress={() => {
                                        props.deletePost(modalShow.item).then(() => {
                                            props.fetchUserPosts()
                                            props.navigation.popToTop()
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
//   return (
//     <View style={styles.container}>
//         <Divider width={1} orientation='vertical' />
//         <PostHeader post={post} />
//         <PostImage post={post} />
//         <View style={{marginHorizontal: 15,marginTop: 10}}>
//             <PostFooter post={post} handleLike={handleLike} handleComment={handleComment} />
//             <Likes post={post} />
//             <Caption post={post} />
//             <CommentSection post={post} />
//             {/* <Comments post={post} /> */}
//         </View>
//     </View>
//   );
// }

const PostHeader = ({ post }) => {
    return <View 
                style={{                     
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 5,
                    alignItems: 'center'
                }}>
            <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                <Image source={{uri: post.profile_picture}} style={styles.profilePic} />
                <Text style={styles.text}>{ post.username }</Text>
            </View>

            <Entypo name="dots-three-horizontal" size={12} color="#FFF" />
        </View>
};

const PostImage = ({post}) => (
    <View 
        style={{
            width: '100%',
            height: 300
        }}
    >
        <Image 
            source={{uri: post.downloadURL}} 
            style={{ height: '100%',resizeMode: 'cover'}}
        />
    </View>
);

const PostFooter = ({handleLike,post,handleComment}) => {
    return <View style={{flexDirection: "row",justifyContent: 'space-between'}}>
                <View style={styles.leftFooterIconsContainer}>
                    <TouchableOpacity onPress={() => handleLike(post)}>
                        <Image 
                            style={{width: 26,height: 25}} 
                            source={  
                                post.likes_by_users?.includes(auth.currentUser.uid) 
                                ? require("../../assets/heart-full.png")
                                : require("../../assets/like--v1.png")} 
                        />
                    </TouchableOpacity>                    
                    <Icon iconStyle={{ size: 26,color: '#fff'}} iconName="comment-outline" onPress={() => handleComment(post)} />
                    <Icon iconStyle={{ size: 26,color: '#fff'}} iconName="share-outline" />
                </View>

                <View>
                    <Icon iconStyle={{ size: 26,color: '#fff'}} iconName="bookmark-outline" />
                </View>                
            </View>
};

const Icon = ({ iconStyle, iconName, onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons name={iconName} size={iconStyle.size} color={iconStyle.color} />
    </TouchableOpacity>
);

const Likes = ({ post }) => (
    <View style={{flexDirection: 'row',marginTop: 4}}>
        <Text style={{color: '#FFF',fontWeight: '600'}}>
            { post.likes_by_users?.length.toLocaleString('en') } likes
        </Text>
    </View>
);

const Caption = ({ post }) => (
    <View style={{marginTop: 5}}>
        <Text style={{color: '#FFF'}}>
            <Text style={{fontWeight: '600',marginRight: 5}}>@alexkap</Text>
            <Text> { post.caption }</Text>
        </Text>
    </View>    
);

const CommentSection = ({ post }) => (
    <View style={{marginTop: 5}}>
        {
            post.comments && post.comments.length > 0 &&
            (<Text style={{color:'gray'}}>
                View { post.comments && post.comments.length > 1 ? 'all ' : ''}
                { post.comments && post.comments.length > 1 ? 'comments' : 'comment'}
            </Text>)
        }
    </View>
);

const Comments = ({post}) => (
    <>
        { post.comments && post.comments.length > 1 &&
            post.comments.map((comment,index) => {
                <View key={index} style={{flexDirection: 'row',marginTop: 10}}>
                    <Text style={{color:'#FFF'}}>
                        <Text style={{fontWeight: '600'}}>
                            {comment.email}
                        </Text>
                        { comment.body }
                    </Text>
                </View>
            })
        }
    </>
);

const styles = StyleSheet.create({
  container: {   
      marginBottom: 30,
      flex: 1,
      paddingVertical: 10
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: '#ff8501'
  },
  text: {
      color: "#FFF",
      marginLeft: 5,
      fontWeight: '700'
  },
  leftFooterIconsContainer: {
      flexDirection: "row",
      width: '32%',
      justifyContent: "space-between"
  },

});

export default Post;