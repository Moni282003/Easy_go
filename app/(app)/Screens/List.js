import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { supabase } from '../../../util/supabase';
import Feather from '@expo/vector-icons/Feather';

export default function List() {
  const [row1,setRow1]=useState(0)
  const [row2,setRow2]=useState(0)
  const [row3,setRow3]=useState(0)
  const [row4,setRow4]=useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); // Initialize navigation object

  const onRefresh = () => {
    setRefreshing(true);
    getValue();
    setRefreshing(false);
  };

  useEffect(() => {
    getValue();
  }, []);

  const getValue = async () => {
    try {
      let { data: Category, error } = await supabase
        .from('Category')
        .select('*');

      if (error) {
        console.error(error.message);
      } else {
        setRow1(Category.length);
      }

      let { data: Places, error1 } = await supabase
        .from('Places')
        .select('*');
        let { data: adv, error4 } = await supabase
        .from('Adv')
        .select('*');
        setRow4(adv.length)

      if (error1) {
        console.error(error.message);
      } else {
        setRow2(Places.length);
      }
      let { data: Items, error2 } = await supabase
      .from('AddItem')
      .select('*');

    if (error2) {
      console.error(error.message);
    } else {
      setRow3(Items.length);
    }
    } catch (error) {
      console.error(error.message);
    }
  };

  const categories = [
    { name: "List Places", backgroundColor: "#3b5998", icon: <MaterialIcons name="place" size={70} color="white" />, onPress: () => handlePress("List Places"), totalCount: row2 },
    { name: "List Category", backgroundColor: "#3b5998", icon: <FontAwesome5 name="th-list" size={70} color="white" />, onPress: () => handlePress("List Category"), totalCount: row1 },
    { name: "List Items", backgroundColor: "#3b5998", icon: <MaterialIcons name="add-shopping-cart" size={70} color="white" />, onPress: () => handlePress("List Items"), totalCount: row3 },
    { name: "List Advertisement", backgroundColor: "#3b5998", icon: <MaterialCommunityIcons name="newspaper" size={70} color="white" />, onPress: () => handlePress("List Advertisement"), totalCount: row4 }
  ];

  const handlePress = (itemName) => {
    console.log(`Pressed: ${itemName}`);
    switch (itemName) {
      case "List Places":
        navigation.navigate('ViewPlace');
        break;
      case "List Category":
        navigation.navigate('ViewCategory');
        break;
      case "List Items":
        navigation.navigate('ViewItems');
        break;
      case "List Advertisement":
        navigation.navigate('ViewAdvertisement');
        break;
      default:
        break;
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1, borderWidth:2,
    borderColor:"#ededed" }}>
<View style={{flexDirection:"row",justifyContent:"center",gap:20,alignItems:"center",backgroundColor:"midnightblue",width:"70%",marginLeft:"15%",padding:0,borderRadius:45,marginBottom:20,marginTop:20,borderTopRightRadius:10,borderBottomLeftRadius:10,elevation:10}}>
<Feather name="list" size={36} color="white" />      
<Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", marginVertical: 15, color: "white" }}>List in EasyGo</Text></View>      
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <Pressable
            style={{ backgroundColor: item.backgroundColor, width: "90%", marginLeft: "5%", height: 120, borderRadius: 7, marginBottom: 30, elevation: 10,borderBottomLeftRadius:30,borderTopRightRadius:30,
            borderWidth:6,borderRightColor:"#cbce91ff",borderTopColor:"#cbce91ff",borderLeftColor:"#ea738dff",borderBottomColor:"#ea738dff"}}
            onPress={item.onPress}
          >
            <View style={{ position: 'absolute', top: 20, left: 20 }}>
              <Text style={{ fontSize: 21, color: 'white', fontWeight: "bold" }}>{item.name}</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}
