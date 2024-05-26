import React, { useState } from 'react';
import { View, Text, Pressable, ToastAndroid, TextInput, Image } from 'react-native';
import { supabase } from '../../util/supabase';
import LottieView from 'lottie-react-native';

export default function Place() {
  const [placeName, setPlaceName] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading]=useState(false)
  const addPlace = async () => {
    setLoading(true);
    try {
      const trimmedPlaceName = placeName.trim();
      if (!trimmedPlaceName) {
        setError('Place name cannot be empty');
        setLoading(false);
        return;
      }
  
      const lowerCasePlaceName = trimmedPlaceName.toLowerCase();
  
      const { data: existingPlaces, error: fetchError } = await supabase
        .from('Places')
        .select('name')
        .ilike('name', `%${lowerCasePlaceName}%`);
  
      if (fetchError) {
        console.error(fetchError.message);
        setLoading(false);
        return;
      }
  
      if (existingPlaces.length > 0) {
        setError('Place already exists');
        setLoading(false);
        return;
      }
  
      const createdAt = formatDate(new Date());
      const timestamp = new Date().getTime(); 
      const { data, error: insertError } = await supabase
        .from('Places')
        .insert([{ id: timestamp, created_at: createdAt, name: trimmedPlaceName }])
        .select();
      
      if (insertError) {
        console.error(insertError.message);
        setLoading(false);
      } else {
        ToastAndroid.show('Place added!', ToastAndroid.SHORT);
        setPlaceName(''); 
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };
  
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 20, paddingTop: 40 }}>
      <View >
      <View style={{ alignItems: 'center' ,flexDirection:"row"}}>
      <LottieView style={{width:180,height:180}} source={require('../../util/Animation - 1716707172995.json')} autoPlay loop />
      <Text style={{fontSize:32,fontStyle:"italic",fontWeight:"bold"}}>PLACE</Text>
      </View>

      {/* Text Input */}
      <View style={{ marginTop: 40 }}>
        <TextInput
          style={{ backgroundColor: "white", borderWidth: 1, borderColor: "gray", borderRadius: 15, padding: 10, fontSize: 20, paddingHorizontal: 15 }}
          placeholder='Enter place to add'
          placeholderTextColor="#666"
          value={placeName}
          onChangeText={text => {
            setPlaceName(text);
            setError(''); 
          }}
        />
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      </View>

      <Pressable
        onPress={addPlace}
        style={{ backgroundColor: "midnightblue", alignItems: "center", justifyContent: "center", marginTop: 50, height: 50, borderRadius: 10, marginHorizontal: 20 }}
      >
{
loading ?(
  <LottieView style={{width:100,height:100}} source={require('../../util/Animation - 1716706020643.json')} autoPlay loop />
):
(
<Text style={{ color: "white", fontSize: 20,fontWeight:"bold" }}>Add Place</Text>
)

}


      </Pressable>

      <Text style={{ color: "black", marginTop: 90, textAlign: "justify", fontSize: 16,fontStyle:"italic",color:"gray" }}>
        Discover cities, towns, and more with our app! Explore global destinations, from vibrant metropolises to charming villages. Share your favorite spots and plan your next adventure with personalized recommendations. Start exploring today!
      </Text></View>
    </View>
  );
}
