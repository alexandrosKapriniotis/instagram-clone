import { USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE,USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USER_CHATS_STATE_CHANGE } from '../constants';
import { Constants } from 'react-native-unimodules';

import { auth,db } from '../../firebase';
import { collection, doc, getDocs,getDoc, onSnapshot, query, orderBy, deleteDoc, updateDoc, where, limit } from "firebase/firestore";

let unsubscribe = [];

export function clearData() {
    return ((dispatch) => {
        for (let i = unsubscribe; i < unsubscribe.length; i++) {
            unsubscribe[i]();
        }
        dispatch({ type: CLEAR_DATA })
    })
}
export function reload() {
    return ((dispatch) => {
        dispatch(clearData())
        dispatch(fetchUser())
        dispatch(setNotificationService())
        dispatch(fetchUserPosts())
        dispatch(fetchUserFollowing())
        dispatch(fetchUserChats())

    })
}

export const setNotificationService = () => async dispatch => {
    let token;
    if (Constants.isDevice) {
        const existingStatus = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus.status !== 'granted') {
            const status = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus.status !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync());
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    if (token != undefined) {
        
        updateDoc(doc(db,"users",auth.currentUser.uid),{
            notificationToken: token.data,
        })
    }

}

export const sendNotification = (to, title, body, data) => dispatch => {
    if (to == null) {
        return;
    }

    let response = fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to,
            sound: 'default',
            title,
            body,
            data
        })
    })

}

export function fetchUser() {
    return ((dispatch) => {
        const docRef = doc(db,"users",auth.currentUser.uid );

        getDoc(docRef).then((snapshot) => {                    
            if (snapshot.exists()) {                
                dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: {
                        uid: auth.currentUser.uid, 
                        ...snapshot.data()
                    }
                })
            } else {
                console.log('user does not exist')
            }
        })            
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {

        const docRef = doc(db, "posts", auth.currentUser.uid);
        
        getDocs(query(collection(docRef,"userPosts"),orderBy("creation","desc"))).then((snapshot) => {
            
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
               
            dispatch({ 
                type: USER_POSTS_STATE_CHANGE, 
                posts 
            })                   
        }).catch((err) => {
            console.error("Failed to retrieve data", err);
        });                 
    })
}

export function fetchUserChats() {
    return ((dispatch) => {
        let listener = 
        onSnapshot(
            query(collection("chats"), 
            where("users", "array-contains", auth.currentUser.uid),
            orderBy("lastMessageTimestamp", "desc"))).
            then( snapshot => {
                let chats = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                for (let i = 0; i < chats.length; i++) {
                    let otherUserId;
                    if (chats[i].users[0] == auth.currentUser.uid) {
                        otherUserId = chats[i].users[1];
                    } else {
                        otherUserId = chats[i].users[0];
                    }
                    dispatch(fetchUsersData(otherUserId, false))
                }

                dispatch({ type: USER_CHATS_STATE_CHANGE, chats });
            });
            
        unsubscribe.push(listener)
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {

        const docRef = doc(db, "following", auth.currentUser.uid);
        
        onSnapshot(collection(docRef,"userFollowing"), (snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id;
            });
            dispatch({ 
                type: USER_FOLLOWING_STATE_CHANGE, 
                following 
            })
            
            for (let i = 0; i < following.length; i++) {                
                dispatch(fetchUsersData(following[i],true));
            }
        })                                                                       
    })
}

export function fetchUsersData(uid,getPosts) {
    return ((dispatch,getState) => {
        
        const found = getState().usersState.users.some(el => el.uid === uid);
        
        if (!found) {            
            const usersRef = doc(db, "users", uid);

            getDoc(usersRef).then((snapshot) => {                    
                if (snapshot.exists()) {                
                    let user = snapshot.data();
                    user.uid = snapshot.id;

                    dispatch({ type: USERS_DATA_STATE_CHANGE, user });                                       
                } else {
                    console.log('does not exist')
                }
            })                
            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid));
            }
        }
    });
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch,getState) => {

        const docRef = doc(db, "posts", uid);
        getDocs(query(collection(docRef,"userPosts"),orderBy("creation","asc"))).then((snapshot) => {
            // const uid = snapshot.query.EP.path.segments[1];
            const uid = snapshot.docs[0].ref.path.split('/')[1];

            const user = getState().usersState.users.find(el => el.uid === uid);

            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data, user }
            })
            
            dispatch({ 
                type: USERS_POSTS_STATE_CHANGE, 
                posts,
                uid 
            })
            
        }).catch((err) => {
            console.error("Failed to retrieve data", err);
        });                 
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
        const currentUserRef = doc(db,"posts",uid,"userPosts",postId,"likes",auth.currentUser.uid);

        let listener = onSnapshot(currentUserRef, (snapshot) => {
            const postId = snapshot.id;

            let currentUserLike = false;
            if (snapshot.exists) {
                currentUserLike = true;
            }

            dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
        });

        unsubscribe.push(listener)
    })
}

export function queryUsersByUsername(username) {
    return ((dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if (username.length == 0) {
                resolve([])
            }
            const q = query(collection(db,"users"),where('username', '>=', username),limit(10));

            getDocs(q).then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                resolve(users);
                             
            }).catch((err) => {
                console.error("Failed to retrieve data", err);
            });            
        })
    })
}

export function deletePost(item) {
    return ((dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const itemRef = doc(db,"posts",auth.currentUser.uid,"userPosts",item.id)

            deleteDoc(itemRef).then(() => {
                resolve();
            }).catch(() => {
                reject();
            })
        })
    })
}
