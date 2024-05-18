import { View, Text, Pressable, TextInput } from 'react-native';
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

    return (
        <View style={{ flex: 1, padding: 20, paddingHorizontal: 0 }}>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'blue', padding: 15, paddingHorizontal: 25, marginBottom: 10 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19 }}>SNO</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19 }}>NAME</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19 }}>ACTION</Text>
            </View>
            {filteredNames.length > 0 ? (
                filteredNames.map((item, index) => (
                    <View key={index} style={{backgroundColor: index % 2 === 0 ? '#bcbcbc' : 'white',padding:5,borderRadius:10}}>
                    <View key={index} style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 30 }}>
                        <Text style={{ width: '10%', textAlign: 'center',fontSize:17 }}>{index + 1}</Text>
                        <Text style={{ width: '50%', textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>{item.Name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                            <Pressable style={{ padding: 5, backgroundColor: 'red', marginRight: 10, borderRadius: 7 }}>
                                <AntDesign name="delete" size={24} color="white" />
                            </Pressable>
                            <Pressable
                                style={{ padding: 5, backgroundColor: 'blue', borderRadius: 7 }}
                                onPress={() =>{ 
                                    setEditName(item.Name)
                                    navigation.navigate('EditItem')}}
                            >
                                <Feather name="edit" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",marginTop:5}}>
                    <View>
                    <Text style={{ textAlign: 'center', fontSize: 17 }}>Category: {item.Category}</Text>
                    </View>
                    <Text style={{  textAlign: 'center', fontSize: 17 }}>Place: {item.Place}</Text>
                    </View>
                    </View>
                ))
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 20, fontWeight: 'bold' }}>No Items found</Text>
            )}
        </View>
    );
}
