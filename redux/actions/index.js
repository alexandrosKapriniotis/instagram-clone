import { doc,getDoc } from 'firebase/firestore';
import { USER_STATE_CHANGE } from '../constants';

import { auth,db } from '../../firebase';

export function fetchUser() {
    return ((dispatch) => {
        const docRef = doc(db,"users",auth.currentUser.uid );

        let listener = getDoc(docRef).then((snapshot) => {                    
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

export function reload() {
    return ((dispatch) => {
        dispatch(fetchUser())    
    })
}
