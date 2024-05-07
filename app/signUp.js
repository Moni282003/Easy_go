import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Text, Pressable, Platform, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UseAuth } from '../Context/UseAuth';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const { register } = UseAuth();

  const handleRegister = async () => {
    if (!email || !password || !username || !profile) {
      Alert.alert("Sign Up", "Please fill all the fields!");
      return;
    }
    let response = await register(email, password, username, profile);
    console.log('Got result:', response);
    if (!response.success) {
      Alert.alert('Sign Up', response.msg);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View>
        <Image
          style={styles.logo}
          source={require('./../assets/images/logo.png')}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SIGNUP</Text>
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
          onPress={handleRegister} // Add onPress event
        >
          <Text style={styles.buttonText}>SignUp</Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text>Already have Admin Account?</Text>
          <Pressable onPress={() => router.replace('signIn')}>
            <Text style={styles.signUpText}>SignIn</Text>
          </Pressable>
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Developed by Monish M</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 50
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
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  signUpContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  signUpText: {
    textDecorationLine:"underline",
    fontSize: 15,
    color:"blue",
    fontWeight:"bold"
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 15,
    color:"gray",
    fontWeight:"bold"
  },
});
