import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React,{ useState,useEffect } from 'react';
import { View, StyleSheet, Text,FlatList,Button,TextInput,Image,TouchableOpacity } from 'react-native';

import { auth, db } from '../firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../redux/actions/index';

import { timeDifference } from '../components/utils';
import { container, text, utils } from '../components/styles';

function CommentsScreen(props) {
  const [comments,setComments] = useState([])
  const [postId, setPostId] = useState("")
  const [textInput, setTextInput] = useState(null)
  const [input, setInput] = useState("")
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    return getComments();
  },[props.route.params.postId,props.users,refresh]);

  const matchUserToComment = (comments) => {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty('user')) {
            continue;
        }

        const user = props.users.find(x => x.uid === comments[i].creator)
        if (user == undefined) {
            props.fetchUsersData(comments[i].creator, false)
        } else {
            comments[i].user = user
        }
    }
    setComments(comments)
    setRefresh(false)
}

const getComments = () => {
    if(props.route.params.postId !== postId || refresh) {
        const userPostsCollectionRef = collection(db,"posts",props.route.params.uid,"userPosts");
        const commentsCollectionRef  = collection(userPostsCollectionRef,props.route.params.postId,"comments");

        let comments;

        getDocs(query(commentsCollectionRef,orderBy("creation","desc"))).then((snapshot) => {
            comments = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data}
            })  
            matchUserToComment(comments)                                                  
        }).catch((err) => {
            console.error("Failed to retrieve data", err);
        });
        
        setPostId(props.route.params.postId)    
    } else {
        matchUserToComment(comments)
    }
}

  const onCommentSend = () => {
    const textToSend = input;

    if (input.length == 0) {
        return;
    }
    setInput("");

    textInput.clear()
    const userPostsCollectionRef = collection(db,"posts",props.route.params.uid,"userPosts");
    const commentsCollectionRef  = collection(userPostsCollectionRef,props.route.params.postId,"comments");

    setDoc(doc(commentsCollectionRef),{
        creator: auth.currentUser.uid,
        body: textToSend,
        creation: serverTimestamp() 
    }).then(() => {
        setRefresh(true)
    }).catch( error => console.log(error));
  }
  
  return (
    <View style={[container.container, container.alignItemsCenter, utils.backgroundWhite]}>
        <FlatList
            numColumns={1}
            horizontal={false}
            data={comments}
            renderItem={({ item }) => (
                <View style={utils.padding10}>
                    {item.user !== undefined ?
                        <View style={container.horizontal}>
                            {item.user.image == 'default' ?
                                (
                                    <FontAwesome5
                                        style={[utils.profileImageSmall]}
                                        name="user-circle" size={35} color="black"
                                        onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid, username: undefined })} />
                                )
                                :
                                (
                                    <Image
                                        style={[utils.profileImageSmall]}
                                        source={{
                                            uri: item.user.profile_picture
                                        }}
                                        onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid, username: undefined })} />
                                )
                            }
                            <View style={{ marginRight: 30 }}>
                                <Text style={[utils.margin15Right, utils.margin5Bottom, { flexWrap: 'wrap' }]}>

                                    <Text style={[text.bold]}
                                        onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid, username: undefined })}>
                                        {item.user.username}
                                    </Text>
                                    {" "}  {item.body}
                                </Text>
                                <Text
                                    style={[text.grey, text.small, utils.margin5Bottom]}>
                                    {timeDifference(new Date(), item.creation.toDate())}
                                </Text>
                            </View>


                        </View>
                        : null}


                </View>
            )
            }
        />
        <View style={[utils.borderTopGray]}>
            < View style={[container.horizontal, utils.padding10, utils.alignItemsCenter, utils.backgroundWhite]} >
                {
                    props.currentUser.profile_picture == 'default' ?
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
                                    uri: props.currentUser.profile_picture
                                }}
                            />
                        )
                }
                <View style={[container.horizontal, utils.justifyCenter, utils.alignItemsCenter]}>
                    < TextInput
                        ref={input => { setTextInput(input) }}
                        value={input}
                        multiline={true}
                        style={[container.fillHorizontal, container.input, container.container]}
                        placeholder='comment...'
                        onChangeText={(input) => setInput(input)} />

                    < TouchableOpacity
                        onPress={() => onCommentSend()}
                        style={{ width: 100, alignSelf: 'center' }}>
                        <Text style={[text.bold, text.medium, text.deepskyblue]} >Post</Text>
                    </TouchableOpacity >
                </View>

            </View >
        </View>

    </View >
    )
}

const mapStateToProps = (store) => ({    
    users: store.usersState.users,
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);
  
export default connect(mapStateToProps, mapDispatchProps)(CommentsScreen)
