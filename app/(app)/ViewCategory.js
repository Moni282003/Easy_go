import { View, Text, Pressable, FlatList, TextInput, ToastAndroid, Alert, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../util/supabase'; 
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ViewCategory() {
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('Category').select('Category');

        if (error) {
          console.error(error.message);
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false); 
      }
    }
    fetchCategories();
  }, []);

  const handleDelete = async (categoryName) => {
    try {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to delete ${categoryName}?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const { error } = await supabase.from('Category').delete().eq('Category', categoryName);
              if (error) {
                console.error(error.message);
              } else {
                setCategories(categories.filter(category => category.Category !== categoryName));
                ToastAndroid.show('Category Deleted!', ToastAndroid.SHORT);
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.Category.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort categories alphabetically
  const sortedCategories = filteredCategories.sort((a, b) => a.Category.localeCompare(b.Category));

  return (
    <ScrollView>
      <View>
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20, fontWeight: "bold" }}>LIST OF CATEGORIES</Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40 }}>
          <TextInput
            placeholder='Search'
            style={{ borderWidth: 1, width: "80%", padding: 10, borderRadius: 7, fontSize: 18, paddingLeft: 15 }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40, backgroundColor:"#2222ff", gap:80 }}>
          <Text style={{ paddingLeft: 30, fontSize:20, color:"white", fontWeight:"bold" }}>SNO</Text>
          <Text style={{ fontSize:20, color:"white", fontWeight:"bold", paddingLeft:20 }}>NAME</Text>
          <Text style={{ paddingRight: 30, fontSize:20, color:"white", fontWeight:"bold" }}>ACTION</Text>
        </View>

        {isLoading ? ( 
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : sortedCategories.length > 0 ? (
          <View style={{ flex: 1 }}> 
            <FlatList
              data={sortedCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{ borderBottomWidth:1,display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#DDDDDD', height:50 }}>
                  <Text style={{ paddingLeft: 40, fontSize:18 }}>{index + 1}</Text>
                  <Text style={{ fontSize:18 }}>{item.Category}</Text>
                  <Pressable onPress={() => handleDelete(item.Category)} style={{ paddingRight: 50 }}>
                    <AntDesign name="delete" size={24} color="red" />
                  </Pressable>
                </View>
              )}
              nestedScrollEnabled={true}
            />
          </View>
        ) : (
          <Text
            style={{textAlign:"center",fontSize:20,marginTop:200}}
          >
            No Results Found
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
