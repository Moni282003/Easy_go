import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../util/supabase';

export default function Advertisement() {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        const { data, error } = await supabase
          .from('AddItem')
          .select('Place, Category');

        if (error) {
          throw error;
        }

        const uniquePlaces = [...new Set(data.map(item => item.Place))];
        const uniqueCategories = [...new Set(data.map(item => item.Category))];

        setPlaces(uniquePlaces);
        setCategories(uniqueCategories);
      } catch (error) {
        Alert.alert("Error fetching values", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueValues();
  }, []);

  const handleFilter = async () => {
    if (!selectedPlace || !selectedCategory) {
      Alert.alert("Error", "Please select both Place and Category!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('AddItem')
        .select('Name')
        .eq('Place', selectedPlace)
        .eq('Category', selectedCategory);

      if (error) {
        throw error;
      }

      setFilteredItems(data);
    } catch (error) {
      Alert.alert("Error fetching items", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Advertisement
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Add'
          style={styles.input}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPlace}
          onValueChange={(itemValue, itemIndex) => setSelectedPlace(itemValue)}
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
          onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Select a category..." value="" />
          {categories.map(category => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleFilter} />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.Name}</Text>
            </View>
          )}
        />
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
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  itemText: {
    fontSize: 18,
  },
});
