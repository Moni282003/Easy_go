import { View, Text, TextInput, ScrollView, Image, Button, Pressable,ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../util/supabase'; 
import Entypo from '@expo/vector-icons/Entypo';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker'; 
import { decode } from 'base64-arraybuffer';

export default function Items() {
  const [images, setImages] = useState([]);
  const [image64,setImage64]=useState([])
  const [viewMap, setViewMap] = useState(false);
  const [viewWeb, setViewWeb] = useState(false);
  const [file,setFile]=useState([]);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('--Select--');
  const [selectedCategory, setSelectedCategory] = useState('--Select--');

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [url, setURL] = useState('');
  const [mapURL, setMapURL] = useState('');
  const [day, setDay] = useState('');
  const [Time, SetTime] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
      setImage64([...image64, result.assets[0].base64]);
      console.log(images.length)
     
    }
    try {
      const { data: existingPlaces, error: fetchError } = await supabase
        .from('AddItem')
        .select('Name')
        .eq('Name', name);
      
      if (fetchError) {
        console.error(fetchError.message);
        return;
      }

      if (existingPlaces.length > 0) {
        return;
      }

      const createdAt = formatDate(new Date());
      const timestamp = new Date().getTime(); 
      const { data, error: insertError } = await supabase
        .from('AddItem')
        .insert([{id:timestamp, created_at: createdAt,Place:selectedPlace, Category:selectedCategory,Name: name,Address:address,Phone:phone,Email:email,WebsiteUrl:url,MapUrl:mapURL,Day:day,Timing:Time,OneImg:file[0],TwoImg:file[1]}])
        .select();
      
      if (insertError) {
        console.error(insertError.message);
      } else {
        ToastAndroid.show('Item added!', ToastAndroid.SHORT);
        setAddress('');
        setDay('');
        SetTime('')
        setMapURL('')
        setEmail('')
        setPhone('')
        setSelectedPlace('')
        setSelectedCategory('')
        setFile([])
        setImage64([])
        setImages([])
        setName('')
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
  const validateURL = (url) => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
    return urlRegex.test(url);
  };

  const validateMap = (mapURL) => {
    const mapUrlRegex = /^(https?:\/\/)?(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.apple\.com|mapy\.cz|yandex\.com\/maps|bing\.com\/maps|openstreetmap\.org|maps\.app\.goo\.gl)(\/.*)?$/i;
    return mapUrlRegex.test(mapURL);
  };
  const additem = async () => {
    try {
     
  
      for (let i = 0; i < 2; i++) {
        const fileName = Date.now() + '_' + i + '.png';
        const { data, error } = await supabase.storage
          .from('Images')
          .upload(fileName, decode(image64[i]), {
            contentType: 'image/png'
          });
        if (error) {
          throw error;
        }
        setFile([...file,fileName]);
      }
  
      setImages([]);
    } catch (error) {
      console.error('Error uploading images:', error.message);
    }
  };
  
  
  useEffect(() => {
    async function fetchPlacesAndCategories() {
      try {
        let { data: placesData, error: placesError } = await supabase
          .from('Places')
          .select('*');

        if (placesError) {
          throw placesError;
        }

        const sortedPlaces = placesData.map(place => place.name).sort();
        setPlaces(sortedPlaces);

        let { data: categoriesData, error: categoriesError } = await supabase
          .from('Category')
          .select('*');

        if (categoriesError) {
          throw categoriesError;
        }

        const sortedCategories = categoriesData.map(category => category.Category).sort();
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }

    fetchPlacesAndCategories();
  }, []);

  useEffect(() => {
    setViewWeb(validateURL(url));
  }, [url]);

  useEffect(() => {
    setViewMap(validateMap(mapURL));
  }, [mapURL]);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <Text style={{ color: "gray", fontSize: 20, fontWeight: "bold" }}>Select Place:</Text>
        <Picker
          style={{ height: 40, width: "100%", backgroundColor: 'white' }}
          selectedValue={selectedPlace}
          onValueChange={(itemValue) => setSelectedPlace(itemValue)}
        >
          <Picker.Item label='--Select--' value='--Select--' />
          {places.map((place, index) => (
            <Picker.Item key={index} label={place} value={place} />
          ))}
        </Picker>
      </View>

      <View style={{ display: 'flex', flexDirection: 'column', marginTop: 50, gap: 15 }}>
        <Text style={{ color: "gray", fontSize: 20, fontWeight: "bold" }}>Select Category:</Text>
        <Picker
          style={{ height: 40, width: "100%", backgroundColor: 'white' }}
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label='--Select--' value='--Select--' />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <View>
        <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Name:</Text>
        <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
          <Entypo name="address" size={27} color="gray" />
          <TextInput
            style={{
              width: "89%",
              height: 40,
              paddingLeft: 10,
              fontSize: 18
            }}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />
        </View>
      </View>

      <View>
        <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Address:</Text>
        <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
          <Entypo name="address" size={27} color="gray" />
          <TextInput
            style={{ flex: 1, height: 100, fontSize: 18 }}
            onChangeText={setAddress}
            value={address}
            placeholder="Address"
            multiline={true}
          />
        </View>
      </View>

      <View>
        <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Phone:</Text>
        <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
          <Entypo name="address" size={27} color="gray" />
          <TextInput
            style={{ width: "89%", height: 40, paddingLeft: 10, fontSize: 18 }}
            onChangeText={setPhone}
            value={phone
            }
            placeholder="Phone"
            />
            </View>
            </View>
            <View>
    <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Email:</Text>
    <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
      <Entypo name="address" size={27} color="gray" />
      <TextInput
        style={{ width: "89%", height: 40, paddingLeft: 10, fontSize: 18 }}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
    </View>
  </View>

  <View>
    <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Website URL:</Text>
    <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
      <Entypo name="address" size={27} color="gray" />
      <TextInput
        style={{ width: "89%", height: 40, paddingLeft: 10, fontSize: 18 }}
        onChangeText={setURL}
        value={url}
        placeholder="URL"
      />
    </View>
  </View>

  {viewWeb && (
    <View style={{ borderRadius: 25, marginTop: 20 }}>
      <WebView
        source={{ uri: url }}
        style={{ width: "98%", height: 300 }}
      />
    </View>
  )}

  <View>
    <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Map URL:</Text>
    <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
      <Entypo name="address" size={27} color="gray" />
      <TextInput
        style={{ width: "89%", height: 40, paddingLeft: 10, fontSize: 18 }}
        onChangeText={setMapURL}
        value={mapURL}
        placeholder="Map URL"
      />
    </View>
  </View>

  {viewMap && (
    <View style={{ borderRadius: 25, marginTop: 20 }}>
      <WebView
        source={{ uri: mapURL }}
        style={{ width: "98%", height: 300 }}
      />
    </View>
  )}

  <View>
    <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Working day:</Text>
    <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
      <Entypo name="address" size={27} color="gray" />
      <TextInput
        style={{ width: "89%", height: 40, paddingLeft: 10, fontSize: 18 }}
        onChangeText={setDay}
        value={day}
        placeholder="Working Day"
      />
    </View>
  </View>

  <View style={{ marginBottom: 40 }}>
    <Text style={{ marginTop: 40, color: "gray", fontSize: 20, fontWeight: "bold" }}>Timing:</Text>
    <View style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", gap: 10, borderColor: 'gray', borderWidth: 1, height: 50, borderRadius: 10, padding: 7, backgroundColor: "white" }}>
      <Entypo name="address" size={27} color="gray" />
      <TextInput
        style={{ width: "89%", height: 40, paddingLeft: 10, fontSize: 18 }}
        onChangeText={SetTime}
        value={Time}
        placeholder="Timing"
      />
    </View>
  </View>

  <View style={{ marginBottom: 80 }}>
{images.length<2?(
 <Pressable
 style={{backgroundColor:"midnightblue",width:"80%",marginLeft:"10%",padding:10,borderRadius:10}}
 onPress={()=>{pickImage()}}>
   <Text style={{color:"white",fontWeight:"bold",fontSize:18,textAlign:"center"}}>Add images</Text>
 </Pressable>
)

:(
  <></>
)}
   
  <ScrollView horizontal={true} style={{ marginTop: 20 }}>
    {images.map((imageUri, index) => (
      <Image key={index} source={{ uri: imageUri }} style={{ width: 200, height: 200, marginRight: 10, borderRadius: 25 }} />
    ))}
  </ScrollView>
  <Pressable
    style={{backgroundColor:"midnightblue",width:"80%",marginLeft:"10%",padding:10,borderRadius:10,marginTop:20}}
    onPress={()=>{
      additem()
    }}
  >
      <Text style={{color:"white",fontWeight:"bold",fontSize:18,textAlign:"center"}}>Add item</Text>
    </Pressable>
</View>


</ScrollView>
);
}