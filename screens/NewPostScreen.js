import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import AddNewPost from '../components/newPost/AddNewPost'

export default function NewPostScreen() {

  return (
    <View style={styles.container}>
      <AddNewPost />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1
  }
})