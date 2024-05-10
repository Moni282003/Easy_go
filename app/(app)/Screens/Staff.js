import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Staff() {
  const navigation = useNavigation();

  const navigateToPage1 = () => {
    navigation.navigate('AddUser');
  };

  const navigateToPage2 = () => {
    navigation.navigate('EditUser');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} style={[styles.button, styles.button1]} onPress={navigateToPage1}>
        <Text style={styles.buttonText}>Add User</Text>
        <AntDesign name="addusergroup" size={24} color="black" style={styles.image}/>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} style={[styles.button, styles.button2]} onPress={navigateToPage2}>
        <Text style={styles.buttonText}>Edit User</Text>
        <Feather name="edit" size={24} color="black" style={styles.image} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
    borderRadius: 18,
    width:300,
    height:180,
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#6AB04A', 
  },
  button2: {
    backgroundColor: '#40916c',
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign:"left"
  },
  image:{
    fontSize:70,
    color:"white",
    marginLeft:180,
    marginTop:50
  }
});
