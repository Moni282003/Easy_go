import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../util/supabase'; // Adjust the import based on your file structure

export default function Stats() {
    const navigation = useNavigation();

    const [paymentCount, setPaymentCount] = useState(0);
    const [addItemCount, setAddItemCount] = useState(0);
    const [priorityCount, setPriorityCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCounts();
        setRefreshing(false);
    };

    const fetchCounts = async () => {
        try {
            let { count: paymentCount, error: paymentCountError } = await supabase
                .from('Payment')
                .select('*', { count: 'exact' });

            if (paymentCountError) throw paymentCountError;

            let { count: addItemCount, error: addItemCountError } = await supabase
                .from('AddItem')
                .select('*', { count: 'exact' });

            if (addItemCountError) throw addItemCountError;

            const currentDate = new Date();
            const formattedToday = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

            let { count: priorityCount, error: priorityCountError } = await supabase
                .from('Payment')
                .select('*', { count: 'exact' })
                .eq('Plan', 'Priority')
                .or(`End.is.null,End.lt.${formattedToday}`);

            if (priorityCountError) throw priorityCountError;

            setPaymentCount(paymentCount);
            setAddItemCount(addItemCount);
            setPriorityCount(priorityCount);

        } catch (error) {
            console.error('Error fetching counts:', error.message);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    const navigateToPage1 = () => {
        navigation.navigate('AddPlan'); 
    };

    const navigateToPage2 = () => {
        navigation.navigate('EditPlan'); 
    };

    const navigateToPage3 = () => {
        navigation.navigate('AddPay'); 
    };

    return (
        <ScrollView
            style={{ backgroundColor: "#2C3E50", flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:40 }}>
                <Pressable style={{width:"80%",backgroundColor:"#ff5555",paddingHorizontal:50,borderRadius:20,paddingVertical:20,elevation:10,marginVertical:20,marginLeft:0}} onPress={navigateToPage1}>
                    <Text style={{color:"black",fontSize:25}}>Add Plan</Text>
                    <Text style={{color:"black",fontSize:25}}>Total count: {addItemCount-paymentCount}</Text>
                </Pressable>
                <Pressable style={{width:"80%",backgroundColor:"#55ff55",paddingHorizontal:50,borderRadius:20,paddingVertical:20,elevation:10,marginVertical:20}} onPress={navigateToPage2}>
                    <Text style={{color:"black",fontSize:25}}>Edit Plan</Text>
                    <Text style={{color:"black",fontSize:25}}>Total count: {paymentCount}</Text>
                </Pressable>
                <Pressable style={{width:"80%",backgroundColor:"#5555ff",paddingHorizontal:50,borderRadius:20,paddingVertical:20,elevation:10,marginVertical:20,marginLeft:0}} onPress={navigateToPage3}>
                    <Text style={{color:"black",fontSize:25}}>Payment</Text>
                    <Text style={{color:"black",fontSize:25}}>Total count: {priorityCount}</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
