import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Modal, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../util/supabase';
import { UseAuth } from '../../Context/UseAuth';
import { Picker } from '@react-native-picker/picker';

export default function AddPlan() {
    const [names, setNames] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [placeFilter, setPlaceFilter] = useState('');
    const [filteredNames, setFilteredNames] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [textInputValue, setTextInputValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedItem, setSelectedItem] = useState(null); 
    const { setEditName } = UseAuth();

    const navigation = useNavigation();

    const display = async () => {
        try {
            let { data: AddItem, error } = await supabase
                .from('AddItem')
                .select('Name, Category, Place');

            if (error) {
                console.error(error.message);
            } else {
                const { data: existingItems } = await supabase
                    .from('Payment')
                    .select('Name');
                
                const existingNames = existingItems.map(item => item.Name);

                const filteredAddItem = AddItem.filter(item => !existingNames.includes(item.Name));

                setNames(filteredAddItem);
                setFilteredNames(filteredAddItem);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        display();
    }, []);

    useEffect(() => {
        setFilteredNames(
            names.filter(item =>
                item.Name.toLowerCase().includes(search.toLowerCase()) &&
                (categoryFilter ? item.Category.toLowerCase().includes(categoryFilter.toLowerCase()) : true) &&
                (placeFilter ? item.Place.toLowerCase().includes(placeFilter.toLowerCase()) : true)
            )
        );
    }, [search, categoryFilter, placeFilter, names]);

    const handleAdd = (item) => { 
        setEditName(item.Name);
        setSelectedItem(item); 
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        if (!selectedItem) return;

        const currentDate = new Date();

        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

        const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${(nextMonthDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${nextMonthDate.getDate().toString().padStart(2, '0')}`;

        if (selectedCategory === 'Priority') {
            const timestamp = new Date().getTime();
            const { data, error } = await supabase
                .from('Payment')
                .insert([
                    {
                        id: timestamp, Name: selectedItem.Name, Plan: selectedCategory,
                        Des: textInputValue
                    },
                ])
                .select();
            if (error) {
                console.error(error.message);
            } else {
                Alert.alert('Item added successfully!');
            }
        } else {
            const timestamp = new Date().getTime();
            const { data, error } = await supabase
                .from('Payment')
                .insert([
                    {
                        id: timestamp, Name: selectedItem.Name, Plan: selectedCategory,
                        Des: textInputValue, Start: null, End: null
                    },
                ])
                .select();
            if (error) {
                console.error(error.message);
            } else {
                Alert.alert('Item added successfully!');
            }
        }

        setModalVisible(false);
        display();

    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 20, paddingHorizontal: 0 }}>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, marginHorizontal: 20 }}
                    placeholder="Search by name"
                    value={search}
                    onChangeText={setSearch}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <TextInput
                        style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 10, paddingHorizontal: 10 }}
                        placeholder="Filter by category"
                        value={categoryFilter}
                        onChangeText={setCategoryFilter}
                    />
                    <TextInput
                        style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
                        placeholder="Filter by place"
                        value={placeFilter}
                        onChangeText={setPlaceFilter}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'midnightblue', padding: 15, paddingHorizontal: 25,borderTopLeftRadius:25,borderTopRightRadius:25,width:"94%",marginLeft:"3%",marginTop:20 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19,marginLeft:20 }}>NAME</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19 }}>ACTION</Text>
                </View>
                {filteredNames.length > 0 ? (
                    filteredNames.map((item, index) => (
                        <View key={index} style={{ backgroundColor: index % 2 === 0 ? '#bcbcbc' : 'white', padding: 5,width:"94%",marginLeft:"3%",paddingBottom:20 }}>
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 30 }}>
                                <Text style={{ width: '50%', textAlign: 'left', fontSize: 17, fontWeight: 'bold' ,marginLeft:10}}>{item.Name}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                                    <Pressable onPress={() => handleAdd(item)} style={{ padding: 5, backgroundColor: 'blue', marginRight: 10, borderRadius: 7 }}>
                                        <Ionicons name="add" size={24} color="white"                                    />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row",justifyContent: "space-evenly", marginTop: 5 }}>
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 17 }}>Category: {item.Category}</Text>
                                </View>
                                <Text style={{ textAlign: 'center', fontSize: 17 }}>Place: {item.Place}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 20, fontWeight: 'bold' }}>No Items found</Text>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', height: 300 }}>
                        <TextInput
                            placeholder="Enter Description"
                            style={{ height: 120, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
                            value={textInputValue}
                            onChangeText={setTextInputValue}
                        />
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                            style={{ height: 50, width: '100%' }}
                        >
                            <Picker.Item label="--Select--" value="Select" />
                            <Picker.Item label="Normal" value="Normal" />
                            <Picker.Item label="Priority (Rs:200)" value="Priority" />
                        </Picker>
                        <Button title="Submit" onPress={handleSubmit} />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

