import { View, Text, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../util/supabase';
import Entypo from '@expo/vector-icons/Entypo';
import { WebView } from 'react-native-webview';


export default function Items() {

  const validateMap=()=>{
    const mapUrlRegex = /^(https?:\/\/)?(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.apple\.com|mapy\.cz|yandex\.com\/maps|bing\.com\/maps|openstreetmap\.org)(\/.*)?$/i;
    const isValidMapURL = mapUrlRegex.test(yourMapURL);
    setViewMap(isValidMapURL);
    
  }
  const [viewMap,setViewMap]=useState(false)

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
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

  return (
    <ScrollView style={{ flex: 1, padding: 20}}>
      <View style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <Text style={{ color: "gray", fontSize: 20, fontWeight: "bold" }}>Select Place:</Text>
        <Picker
          style={{ height: 40, width: "100%", backgroundColor: 'white' }}
          selectedValue={selectedPlace}
          onValueChange={(itemValue, itemIndex) => setSelectedPlace(itemValue)}
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
          onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label='--Select--' value='--Select--' />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

<View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>Name:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />
<TextInput
        style={{
          width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setName}
        value={name}
        placeholder="Name"
      />
</View>
</View>

<View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>Address:</Text>
  <View style={{display:"flex", flexDirection:"row", width:"100%", alignItems:"center", gap:10, borderColor: 'gray', borderWidth: 1, borderRadius:10, padding:7, backgroundColor:"white"}}>
    <Entypo name="address" size={27} color="gray" />
    <TextInput
      style={{ flex: 1, height: 100, fontSize: 18 }}
      onChangeText={setAddress}
      value={address}
      placeholder="Address"
      multiline={true}
    />
  </View>
</View><View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>Phone:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />
<TextInput
        style={{width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setPhone}
        value={phone}
        placeholder="Phone"
      />
</View>
</View><View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>Email:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />
<TextInput
        style={{width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
</View>
</View><View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>Website URL:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />
<TextInput
        style={{width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setURL}
        value={url}
        placeholder="URL"
      />
</View>
</View>
{ url &&(
<View
style={{borderRadius:25,marginTop:20}}
><WebView
        source={{ uri:url }}
        style={{width:"98%",height:300}}
      /></View>)
}
<View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>Map URL:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />
<TextInput
        style={{width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setMapURL}
        onTextInput={()=>validateMap()}
        value={mapURL}
        placeholder="Map URL"
      />
</View>
</View>

{mapURL && (<View
style={{borderRadius:25,marginTop:20}}
><WebView
        source={{ uri:mapURL }}
        style={{width:"98%",height:300}}
      /></View>)}

<View>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold"}}>StartTime:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />
<TextInput
        style={{width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setStartTime}
        value={startTime}
        placeholder="Start Time"
      />
</View>
</View><View style={{marginBottom:80}}>
  <Text style={{marginTop:40,color: "gray", fontSize: 20, fontWeight: "bold",}}>EndTime:</Text>
<View style={{display:"flex",flexDirection:"row",width:"100%",alignItems:"center",gap:10,borderColor: 'gray',
    borderWidth: 1,height:50,borderRadius:10,padding:7,backgroundColor:"white"}}>
<Entypo name="address" size={27} color="gray" />

      <TextInput
        style={{width:"89%",
          height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop:20,
  fontSize:18}}
        onChangeText={setEndTime}
        value={endTime}
        placeholder="End Time"
      />
</View>
</View>
    </ScrollView>
  );
}


