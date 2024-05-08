import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function List() {
  const categories = [
    { name: "List Places", backgroundColor: "#3b5998", icon: <MaterialIcons name="place" size={70} color="white" />, onPress: () => handlePress("List Places"), totalCount: 10 },
    { name: "List Category", backgroundColor: "#009688", icon: <FontAwesome5 name="th-list" size={70} color="white" />, onPress: () => handlePress("List Category"), totalCount: 20 },
    { name: "List Items", backgroundColor: "#4CAF50", icon: <MaterialIcons name="add-shopping-cart" size={70} color="white" />, onPress: () => handlePress("List Items"), totalCount: 15 },
    { name: "List Advertisement", backgroundColor: "#2196F3", icon: <MaterialCommunityIcons name="newspaper" size={70} color="white" />, onPress: () => handlePress("List Advertisement"), totalCount: 8 }
  ];

  const handlePress = (itemName) => {
    console.log(`Pressed: ${itemName}`);
  };

  return (
    <View style={{ backgroundColor: "#2C3E50", flex: 1 }}>
      <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", marginVertical: 15, color: "#eeffee" }}>List in EasyGo</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <Pressable
            style={{ backgroundColor: item.backgroundColor, width: "90%", marginLeft: "5%", height: 170, borderRadius: 20, marginBottom: 30, elevation: 10 }}
            onPress={item.onPress}
          >
            <View style={{ position: 'absolute', top: 20, left: 20 }}>
              <Text style={{ fontSize: 26, color: 'white', fontWeight: "bold" }}>{item.name}</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
              {item.icon}
            </View>
            <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
              <Text style={{ fontSize: 20, color: 'white', fontWeight: "bold" }}>Total Count: {item.totalCount}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
