import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../util/supabase';

export default function AddUser() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    fetchRowCount();
  }, []);

  const fetchRowCount = async () => {
    try {
      const { count, error } = await supabase.from('Worker').select('*', { count: 'exact' });
      if (error) {
        console.error('Error fetching row count:', error.message);
      } else {
        setRowCount(count);
      }
    } catch (error) {
      console.error('Error fetching row count:', error.message);
    }
  };

  const handleAddUser = async () => {
    const currentDate = new Date(); 
    const formattedDate = formatDate(currentDate);
    const nextId = rowCount + 1;
    const { error } = await supabase
      .from('Worker')
      .insert([
        { id: nextId, created_at: formattedDate, Name: name, Username: username, Password: password }
      ]);
    if (error) {
      console.error('Error inserting data:', error.message);
    } else {
      console.log('User added successfully!');
      setName('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRowCount(rowCount + 1);
    }
  };

  // Function to format timestamp
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ADD USER</Text>
      <View style={styles.inputContainer}>
        <TextInput
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
      <TouchableOpacity style={styles.button} onPress={handleAddUser}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    marginTop:15
  },
  button: {
    width: '80%',
    backgroundColor: '#40916c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
