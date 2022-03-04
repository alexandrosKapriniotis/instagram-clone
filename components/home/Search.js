import { View, Text, TextInput, FlatList,StyleSheet, TouchableOpacity,Image } from 'react-native'
import React, { useState } from 'react'
import { collection, query, where,getDocs } from "firebase/firestore";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { db } from '../../firebase'
import { queryUsersByUsername } from '../../redux/actions/index'
import { container, text, utils } from '../../components/styles';
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
    <View style={[utils.backgroundWhite, container.container]}>
        <View style={{ marginVertical: 30, paddingHorizontal: 20 }}>
            <TextInput
                style={utils.searchBar}
                placeholder="Type Here..."
                onChangeText={(search) => props.queryUsersByUsername(search).then(setUsers)} />
        </View>


        <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[container.horizontal, utils.padding10Sides, utils.padding10Top]}
                    onPress={() => props.navigation.navigate("ProfileScreen", { uid: item.id, username: undefined })}>

                    {item.profile_picture == 'default' ?
                        (
                            <FontAwesome5
                                style={[utils.profileImage, utils.marginBottomSmall]}
                                name="user-circle" size={50} color="black" />

                        )
                        :
                        (
                            <Image
                                style={[utils.profileImage, utils.marginBottomSmall]}
                                source={{
                                    uri: item.profile_picture
                                }}
                            />
                        )
                    }
                    <View style={utils.justifyCenter}>
                        <Text style={text.username}>{item.username}</Text>
                        <Text style={text.name} >{item.name}</Text>
                    </View>
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

const mapDispatchProps = (dispatch) => bindActionCreators({ queryUsersByUsername }, dispatch);

export default connect(null, mapDispatchProps)(Search);
