import { View, Text, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../util/supabase';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { UseAuth } from '../../Context/UseAuth';

export default function ViewItems() {
    const [names, setNames] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [placeFilter, setPlaceFilter] = useState('');
    const [filteredNames, setFilteredNames] = useState([]);
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
                setNames(AddItem);
                setFilteredNames(AddItem);
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

    const handleDelete = async (itemName) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const { error } = await supabase.from('AddItem').delete().eq('Name', itemName);
                            const { error1 } = await supabase.from('Adv').delete().eq('Name', itemName);
                            const { error2 } = await supabase.from('Payment').delete().eq('Name', itemName);
                            if (error) {
                                console.error('Error deleting item:', error.message);
                            } else {
                                Alert.alert('Success', 'Item deleted successfully!');
                                display();
                            }
                        } catch (error) {
                            console.error('Error deleting item:', error.message);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'midnightblue', padding: 15, paddingHorizontal: 25,marginTop:30,
                borderRadius:30,borderBottomLeftRadius:0,borderBottomRightRadius:0,marginLeft:"3%",width:"94%" }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19,paddingLeft:20 }}>NAME</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19 }}>ACTION</Text>
                </View>
                {filteredNames.length > 0 ? (
    filteredNames.map((item, index) => (
        <View key={index} style={{backgroundColor: index % 2 === 0 ? '#bcbcbc' : 'white',padding:0,borderBottomLeftRadius:index === filteredNames.length - 1 ? 20 : 0,marginLeft:"3%",width:"94%",marginTop:10,paddingVertical:12,borderWidth:1
        ,borderBottomRightRadius:index === filteredNames.length - 1 ? 20 :0
        }}>

            <View key={index} style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 30 }}>
                <Text style={{ width: '50%', textAlign: 'left', fontSize: 20, fontWeight: 'bold',marginLeft:20 }}>{item.Name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                    <Pressable style={{ padding: 5, backgroundColor: 'red', marginRight: 10, borderRadius: 7 }}
                        onPress={() => handleDelete(item.Name)}
                    >
                        <AntDesign name="delete" size={24} color="white" />
                    </Pressable>
                    <Pressable
                        style={{ padding: 5, backgroundColor: 'blue', borderRadius: 7 }}
                        onPress={() => { 
                            setEditName(item.Name)
                            navigation.navigate('EditItem')
                        }}
                    >
                        <Feather name="edit" size={24} color="white" />
                    </Pressable>
                </View>
            </View>
            <View style={{flexDirection:"row",justifyContent:"space-evenly",marginTop:5}}>
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 17 ,backgroundColor:"red", padding:4,borderRadius:8,color:"white" }}>Category: {item.Category}</Text>
                </View>
                <Text style={{ textAlign: 'center', fontSize: 17,backgroundColor:"blue", padding:4,borderRadius:8,color:"white" }}>Place: {item.Place}</Text>
            </View>
        </View>
    ))
) : (
    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 20, fontWeight: 'bold' }}>No Items found</Text>
)}

            </View>
        </ScrollView>
    );
}
