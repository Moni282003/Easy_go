import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Stats() {
  const categories = [
    { name: "Total Places", backgroundColor: "#3b5998", icon: <MaterialIcons name="place" size={70} color="white" />, onPress: () => handlePress("List Places") },
    { name: "Total Category", backgroundColor: "#009688", icon: <FontAwesome5 name="th-list" size={70} color="white" />, onPress: () => handlePress("List Category") },
    { name: "Total Items", backgroundColor: "#4CAF50", icon: <MaterialIcons name="add-shopping-cart" size={70} color="white" />, onPress: () => handlePress("List Items") },
    { name: "Total Advertisement", backgroundColor: "#2196F3", icon: <MaterialCommunityIcons name="newspaper" size={70} color="white" />, onPress: () => handlePress("List Advertisement") }
  ];

  const handlePress = (itemName) => {
    console.log(`Pressed: ${itemName}`);
  };

  return (
    <View style={{ backgroundColor: "#2C3E50", flex: 1 }}>
     
    </View>
  );
}
