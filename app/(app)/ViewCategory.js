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
        const { data, error } = await supabase.from('Category').select('Category');

        if (error) {
          console.error(error.message);
        } else {
          setCategories(data);
        }
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
              const { data: addItemData, error: addItemError } = await supabase.from('AddItem').select('Name').eq('Category', categoryName);
              if (addItemError) {
                console.error(addItemError.message);
                return;
              }
              
              const deleteAddItemPromises = addItemData.map(async item => {
                const { error } = await supabase.from('AddItem').delete().eq('Name', item.Name);
                if (error) {
                  console.error(error.message);
                }
              });
  
              await Promise.all(deleteAddItemPromises);
  
              const { data: paymentData, error: paymentError } = await supabase.from('Payment').select('Name').in('Name', addItemData.map(item => item.Name));
              if (paymentError) {
                console.error(paymentError.message);
                return;
              }
  
              const deletePaymentPromises = paymentData.map(async payment => {
                const { error } = await supabase.from('Payment').delete().eq('Name', payment.Name);
                if (error) {
                  console.error(error.message);
                }
              });
  
              await Promise.all(deletePaymentPromises);
  
              const { error: categoryError } = await supabase.from('Category').delete().eq('Category', categoryName);
              if (categoryError) {
                console.error(categoryError.message);
              } else {
                setCategories(categories.filter(category => category.Category !== categoryName));
                ToastAndroid.show('Category Deleted!', ToastAndroid.SHORT);
              }
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
    Alert.alert(
      'Confirmation',
      `Are you sure you want to update ${selectedCategory} to ${updateCategory}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handleUpdate,
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = async () => {
    try {
      const { error: categoryError } = await supabase
        .from('Category')
        .update({ Category: updateCategory })
        .eq('Category', selectedCategory);
      
      if (categoryError) {
        console.error(categoryError.message);
      } else {
        const { error: addItemError } = await supabase
          .from('AddItem')
          .update({ Category: updateCategory })
          .eq('Category', selectedCategory);
        
        if (addItemError) {
          console.error(addItemError.message);
        } else {
          setCategories(categories.map(category => {
            if (category.Category === selectedCategory) {
              return { ...category, Category: updateCategory };
            }
            return category;
          }));
          
          setUpdateModalVisible(false);
          ToastAndroid.show('Category Updated!', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const filteredCategories = categories.filter(category =>
    category.Category.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedCategories = filteredCategories.sort((a, b) => a.Category.localeCompare(b.Category));

  return (
    <ScrollView>
      <View>
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20, fontWeight: "bold" }}>LIST OF CATEGORIES</Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40 }}>
          <TextInput
            placeholder='Search'
            style={{ borderWidth: 1, width: "80%", padding: 10, borderRadius: 7, fontSize: 18, paddingLeft: 15 }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40, backgroundColor:"#2222ff", gap:80 }}>
          <Text style={{ paddingLeft: 30, fontSize:20, color:"white", fontWeight:"bold" }}>SNO</Text>
          <Text style={{ fontSize:20, color:"white", fontWeight:"bold"}}>NAME</Text>
          <Text style={{ paddingRight: 30, fontSize:20, color:"white", fontWeight:"bold" }}>ACTION</Text>
        </View>

        {isLoading ? ( 
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : sortedCategories.length > 0 ? (
          <View style={{ flex: 1 }}> 
            <FlatList
              data={sortedCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{ borderBottomWidth:1,display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#DDDDDD', height:50 }}>
                  <Text style={{ paddingLeft: 40, fontSize:18 }}>{index + 1}</Text>
                  <Text style={{ fontSize:18,marginLeft:31 }}>{item.Category}</Text>
                  <View style={{display:"flex",flexDirection:"row",gap:20,marginRight:20}}>
                  <Pressable onPress={() => handleDelete(item.Category)} style={{backgroundColor:"red",padding:5,borderRadius:5}}
                  >
                    <AntDesign name="delete" size={24} color="white" />
                  </Pressable>
                  <Pressable
                  style={{backgroundColor:"blue",padding:5,borderRadius:5}}
                  onPress={() => {
                    setSelectedCategory(item.Category);
                    setUpdateCategory(item.Category); +
                    setUpdateModalVisible(true);
                  }}>
                    <AntDesign name="edit" size={24} color="white" />
                  </Pressable></View>
                </View>
              )}
              nestedScrollEnabled={true}
            />
          </View>
        ) : (
          <Text
            style={{textAlign:"center",fontSize:20,marginTop:200}}
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
              style={{ borderWidth: 1, borderColor: "gray", padding: 10, borderRadius: 5, marginBottom: 20 }}
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
