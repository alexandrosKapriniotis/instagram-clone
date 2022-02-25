import React from 'react';
import { View, StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { arrayRemove, arrayUnion, collection, doc,updateDoc,collectionGroup } from 'firebase/firestore';

const Post = ({ post }) => {
  
  const handleLike = () => {
    const currentLikeStatus = !post.likes_by_users.includes(auth.currentUser.email);

    const postRef = collection(db, "users", post.owner_email, "posts");

    updateDoc(doc(postRef,post.id), {
        likes_by_users: currentLikeStatus 
            ? arrayUnion(auth.currentUser.email) 
            : arrayRemove(auth.currentUser.email)
    }).then( () => {
        console.log('Document successfully added')
    }).catch( error => {
        console.log('Error updating document: ', error.message)
    })
  }  

  return (
    <View style={styles.container}>
        <Divider width={1} orientation='vertical' />
        <PostHeader post={post} />
        <PostImage post={post} />
        <View style={{marginHorizontal: 15,marginTop: 10}}>
            <PostFooter post={post} handleLike={handleLike} />
            <Likes post={post} />
            <Caption post={post} />
            <CommentSection post={post} />
            <Comments post={post} />
        </View>
    </View>
  );
}

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
            height: 450
        }}
    >
        <Image 
            source={{uri: post.imageUrl}} 
            style={{ height: '100%',resizeMode: 'cover'}}
        />
    </View>
);

const PostFooter = ({handleLike,post}) => {
    return <View style={{flexDirection: "row",justifyContent: 'space-between'}}>
                <View style={styles.leftFooterIconsContainer}>
                    <TouchableOpacity onPress={() => handleLike(post)}>
                        <Image 
                            style={{width: 26,height: 25}} 
                            source={  
                                post.likes_by_users.includes(auth.currentUser.email) 
                                ? require("../../assets/heart-full.png")
                                : require("../../assets/like--v1.png")} 
                        />
                    </TouchableOpacity>
                    <Icon iconStyle={{ size: 26,color: '#fff'}} iconName="comment-outline" />
                    <Icon iconStyle={{ size: 26,color: '#fff'}} iconName="share-outline" />
                </View>

                <View>
                    <Icon iconStyle={{ size: 26,color: '#fff'}} iconName="bookmark-outline" />
                </View>                
            </View>
};

const Icon = ({ iconStyle, iconName}) => (
    <TouchableOpacity>
        <MaterialCommunityIcons name={iconName} size={iconStyle.size} color={iconStyle.color} />
    </TouchableOpacity>
);

const Likes = ({ post }) => (
    <View style={{flexDirection: 'row',marginTop: 4}}>
        <Text style={{color: '#FFF',fontWeight: '600'}}>
            { post.likes_by_users.length.toLocaleString('en') } likes
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