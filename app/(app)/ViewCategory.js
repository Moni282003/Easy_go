import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, TextInput, ScrollView, ActivityIndicator, Modal, Button, Alert, ToastAndroid } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../util/supabase';

export default function ViewCategory() {
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateCategory, setUpdateCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: categoryData, error: categoryError } = await supabase.from('Category').select('Category');

        if (categoryError) {
          console.error(categoryError.message);
          return;
        }

        const categoriesWithCount = [];

        // Iterate through each category
        for (const category of categoryData) {
          // Fetch count of occurrences from AddItem table
          const { data: addItemData, error: addItemError } = await supabase.from('AddItem').select('*', { count: 'exact' }).eq('Category', category.Category);
          
          if (addItemError) {
            console.error(addItemError.message);
            return;
          }

          // Push category with count to array
          categoriesWithCount.push({ ...category, count: addItemData.length });
        }

        setCategories(categoriesWithCount || []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleDelete = async (categoryName) => {
    try {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to delete ${categoryName}?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              // Your deletion logic
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateConfirmation = () => {
    // Your update confirmation logic
  };

  const handleUpdate = async () => {
    // Your update logic
  };

  const filteredCategories = categories.filter(category =>
    category.Category.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedCategories = filteredCategories.sort((a, b) => a.Category.localeCompare(b.Category));

  return (
    <ScrollView>
      <View style={{ paddingBottom: 40 }}>
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20, fontWeight: "bold", backgroundColor: "midnightblue", padding: 8, width: "70%", marginLeft: "15%", borderRadius: 15, color: "white" }}>LIST OF CATEGORIES</Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40 }}>
          <TextInput
            placeholder='Search'
            style={{ borderWidth: 1, width: "80%", padding: 10, borderRadius: 7, fontSize: 18, paddingLeft: 15 }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={{
          display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40, backgroundColor: "midnightblue", gap: 100, height: 50, borderTopRightRadius: 30, borderTopLeftRadius: 30, marginLeft: "3%", width: "94%",
          borderWidth: 1, borderColor: "midnightblue"
        }}>
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold", marginLeft: 20 }}>NAME</Text>
          <Text style={{ paddingRight: 10, fontSize: 20, color: "white", fontWeight: "bold" }}>ACTION</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : sortedCategories.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={sortedCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{
                  borderBottomWidth: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#DDDDDD', height: 50, width: "94%", marginLeft: "3%"
                  , borderWidth: 1,
                  borderBottomLeftRadius: index === sortedCategories.length - 1 ? 20 : 0,
                  borderBottomRightRadius: index === sortedCategories.length - 1 ? 20 : 0,
                }}>
                  <Text style={{ fontSize: 18, marginLeft: 55 }}>{item.Category}({item.count})</Text>
                  <View style={{ display: "flex", flexDirection: "row", gap: 20, marginRight: 40 }}>
                    <Pressable onPress={() => handleDelete(item.Category)} style={{ backgroundColor: "red", padding: 5, borderRadius: 5 }}
                    >
                      <AntDesign name="delete" size={24} color="white" />
                    </Pressable>
                    <Pressable
                      style={{ backgroundColor: "blue", padding: 5, borderRadius: 5 }}
                      onPress={() => {
                        setSelectedCategory(item.Category);
                        setUpdateCategory(item.Category);
                        setUpdateModalVisible(true);
                      }}>
                      <AntDesign name="edit" size={24} color="white" />
                    </Pressable>
                  </View>
                </View>
              )}
              nestedScrollEnabled={true}
            />
          </View>
        ) : (
          <Text
            style={{ textAlign: "center", fontSize: 20, marginTop: 200 }}
          >
            No Results Found
          </Text>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={updateModalVisible}
        onRequestClose={() => {
          setUpdateModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <TextInput
              placeholder="Enter new category"
              value={updateCategory}
              onChangeText={setUpdateCategory}
              style={{ borderWidth: 1,borderColor: "gray", padding: 10, borderRadius: 5, marginBottom: 20 }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
                <Button title="Update" onPress={handleUpdateConfirmation} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
  
