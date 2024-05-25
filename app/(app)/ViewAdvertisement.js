import { View, Text, StyleSheet, Image, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../util/supabase';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ViewAdvertisement() {
  const [details, setDetails] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      let { data: Adv, error } = await supabase
        .from('Adv')
        .select('*');
      
      if (error) {
        console.error('Error fetching details:', error);
      } else {
        setDetails(Adv);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      let { error } = await supabase
        .from('Adv')
        .delete()
        .eq('id', id);

      if (error) {
        Alert.alert('Error', 'Failed to delete the advertisement.');
      } else {
        setDetails(details.filter(item => item.id !== id));
        Alert.alert('Success', 'Advertisement deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const handleEdit = (id, description) => {
    setEditingId(id);
    setNewDescription(description);
  };

  const handleSaveEdit = async (id) => {
    try {
      let { error } = await supabase
        .from('Adv')
        .update({ Des: newDescription })
        .eq('id', id);

      if (error) {
        Alert.alert('Error', 'Failed to update the description.');
      } else {
        setDetails(details.map(item => item.id === id ? { ...item, Des: newDescription } : item));
        setEditingId(null);
        setNewDescription('');
        Alert.alert('Success', 'Description updated successfully.');
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const filteredDetails = details.filter(item => item.Name.toLowerCase().includes(searchName.toLowerCase()));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        View Advertisement
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={searchName}
        onChangeText={setSearchName}
      />

      {filteredDetails.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.itemText}>{item.Name}</Text>
            <Text style={styles.itemText}>{item.Place}</Text>
            <View style={{flexDirection: "row", gap: 10}}>
              <Pressable onPress={() => handleEdit(item.id, item.Des)} style={{backgroundColor:"blue",padding:5,borderRadius:5}}><Text><AntDesign name="edit" size={24} color="white" /></Text></Pressable>
              <Pressable onPress={() => handleDelete(item.id)}style={{backgroundColor:"red",padding:5,borderRadius:5}}><Text><AntDesign name="delete" size={24} color="white" /></Text></Pressable>
            </View>
          </View>
          <Text style={styles.itemText}>{item.Date}</Text>
          {editingId === item.id ? (
            <TextInput
              style={styles.input}  
              value={newDescription}
              onChangeText={setNewDescription}
            />
          ) : (
            <Text style={styles.description}>{item.Des}</Text>
          )}
          <Image
            source={{ uri: `https://xvtjrpfucskcxobehmvy.supabase.co/storage/v1/object/public/Images/${item.Image}` }}
            style={styles.image}
          />
          {editingId === item.id && (
            <Pressable onPress={() => handleSaveEdit(item.id)} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
    },
    itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    },
    itemText: {
    fontSize: 20,
    color: '#333',
    borderRadius: 10,
    padding: 5,
    fontWeight: "bold"
    },
    description: {
    textAlign: 'justify',
    marginTop: 10,
    fontSize: 16,
    },
    input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    padding: 5,
    marginTop: 10,
    },
    image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    },
    saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    },
    saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    },
    searchInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    },
    });
