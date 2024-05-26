import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Text, Alert, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import { UseAuth } from '../Context/UseAuth';
import { supabase } from '../util/supabase';
import LottieView from 'lottie-react-native';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { login, setType } = UseAuth();
  const [loading,setLoading]=useState(false)
  const navigate = useNavigation();

  const handleLogin = async () => {
    setLoading(true)
    if (!email || !pass) {
      Alert.alert("Sign In", "Please fill all the fields!");
      setLoading(false)
      return;
    }

    const { data, error } = await supabase
      .from('Worker')
      .select('Username,Password,Activity')
      .eq('Username', email)
      .single();

    if (!data) {
      const response = await login(email, pass);
      if (!response.success) {
        Alert.alert("Sign In", response.msg);
        setType(true);
      }
    } else {
      if (error || !data || data.Password !== pass) {
        Alert.alert("Authentication failed!", "Please check your credentials.");
      } else {
        if(data.Activity=="true"){
        Alert.alert("Successful", "Authentication successful!");
        setType(false);
        navigate.navigate('(app)'); 
      }
        
        else{
          Alert.alert("Locked Account", "Your Account is inactive!");}
          console.log(data.Activity)
        }
       
      }
      setLoading(false)
    
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <LottieView style={{width:150,height:150,marginLeft:250}} source={require('../util/Animation - 1716705566377.json')} autoPlay loop />
      <View>
        <Image
          style={styles.logo}
          source={require('./../assets/images/logo.png')}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ADMIN LOGIN</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder='Username'
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
            value={pass}
            onChangeText={setPass}
            keyboardType='number-pad'
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.signInButton}
          onPress={handleLogin} // Add onPress event
        >

{loading ? (        <LottieView style={{width:150,height:100}} source={require('../util/Animation - 1716706020643.json')} autoPlay loop />
):(<Text style={styles.buttonText}>Sign In</Text>
)         
}
        </TouchableOpacity>

        {/* <View style={styles.signUpContainer}>
          <Text>New Admin Account?</Text>
          <Pressable onPress={() => router.replace('signUp')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </Pressable>
        </View> */}
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
    paddingBottom: 50,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
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
    marginTop:40
  },
  footerText: {
    fontSize: 18,
    color:"gray",
    fontWeight:"bold"
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
