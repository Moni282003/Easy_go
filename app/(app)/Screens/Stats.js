import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../util/supabase'; 

const Stats = () => {
    const navigation = useNavigation();
    const [paymentCount, setPaymentCount] = useState(0);
    const [addItemCount, setAddItemCount] = useState(0);
    const [priorityCount, setPriorityCount] = useState(0);
    const [normalCount, setNormalCount] = useState(0);
    const [priority, setPriority] = useState(0);
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

            let { count: priority, error: priorityError } = await supabase
                .from('Payment')
                .select('*', { count: 'exact' })
                .eq('Plan', 'Priority');

            if (priorityError) throw priorityError;

            let { count: normalCount, error: normalCountError } = await supabase
                .from('Payment')
                .select('*', { count: 'exact' })
                .eq('Plan', 'Normal');

            if (normalCountError) throw normalCountError;

            setPaymentCount(paymentCount);
            setAddItemCount(addItemCount);
            setPriorityCount(priorityCount);
            setNormalCount(normalCount);
            setPriority(priority);
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
    const navigateToPage4 = () => {
        navigation.navigate('Statistic'); 
    };

   
    return (
        <ScrollView
            style={{ backgroundColor: "#dedede", flex: 1, borderWidth: 2, borderColor: "#ededed" }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                <Pressable style={{ width: "80%", backgroundColor: "#ff5555", paddingHorizontal: 50, borderRadius: 20, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 }} onPress={navigateToPage1}>
                    <Text style={{ color: "black", fontSize: 25 }}>Add Plan</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>Total count: {addItemCount - paymentCount}</Text>
                </Pressable>
                <Pressable style={{ width: "80%", backgroundColor: "#55ff55", paddingHorizontal: 50, borderRadius: 20, paddingVertical: 20, elevation: 10, marginVertical: 20 }} onPress={navigateToPage2}>
                    <Text style={{ color: "black", fontSize: 25 }}>Edit Plan</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>Priority count: {priority}</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>Normal count: {normalCount}</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>Total count: {normalCount + priority}</Text>
                </Pressable>
                <Pressable style={{ width: "80%", backgroundColor: "#5555ff", paddingHorizontal: 50, borderRadius: 20, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 }} onPress={navigateToPage3}>
                    <Text style={{ color: "black", fontSize: 25 }}>Payment</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>Total count: {priorityCount}</Text>
                </Pressable>
                <Pressable style={{ width: "80%", backgroundColor: "#5555ff", paddingHorizontal: 50, borderRadius: 20, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 }} onPress={navigateToPage4}>
                    <Text style={{ color: "black", fontSize: 25 }}>Stats</Text>
                    <Text style={{ color: "black", fontSize: 25 }}></Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default Stats;
