import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Modal, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../util/supabase';
import { UseAuth } from '../../Context/UseAuth';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EditPlan() {
    const [names, setNames] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [placeFilter, setPlaceFilter] = useState('');
    const [filteredNames, setFilteredNames] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [textInputValue, setTextInputValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [pickerValue, setPickerValue] = useState(''); 
    const { setEditName } = UseAuth();
    const [info, setInfo] = useState([]);

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

                const filteredAddItem = AddItem.filter(item => existingNames.includes(item.Name));
                const { data: mainItem, error: mainItemError } = await supabase
                    .from('Payment')
                    .select('Name, Plan, Des, End'); 

                if (mainItemError) {
                    console.error(mainItemError.message);
                } else {
                    setNames(filteredAddItem);
                    setFilteredNames(filteredAddItem);
                    setInfo(mainItem);
                }
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
                (placeFilter ? item.Place.toLowerCase().includes(placeFilter.toLowerCase()) : true) &&
                (pickerValue ? info.some(infoItem => infoItem.Name === item.Name && infoItem.Plan === pickerValue) : true)
            )
        );
    }, [search, categoryFilter, placeFilter, pickerValue, names, info]);

    const handleAdd = (item) => {
        setEditName(item.Name);
        setSelectedItem(item);
        const selectedItemInfo = info.find(infoItem => infoItem.Name === item.Name);
        if (selectedItemInfo) {
            setTextInputValue(selectedItemInfo.Des);
            setSelectedCategory(selectedItemInfo.Plan);
        }
        setModalVisible(true);
    };

    const handleDelete = async (item) => {
        try {
            const { error } = await supabase
                .from('Payment')
                .delete()
                .eq('Name', item.Name);

            if (error) {
                console.error(error.message);
            } else {
                Alert.alert('Item deleted successfully!');
                display();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSubmit = async () => {
        if (!selectedItem) return;

        const currentDate = new Date();
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

        const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${(nextMonthDate.getMonth() + 1).toString().padStart(2, '0')}-${nextMonthDate.getDate().toString().padStart(2, '0')}`;

        try {
            const updateData = {
                Plan: selectedCategory,
                Des: textInputValue,
                Start: selectedCategory === 'Priority' ? null : null,
                End: selectedCategory === 'Priority' ? null : null,
            };

            const { error } = await supabase
                .from('Payment')
                .update(updateData)
                .eq('Name', selectedItem.Name);

            if (error) {
                console.error(error.message);
            } else {
                Alert.alert('Item updated successfully!');
                display();
            }
        } catch (error) {
            console.error(error.message);
        }

        setTextInputValue('');
        setSelectedCategory('Select');
        setModalVisible(false);
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
                <Picker
                    selectedValue={pickerValue}
                    onValueChange={(itemValue) => setPickerValue(itemValue)}
                    style={{ height: 50, width: '100%' }}
                >
                    <Picker.Item label="--Select Plan--" value="" />
                    <Picker.Item label="Normal" value="Normal" />
                    <Picker.Item label="Priority" value="Priority" />
                </Picker>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'midnightblue', padding: 15, paddingHorizontal: 25, marginBottom: 10
                ,width:"96%",borderTopLeftRadius:25,borderTopRightRadius:25,marginLeft:"2%"
                 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19,marginLeft:10 }}>NAME</Text>
                    <Text style={{ color: 'white', fontWeight:'bold', fontSize: 19 }}>ACTION</Text>
                </View>
                {filteredNames.length > 0 ? (
                    filteredNames.map((item, index) => (
                        <View key={index} style={{ backgroundColor: index % 2 === 0 ? '#bcbcbc' : 'white', padding: 0, borderRadius: 0,width:"96%",marginLeft:"2%",paddingBottom:20,borderBottomLeftRadius:filteredNames.length==index+1?20:0,borderBottomRightRadius:filteredNames.length==index+1?20:0
                    }}>
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 30 }}>
                                <Text style={{ width: '50%', textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>{item.Name}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                                    <Pressable onPress={() => handleAdd(item)} style={{ padding: 5, backgroundColor: 'blue', marginRight: 10, borderRadius: 7 }}>
                                        <AntDesign name="edit" size={24} color="white" />
                                    </Pressable>
                                    <Pressable onPress={() => handleDelete(item)} style={{ padding: 5, backgroundColor: 'red', marginRight: 10, borderRadius: 7 }}>
                                        <MaterialIcons name="disabled-by-default" size={24} color="white" />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={{ flexDirection: "column", justifyContent: "space-evenly", marginTop: 5 }}>
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 17, color: "green" }}>Category: {item.Category}</Text>
                                </View>
                                <Text style={{ textAlign: 'center', fontSize: 17, color: "green" }}>Place: {item.Place}</Text>
                            </View>
                            {info
                                .filter(plan => plan.Name === item.Name)
                                .map((plan, idx) => (
                                    <View key={idx} style={{ flexDirection: "column", marginTop: 5, alignItems: "flex-start", paddingHorizontal: 10 }}>
                                        <View>
                                            <View style={{ flexDirection: "row", marginTop: 5, gap: 90,paddingRight:10 }}>
                                                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: "bold", color: "tomato" }}>Plan: {plan.Plan}</Text>
                                                {plan.Plan === "Normal" ? (
                                                    <Text></Text>
                                                ) : (
                                                    plan.End !== "null" ? (
                                                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: "bold", color: "tomato" }}>
                                                            Expire: {plan.End}
                                                        </Text>
                                                    ) : (
                                                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: "bold", color: "tomato" }}>
                                                            Expire: Not Paid
                                                        </Text>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                        <Text style={{ textAlign: 'justify', fontSize: 17, color: "midnightblue" }}>Description: {plan.Des}</Text>
                                    </View>
                                ))}
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
                            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                            style={{ height: 50, width: '100%' }}
                        >
                            <Picker.Item label="--Select--" value="Select" />
                            <Picker.Item label="Normal" value="Normal" />
                            <Picker.Item label="Priority (Rs:200)" value="Priority" />
                        </Picker>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                            <Button title="Cancel" onPress={() => { setModalVisible(false); }} />
                            <Button title="Submit" onPress={handleSubmit} />
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

