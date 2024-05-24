import { ActivityIndicator, Alert, Button, FlatList, Modal, Pressable, ScrollView, Text, TextInput, ToastAndroid, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../util/supabase';

export default function ViewPlace() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedPlaceName, setSelectedPlaceName] = useState('');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateName, setUpdateName] = useState('');

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const { data, error } = await supabase.from('Places').select('name');

        if (error) {
          console.error(error.message);
        } else {
          setPlaces(data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaces();
  }, []);

  const handleDelete = async (name) => {
    try {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to delete ${name}?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                // Fetch the corresponding rows in AddItem
                const { data: addItemData, error: fetchAddItemError } = await supabase.from('AddItem').select('Name').eq('Place', name);
                if (fetchAddItemError) {
                  throw fetchAddItemError;
                }

                // Delete from Payment table
                const paymentDeletePromises = addItemData.map(async (item) => {
                  const { error: deletePaymentError } = await supabase.from('Payment').delete().eq('Name', item.Name);
                  if (deletePaymentError) {
                    throw deletePaymentError;
                  }
                });

                await Promise.all(paymentDeletePromises);

                // Delete from AddItem table
                const { error: deleteAddItemError } = await supabase.from('AddItem').delete().eq('Place', name);
                if (deleteAddItemError) {
                  throw deleteAddItemError;
                }

                // Delete from Places table
                const { error: deletePlaceError } = await supabase.from('Places').delete().eq('name', name);
                if (deletePlaceError) {
                  throw deletePlaceError;
                }

                setPlaces(places.filter(place => place.name !== name));
                ToastAndroid.show('Place Deleted!', ToastAndroid.SHORT);
              } catch (error) {
                console.error(error.message);
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
      `Are you sure you want to update ${selectedPlaceName} to ${updateName}?`,
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
      const { error: updatePlaceError } = await supabase.from('Places').update({ name: updateName }).eq('name', selectedPlaceName);
      const { error: updateAddItemError } = await supabase.from('AddItem').update({ Place: updateName }).eq('Place', selectedPlaceName);

      if (updatePlaceError || updateAddItemError) {
        console.error(updatePlaceError?.message || updateAddItemError?.message);
      } else {
        setPlaces(places.map(place => {
          if (place.name === selectedPlaceName) {
            return { ...place, name: updateName };
          }
          return place;
        }));
        setUpdateModalVisible(false);
        ToastAndroid.show('Place Updated!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20, fontWeight: "bold" }}>LIST OF PLACES</Text>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 40 }}>
        <TextInput
          placeholder='Search'
          style={{ borderWidth: 1, width: "80%", padding: 10, borderRadius: 7, fontSize: 18, paddingLeft: 15 }}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40, backgroundColor: "#2222ff", gap: 80 }}>
        <Text style={{ paddingLeft: 30, fontSize: 20, color: "white", fontWeight: "bold" }}>SNO</Text>
        <Text style={{ fontSize: 20, color: "white", fontWeight: "bold"}}>NAME</Text>
        <Text style={{ paddingRight: 30, fontSize: 20, color: "white", fontWeight: "bold" }}>ACTION</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {filteredPlaces.length > 0 ? (
            <FlatList
              data={filteredPlaces.sort((a, b) => a.name.localeCompare(b.name))}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{
                  borderBottomWidth: 1,
                  display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#DDDDDD', height: 50
                }}>
                  <Text style={{ paddingLeft: 40, fontSize: 18 }}>{index + 1}</Text>
                  <Text style={{ fontSize: 18, marginLeft: 25 }}>{item.name}</Text>
                  <View style={{ flexDirection: "row", marginRight: 10, gap: 20 }}>
                    <Pressable onPress={() => handleDelete(item.name)} style={{ backgroundColor: "red", padding: 5, borderRadius: 5 }}>
                      <AntDesign name="delete" size={24} color="white" />
                    </Pressable>
                    <Pressable
                      style={{ backgroundColor: "blue", padding: 5, borderRadius: 5 }}
                      onPress={() => {
                        setSelectedPlaceName(item.name);
                        setUpdateName(item.name);
                        setUpdateModalVisible(true);
                      }}>
                      <AntDesign name="edit" size={24} color="white" />
                    </Pressable>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text
              style={{ textAlign: "center", fontSize: 20, marginTop: 200 }}
            >
              No Results Found
            </Text>
          )}
        </ScrollView>
      )}
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
              placeholder="Enter new name"
              value={updateName}
              onChangeText={setUpdateName}
              style={{ borderWidth: 1, borderColor: "gray", padding: 10, borderRadius: 5, marginBottom: 20 }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
              <Button title="Update" onPress={handleUpdateConfirmation} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
