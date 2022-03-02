import { USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE,USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants';

import { auth,db } from '../../firebase';
import { collection, doc, getDocs,getDoc, onSnapshot, query, orderBy } from "firebase/firestore";

let unsubscribe = [];

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
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

export function reload() {
    return ((dispatch) => {
        dispatch(fetchUser()),
        dispatch(fetchUserPosts()),
        dispatch(fetchUserFollowing())    
    })
}
