import { getFirestore, doc,getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { USER_STATE_CHANGE } from '../constants';

export function fetchUser() {
    return ((dispatch) => {
        const auth = getAuth();
        const firestore = getFirestore();
        const docRef = doc(firestore,"users",auth.currentUser.uid );

        let listener = getDoc(docRef).then((snapshot) => {                    
            if (snapshot.exists()) {                
                dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: snapshot.data()
                })
            } else {
                console.log('does not exist')
            }
        })            
    })
}