import { View, Text, Pressable, FlatList, TextInput, ToastAndroid, Alert, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../util/supabase'; 
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ViewPlace() {
  const [searchText, setSearchText] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    async function fetchPlaces() {
      try {
        const { data, error } = await supabase.from('Places').select('name');

        if (error) {
          console.error(error.message);
        } else {
          setPlaces(data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); 
      }
    }
    fetchPlaces();
  }, []);

  const handleDelete = async (name) => {
    try {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to delete ${name}?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const { error } = await supabase.from('Places').delete().eq('name', name);
              if (error) {
                console.error(error.message);
              } else {
                setPlaces(places.filter(place => place.name !== name));
                ToastAndroid.show('Place Deleted!', ToastAndroid.SHORT);
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

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}> 
      <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20, fontWeight: "bold" }}>LIST OF PLACES</Text>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40 }}>
        <TextInput
          placeholder='Search'
          style={{ borderWidth: 1, width: "80%", padding: 10, borderRadius: 7, fontSize: 18, paddingLeft: 15 }}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40,backgroundColor:"#2222ff",gap:80 }}>
        <Text style={{ paddingLeft: 30,fontSize:20,color:"white",fontWeight:"bold"}}>SNO</Text>
        <Text style={{fontSize:20,color:"white",fontWeight:"bold",paddingLeft:20}}>NAME</Text>
        <Text style={{ paddingRight: 30,fontSize:20,color:"white",fontWeight:"bold" }}>ACTION</Text>
      </View>
      {loading ? ( 
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#0000ff" />
      ) : (
        <ScrollView> 
          {filteredPlaces.length > 0 ? (
            <FlatList
              data={filteredPlaces}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{borderBottomWidth:1,
                  display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#DDDDDD',height:50}}>
                  <Text style={{ paddingLeft: 40,fontSize:18}}>{index + 1}</Text>
                  <Text style={{fontSize:18}}>{item.name}</Text>
                  <Pressable onPress={() => handleDelete(item.name)} style={{ paddingRight: 50 }}>
                    <AntDesign name="delete" size={24} color="red" />
                  </Pressable>
                </View>
              )}
            />
          ) : (
            <Text
              style={{textAlign:"center",fontSize:20,marginTop:200}}
            >
              No Results Found
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}
