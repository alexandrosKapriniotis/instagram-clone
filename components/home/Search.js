import { View, Text, TextInput, FlatList,StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { collection, query, where,getDocs } from "firebase/firestore";

import { db } from '../../firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Search = (props) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("username", ">=", search));

    getDocs(q).then((snapshot) => {
        let users = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
        })   
        setUsers(users);
                     
    }).catch((err) => {
        console.error("Failed to retrieve data", err);
    });
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name='magnify' style={styles.icon} color='#FFF' />
        <TextInput placeholder='Search' style={styles.input} onChangeText={(search) => fetchUsers(search)} />
      </View>  
      
      <FlatList 
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({item}) => (
            <TouchableOpacity 
                onPress={() => props.navigation.navigate('BottomTabs',{screen: "ProfileScreen",params: {uid: item.owner_uid}})}
            >
                <Text>{item.username}</Text>
            </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1
    },
    searchContainer: {
        backgroundColor: "#ddd",
        borderRadius: 20,
        marginHorizontal: 10,
        alignItems: "center",
        flexDirection: "row"
    },
    icon: {        
        fontSize: 20,
        marginHorizontal: 10
    },
    input: {
    }
  })

export default Search