import React, { useEffect,useState,useRef } from 'react';
import { FlatList, RefreshControl, Text, View,StyleSheet } from 'react-native';
// import BottomSheet from 'react-native-bottomsheet-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Post from '../components/home/Post';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';


function HomeScreen(props) {
  const navigation = props.navigation;
  const [posts,setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [unmutted, setUnmutted] = useState(null)
  const [inViewPort, setInViewPort] = useState(0)
  const [sheetRef, setSheetRef] = useState(useRef(null))
  const [modalShow, setModalShow] = useState({ visible: false, item: null })
  const [isValid, setIsValid] = useState(true);

  useEffect( () => {    
    let posts = [];
    
    if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
      
      for(let i=0;i < props.following.length; i++) {
        const user = props.users.find(el => el.uid === props.following[i]);

        if(user != undefined){
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort((x,y) => {
        return x.creation - y.creation;
      });

      return setPosts(posts);
    }
  },[props.usersFollowingLoaded])

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (changed && changed.length > 0) {
        setInViewPort(changed[0].index);
    }
  });

  return (
    <View style={styles.container}>
        <Header navigation={navigation} />
        <Stories />

        <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            props.reload()
                        }}
                    />
                }
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={{
                    waitForInteraction: false,
                    viewAreaCoveragePercentThreshold: 70
                }}
                numColumns={1}
                horizontal={false}
                data={posts}
                keyExtractor={(item, index) => index.toString()}

                renderItem={({ item, index }) => (
                    <View key={index}>
                        <Post route={{ params: { user: item.user, item, index, unmutted, inViewPort, setUnmuttedMain: setUnmutted, setModalShow, feed: true } }} navigation={props.navigation} />
                    </View>
                )}
            />        
        <Text
          onPress={() => 
            navigation.navigate('Comment',
            { postId: item.id, uid: item.user.uid })
          }
        >View Comments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'black'
  }
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(HomeScreen);