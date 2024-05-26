import React, { useState } from 'react';
import { View, Text, Pressable, ToastAndroid, TextInput, Image } from 'react-native';
import { supabase } from '../../util/supabase'; // Import Supabase
import LottieView from 'lottie-react-native';

export default function Categories() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addCategory = async () => {
    setLoading(true);
    try {
      const trimmedCategoryName = categoryName.trim();
      if (!trimmedCategoryName) {
        setError('Category name cannot be empty');
        setLoading(false);

        return;
      }

      const lowerCaseCategoryName = trimmedCategoryName.toLowerCase();

      const { data: existingCategories, error: fetchError } = await supabase
        .from('Category')
        .select('Category')
        .ilike('Category', `%${lowerCaseCategoryName}%`);

      if (fetchError) {
        console.error(fetchError.message);
        setLoading(false);
        return;
      }

      const isCategoryExisting = existingCategories.some(category => category.Category.toLowerCase() === lowerCaseCategoryName);

      if (isCategoryExisting) {
        setError('Category already exists');
        setLoading(false);
        return;
      }

      const timestamp = new Date().getTime(); 
      const createdAt = formatDate(new Date());      
      const { data, error: insertError } = await supabase
        .from('Category')
        .insert([
          { id: timestamp, created_at: createdAt, Category: trimmedCategoryName },
        ])
        .select();
      
      if (insertError) {
        console.error(insertError.message);
        setLoading(false);
      } else {
        ToastAndroid.show('Category added!', ToastAndroid.SHORT);
        setCategoryName(''); 
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
    setLoading(false);
  };
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 20, paddingTop: 100 }}>
      <View style={{ alignItems: 'center' ,flexDirection:"row"}}>
        <LottieView style={{width:180,height:100}} source={require('../../util/Animation - 1716720322955.json')} autoPlay loop />
        <Text style={{fontSize:28,fontStyle:"italic",fontWeight:"bold"}}>CATEGORIES</Text>
      </View>

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

      <Pressable
        onPress={addCategory}
        style={{ backgroundColor: "midnightblue", alignItems: "center", justifyContent: "center", marginTop: 50, height: 50, borderRadius: 10, marginHorizontal: 20 }}
      >
        {loading ? (
          <LottieView style={{width:100,height:100}} source={require('../../util/Animation - 1716706020643.json')} autoPlay loop />
        ) : (
          <Text style={{ color: "white", fontSize: 20,fontWeight:"bold" }}>Add Category</Text>
        )}
      </Pressable>

      <Text style={{ color: "black", marginTop: 90, textAlign: "justify", fontSize: 16,color:"gray",fontStyle:"italic" }}>
        Explore diverse locales worldwide with our app! From bustling cities to quaint towns, uncover global destinations. Share cherished spots and craft personalized adventures with tailored recommendations. Begin your exploration today.
      </Text>
    </View>
  );
}
