import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UseAuth } from '../../../Context/UseAuth';
import { useRouter } from 'expo-router'; 

export default function Setting() {
  const { user } = UseAuth();
  const router = useRouter(); 

  const handleAddUser = () => {
    // router.replace('signUp'); 
  };

  return (
    <View style={{ backgroundColor: "#051923", flex: 1 }}>
      <Image source={{ uri: user.profileurl }} style={{ width: 200, height: 200, borderRadius: 100, marginTop: 20, marginLeft: "25%" }} />
      <Text style={{ textAlign: "center", color: "white", padding: 40, fontSize: 25, fontWeight: "bold", paddingBottom: 10 }}>{user.username}</Text>
      <Text style={{ textAlign: "center", color: "white", padding: 0, fontSize: 25, fontWeight: "bold" }}>Admin</Text>

      

      <View>
        <Text style={{ textAlign: "center", color: "white", paddingTop: 40 }}>Developed by Monish M</Text>
      </View>
    </View>
  );
}
