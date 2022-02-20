import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FormikPostUploader from './FormikPostUploader';
import { useNavigation } from '@react-navigation/native';

 
const AddNewPost = () => {
  const navigation = useNavigation();
    
  return (
    <View style={styles.container}>
        <Header navigation={navigation} />
        <FormikPostUploader navigation={navigation} />
    </View>
  )
}

const Header = ({navigation}) => (
    <View style={styles.headerContainer}>
      <View style={{position: 'absolute',left:0,zIndex: 999}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name='chevron-left' size={30} color='#fff' />
            </TouchableOpacity>
        </View>  
      <Text style={styles.headerText}>Add New Post</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    headerText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
        flex: 1
    }
})

export default AddNewPost