import { View, Text, ScrollView, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { UseAuth } from '../../Context/UseAuth';
import { supabase } from '../../util/supabase';

export default function EditItem() {
  const { editName } = UseAuth();
  const [data, setData] = useState([]);
  const [editingFields, setEditingFields] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let { data: AddItem, error } = await supabase
      .from('AddItem')
      .select("*")
      .eq('Name', editName);
    if (error) {
      Alert.alert('Error', 'Failed to load data.');
    } else {
      setData(AddItem);
    }
  };

  const handleEdit = (item, field) => {
    setEditingFields((prev) => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        [field]: item[field],
      },
    }));
  };

  const handleChange = (item, field, value) => {
    setEditingFields((prev) => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (item) => {
    const updates = editingFields[item.id];
  
    try {
      // Update the AddItem table
      const { data: updatedData, error: updateError } = await supabase
        .from('AddItem')
        .update(updates)
        .eq('id', item.id)
        .select();
  
      if (updateError) {
        throw updateError;
      }
  
      // Check if the name field is being updated
      if (updates.Name && updates.Name !== item.Name) {
        // Update the Payment table
        const { error: paymentError } = await supabase
          .from('Payment')
          .update({ Name: updates.Name })
          .eq('Name', item.Name);
  
        if (paymentError) {
          throw paymentError;
        }
  
        // Update the Adv table
        const { error: advError } = await supabase
          .from('Adv')
          .update({ Name: updates.Name })
          .eq('Name', item.Name);
  
        if (advError) {
          throw advError;
        }
      }
  
      Alert.alert('Success', 'Updated successfully');
  
      setEditingFields((prev) => {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      });
  
      setData((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ...updates } : i))
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update the item.');
      console.error('Error updating item:', error);
    }
  };
  

  const fieldsToExclude = ['OneImg', 'Place', 'Category', 'TwoImg', 'created_at']; 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
  
      {data.length > 0 ? (
        data.map((item, index) => (
          <View key={index} style={[styles.itemContainer, { marginBottom: 40 }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 15 }}>
              <View style={{ backgroundColor: "midnightblue", flexDirection: "row", padding: 5, borderRadius: 5 }}>
                <Text style={{ fontSize: 19, fontWeight: "bold", color: "white" }}></Text>
                <Text style={{ fontSize: 19, fontWeight: "bold", color: "white" }}>{item.Category}</Text>
              </View>
              <View style={{ backgroundColor: "midnightblue", flexDirection: "row", padding: 5, borderRadius: 5 }}>
                <Text style={{ fontSize: 19, fontWeight: "bold", color: "white" }}></Text>
                <Text style={{ fontSize: 19, fontWeight: "bold", color: "white" }}>{item.Place}</Text>
              </View>
            </View>
            
            {Object.keys(item).map((key) => (
              !fieldsToExclude.includes(key) && key !== 'id' && key !== 'Category' && key !== 'Place' && (
                <View key={key} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{key}:</Text>
                  <View style={styles.row}>
                    {editingFields[item.id] && editingFields[item.id][key] !== undefined ? (
                      <TextInput
                        style={[styles.input, styles.flex1]}
                        value={editingFields[item.id][key]}
                        onChangeText={(value) => handleChange(item, key, value)}
                      />
                    ) : (
                      <TouchableOpacity onPress={() => handleEdit(item, key)}>
                        <Text style={[styles.fieldValue, styles.flex1]}>{item[key]}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            ))}
            {editingFields[item.id] && (
              <Button title="Save" onPress={() => handleSave(item)} />
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </ScrollView>
  );
      
  
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingBottom:100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 18,
    paddingBottom: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
});
