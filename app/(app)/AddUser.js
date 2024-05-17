import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../util/supabase';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function AddUser() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAddUser = async () => {
    if (password.length < 7) {
      Alert.alert('Error', 'Password must be at least 10 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const usernameRegex = /^EASYGO_\d{3}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Error', 'Username should begin with EASYGO_ followed by 3 numbers.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Worker')
        .select('Username')
        .eq('Username', username)
        .limit(1);

      if (error) {
        console.error('Error checking username:', error.message);
        return;
      }

      if (data.length) {
        Alert.alert('Error', 'Username already exists.');
        return;
      }

      const currentDate = new Date();
      const id = currentDate.getTime(); 
      const formattedDate = formatDate(currentDate);
      
      const { error: insertError } = await supabase
        .from('Worker')
        .insert([
          { id, created_at: formattedDate, Name: name, Username: username, Password: password, Activity: true }
        ]);

      if (insertError) {
        console.error('Error inserting data:', insertError.message);
        return;
      }

      Alert.alert('Success', 'User added successfully!');
      setName('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
   
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ADD USER</Text>
      <View style={styles.inputContainer}>
        <TextInput
        autoFocus
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={handleAddUser}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
      <View style={{display:"flex",flexDirection:"row",alignItems:"center",marginHorizontal:15,marginTop:40,gap:7}}>
        <Text>
        <FontAwesome6 name="hand-point-right" size={18} color="gray" />
        </Text>
        <Text style={{fontSize:12,color:"gray"}}>
          Username should begin with EASYGO_ followed by three digit number an it should be unique.
        </Text>
      </View>
      <View style={{display:"flex",flexDirection:"row",alignItems:"center",marginHorizontal:15,marginTop:20,gap:7}}>
        <Text>
        <FontAwesome6 name="hand-point-right" size={18} color="gray" />
        </Text>
        <Text style={{fontSize:12,color:"gray",textAlign:"justify"}}>
          Password should be at least 10 characters long and both Password and confirmPassword should be same.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop:50,
    // borderLeftWidth:20,
    // borderLeftColor:"blue",
    // borderTopWidth:20,
    // borderTopColor:"tomato",
    // borderRightWidth:20,
    // borderRightColor:"blue",
    // borderBottomWidth:20,
    // borderBottomColor:"tomato",
    backgroundColor:"#efefef"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 15,
  },
  button: {
    width: '80%',
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
