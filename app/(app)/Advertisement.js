import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, Pressable, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../util/supabase';
import * as ImagePicker from 'expo-image-picker'; 
import { decode } from 'base64-arraybuffer';

export default function Advertisement() {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [image64, setImage64] = useState([]);
  const [file, setFile] = useState('');

  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        const { data: placeData, error: placeError } = await supabase
          .from('AddItem')
          .select('Place');

        if (placeError) {
          throw placeError;
        }

        const uniquePlaces = [...new Set(placeData.map(item => item.Place))];
        setPlaces(uniquePlaces);
      } catch (error) {
        Alert.alert("Error fetching places", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueValues();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64:true
      });
  
      if (!result.canceled) {
        setImages([result.assets[0].uri]);
        setImage64([result.assets[0].base64]);
         console.log(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  const uploadImage = async () => {
    try {
      const { data: existingData, error: existingError } = await supabase
        .from('Adv')
        .select('Name')
        .eq('Name', selectedItem);
  
      if (existingError) {
        throw existingError;
      }
  
      if (existingData.length > 0) {
        Alert.alert('Duplicate Entry', 'An advertisement with this name already exists.');
        return; 
      }
  
      const fileName = Date.now() + '.png';
      const { data, error } = await supabase.storage
        .from('Images')
        .upload(fileName, decode(image64[0]), {
          contentType: 'image/png'
        });
  
      if (error) {
        throw error;
      }
  
      console.log("Image uploaded successfully:", fileName);
      setFile(fileName);
      setImages([]);
      setImage64([]);
  
      const { data: insertedData, error: insertError } = await supabase
        .from('Adv')
        .insert([
          { id: Date.now(), Name: selectedItem, Amount: "2000", Image: fileName, Des: description, Place: selectedPlace ,Date:null}
        ]);
  
      if (insertError) {
        throw insertError;
      }
  
      console.log("Data inserted successfully:", insertedData);
      setSelectedPlace('');
      setSelectedCategory('');
      setSelectedItem('');
      setDescription('');
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };
  
  
  

  const fetchCategories = async (place) => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('AddItem')
        .select('Category')
        .eq('Place', place);

      if (categoryError) {
        throw categoryError;
      }

      const uniqueCategories = [...new Set(categoryData.map(item => item.Category))];
      setCategories(uniqueCategories);
    } catch (error) {
      Alert.alert("Error fetching categories", error.message);
    }
  };
  
  const fetchItems = async (place, category) => {
    try {
      const { data: itemData, error: itemError } = await supabase
        .from('AddItem')
        .select('Name')
        .eq('Place', place)
        .eq('Category', category);

      if (itemError) {
        throw itemError;
      }

      setItems(itemData.map(item => item.Name));
    } catch (error) {
      Alert.alert("Error fetching items", error.message);
    }
  };

  const handlePlaceChange = (place) => {
    setSelectedPlace(place);
    setSelectedCategory('');
    setCategories([]);
    setItems([]);
    if (place) {
      fetchCategories(place);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setItems([]);
    if (selectedPlace && category) {
      fetchItems(selectedPlace, category);
    }
  };

  const handleItemChange = (item) => {
    setSelectedItem(item);
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advertisement</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPlace}
          onValueChange={handlePlaceChange}
        >
          <Picker.Item label="Select a place..." value="" />
          {places.map(place => (
            <Picker.Item key={place} label={place} value={place} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
          enabled={!!selectedPlace}
        >
          <Picker.Item label="Select a category..." value="" />
          {categories.map(category => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedItem}
          onValueChange={handleItemChange}
          enabled={!!selectedCategory}
        >
          <Picker.Item label="Select an item..." value="" />
          {items.map(item => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
      <View style={styles.textareaContainer}>
        <TextInput
          style={styles.textarea}
          multiline={true}
          placeholder="Enter description..."
          onChangeText={handleDescriptionChange}
          value={description}
        />
      </View>
      <Pressable onPress={pickImage} style={styles.addImageButton}>
        <Text style={styles.addImageText}>Upload image</Text>
      </Pressable>
      <Pressable onPress={uploadImage} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Add</Text>
      </Pressable>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius:    5,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 10
  },
  textareaContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
    padding: 5, 
  },
  textarea: {
    height: 150,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 18
  },
  addImageButton: {
    backgroundColor: "midnightblue",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  addImageText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  uploadButton: {
    backgroundColor: "darkgreen",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  }
});
