import React, { useState } from 'react';
import { View, Text, Pressable, ToastAndroid, TextInput, Image } from 'react-native';
import { supabase } from '../../util/supabase';

export default function Place() {
  const [placeName, setPlaceName] = useState('');
  const [error, setError] = useState('');

  const addPlace = async () => {
    try {
      const { data: existingPlaces, error: fetchError } = await supabase
        .from('Places')
        .select('name')
        .eq('name', placeName);
      
      if (fetchError) {
        console.error(fetchError.message);
        return;
      }

      if (existingPlaces.length > 0) {
        setError('Place already exists');
        return;
      }

      const createdAt = formatDate(new Date());
      const timestamp = new Date().getTime(); 
      const { data, error: insertError } = await supabase
        .from('Places')
        .insert([{id:timestamp, created_at: createdAt, name: placeName }])
        .select();
      
      if (insertError) {
        console.error(insertError.message);
      } else {
        ToastAndroid.show('Place added!', ToastAndroid.SHORT);
        setPlaceName(''); 
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#eeeeee", paddingHorizontal: 20, paddingTop: 40 }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('./../../assets/images/images.png')}
          style={{ width: 350, borderRadius: 10, elevation: 20 }}
        />
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
        style={{ backgroundColor: "#FF5733", alignItems: "center", justifyContent: "center", marginTop: 50, height: 50, borderRadius: 10, marginHorizontal: 20 }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Add</Text>
      </Pressable>

      <Text style={{ color: "black", marginTop: 90, textAlign: "justify", fontSize: 18 }}>
        Discover cities, towns, and more with our app! Explore global destinations, from vibrant metropolises to charming villages. Share your favorite spots and plan your next adventure with personalized recommendations. Start exploring today!
      </Text>
    </View>
  );
}
