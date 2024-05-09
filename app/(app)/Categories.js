import React, { useState } from 'react';
import { View, Text, Pressable, ToastAndroid, TextInput, Image } from 'react-native';
import { supabase } from '../../util/supabase'; // Import Supabase

export default function Categories() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const addCategory = async () => {
    try {
      const { data: existingCategory, error: fetchError } = await supabase
        .from('Category')
        .select('Category')
        .eq('Category', categoryName);
      
      if (fetchError) {
        console.error(fetchError.message);
        return;
      }

      if (existingCategory.length > 0) {
        setError('Category already exists');
        return;
      }

      const timestamp = new Date().getTime(); 
      const createdAt = formatDate(new Date()); 
      
      const { data, error: insertError } = await supabase
        .from('Category')
        .insert([
          { id: timestamp, created_at: createdAt, Category: categoryName },
        ])
        .select();
      
      if (insertError) {
        console.error(insertError.message);
      } else {
        ToastAndroid.show('Category added!', ToastAndroid.SHORT);
        setCategoryName(''); 
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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
          placeholder='Enter categories to add'
          placeholderTextColor="#666"
          value={categoryName}
          onChangeText={text => {
            setCategoryName(text);
            setError(''); 
          }}
        />
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      </View>

      {/* Add Button */}
      <Pressable
        onPress={addCategory}
        style={{ backgroundColor: "#FF5733", alignItems: "center", justifyContent: "center", marginTop: 50, height: 50, borderRadius: 10, marginHorizontal: 20 }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Add</Text>
      </Pressable>

      <Text style={{ color: "black", marginTop: 90, textAlign: "justify", fontSize: 18 }}>
        Explore diverse locales worldwide with our app! From bustling cities to quaint towns, uncover global destinations. Share cherished spots and craft personalized adventures with tailored recommendations. Begin your exploration today.
      </Text>
    </View>
  );
}
