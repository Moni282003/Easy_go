import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';



export default function Category() {
  const navigation = useNavigation();

  const categories = [
    { name: "Add Places", backgroundColor: "#237049", icon: <MaterialIcons name="place" size={70} color="white" />, onPress: () => handlePress("Add Places") },
    { name: "Add Category", backgroundColor: "#237049", icon: <FontAwesome5 name="th-list" size={70} color="white" />, onPress: () => handlePress("Add Category") },
    { name: "Add Items", backgroundColor: "#237049", icon: <MaterialIcons name="post-add" size={70} color="white" />, onPress: () => handlePress("Add Items") },
    { name: "Add Advertisement", backgroundColor: "#237049", icon: <MaterialCommunityIcons name="newspaper" size={70} color="white" />, onPress: () => handlePress("Add Advertisement") }
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
    <View style={{ backgroundColor: "white", flex: 1, borderWidth:2,
    borderColor:"#ededed" }}>
      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"midnightblue",width:"70%",marginLeft:"15%",padding:0,borderRadius:45,marginBottom:20,marginTop:20,borderTopRightRadius:10,borderBottomLeftRadius:10,elevation:10}}>
      <LottieView style={{width:50,height:50}} source={require('../../../util/Animation - 1716706724949.json')} autoPlay loop />
      <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", marginVertical: 15, color: "white" }}>
        Add in EasyGo</Text></View>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <Pressable
            style={{ backgroundColor: item.backgroundColor, width: "90%", marginLeft: "5%", height: 120, borderRadius: 7, marginBottom: 30, elevation: 10,borderBottomLeftRadius:30,borderTopRightRadius:30,
            borderWidth:6,borderRightColor:"#cbce91ff",borderTopColor:"#cbce91ff",borderLeftColor:"#ea738dff",borderBottomColor:"#ea738dff"
            
          }}
            onPress={item.onPress}
          >
            <View style={{ position: 'absolute', top: 20, left: 20 }}>
              <Text style={{ fontSize: 21, color: 'white', fontWeight: "bold" }}>{item.name}</Text>
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
