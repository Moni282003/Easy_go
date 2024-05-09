import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Category() {
  const navigation = useNavigation();

  const categories = [
    { name: "Add Places", backgroundColor: "#FF5733", icon: <MaterialIcons name="place" size={70} color="white" />, onPress: () => handlePress("Add Places") },
    { name: "Add Category", backgroundColor: "#FFC300", icon: <FontAwesome5 name="th-list" size={70} color="white" />, onPress: () => handlePress("Add Category") },
    { name: "Add Items", backgroundColor: "#33FF71", icon: <MaterialIcons name="post-add" size={70} color="white" />, onPress: () => handlePress("Add Items") },
    { name: "Add Advertisement", backgroundColor: "#339CFF", icon: <MaterialCommunityIcons name="newspaper" size={70} color="white" />, onPress: () => handlePress("Add Advertisement") }
  ];

  const handlePress = (itemName) => {
    console.log(`Pressed: ${itemName}`);
    switch (itemName) {
      case "Add Places":
        navigation.navigate('Place');
        break;
      case "Add Category":
        navigation.navigate('Categories');
        break;
      case "Add Items":
        navigation.navigate('Items');
        break;
      case "Add Advertisement":
        navigation.navigate('Advertisement');
        break;
      default:
        break;
    }
  };

  return (
    <View style={{ backgroundColor: "#2C3E50", flex: 1 }}>
      <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", marginVertical: 15, color: "white" }}>Add in EasyGo</Text>
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
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
