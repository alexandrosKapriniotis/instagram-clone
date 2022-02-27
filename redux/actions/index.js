import { USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE } from '../constants';

import { auth,db } from '../../firebase';
import { collection, doc, getDocs,getDoc } from "firebase/firestore";

export function fetchUser() {
    return ((dispatch) => {
        const docRef = doc(db,"users",auth.currentUser.email );

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
                console.log('does not exist')
            }
        })            
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {

        const docRef = doc(db, "posts", auth.currentUser.uid);
        
        getDocs(collection(docRef,"userPosts")).then((snapshot) => {
            
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

export function reload() {
    return ((dispatch) => {
        dispatch(fetchUser()),
        dispatch(fetchUserPosts())    
    })
}
