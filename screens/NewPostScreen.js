import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
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