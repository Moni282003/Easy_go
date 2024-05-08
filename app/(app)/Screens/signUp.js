import React, { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Text, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UseAuth } from '../../../Context/UseAuth';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const { register,user } = UseAuth();
  const handleRegister = async () => {
    if (!email || !password || !username || !profile) {
      Alert.alert("Sign Up", "Please fill all the fields!");
      return;
    }
    let response = await register(email, password, username, profile);
    console.log('Got result:', response);
    if (response.success) {
      Alert.alert('Sign Up', 'Registration successful');
      // Clear the input fields if needed
      setEmail("");
      setPassword("");
      setUsername("");
      setProfile("");
    } else {
      Alert.alert('Sign Up', response.msg);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ADD NEW ADMIN</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="image" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder='Profile Image URL'
            value={profile}
            onChangeText={setProfile}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.signInButton}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Add Admin</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderColor: 'gray',
    width: '90%',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor:"#cccccc"
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  signInButton: {
    borderWidth: 2,
    backgroundColor: "midnightblue",
    marginHorizontal: 15,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    letterSpacing: 1,
  },
});

