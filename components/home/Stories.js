import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';

import { USERS } from '../../data/users.js'

function Stories(props) {
  return (
    <View style={styles.container}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false} 
        >
          {
              USERS.map((story,index) => {
                 return <View key={index} style={{ alignItems:'center' }}>
                            <Image source={{uri: story.image}} style={styles.story} />
                            <Text style={styles.text}>{ 
                                story.description.length > 11 
                                ? story.description.slice(0,10).toLowerCase() + '...' 
                                : story.description.toLowerCase()
                            }</Text>
                        </View>;  
              })
          }
        </ScrollView>        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  story: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 3,
    borderColor: '#ff8501'
  },
  text: {
    color: "#FFF"
  }
});

export default Stories;