import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../util/supabase'; 
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
            style={{ backgroundColor: "white", flex: 1, borderWidth: 2, borderColor: "#ededed" }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"midnightblue",width:"70%",marginLeft:"15%",padding:0,borderRadius:45,marginBottom:0,marginTop:20,borderTopRightRadius:10,borderBottomLeftRadius:10,elevation:10,gap:20
            }}>
            <FontAwesome5 name="amazon-pay" size={30} color="white" />
      <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold", marginVertical: 15, color: "white" }}>Pay in EasyGo</Text></View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>

            <Pressable  style={{ width: "80%", backgroundColor: "tomato", paddingHorizontal: 50, borderRadius: 7, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 ,height:175,
                borderBottomLeftRadius:30,borderTopRightRadius:30, paddingRight:25,
                borderWidth:6,borderRightColor:"#cbce91ff",borderTopColor:"#cbce91ff",borderLeftColor:"#ea738dff",borderBottomColor:"#ea738dff"
                }} onPress={navigateToPage4}>
                    <Text style={{ color: "black", fontSize: 25,color: "black", fontSize: 25,fontWeight:"bold",color:"white" }}>Statistics</Text>
                    <MaterialIcons name="query-stats" size={70} color="white" style={{marginLeft:150,marginTop:30}} />
                </Pressable>
                <Pressable style={{ width: "80%", backgroundColor: "tomato", paddingHorizontal: 50, borderRadius: 7, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 ,height:175,
                borderBottomLeftRadius:30,borderTopRightRadius:30,paddingRight:25,
                borderWidth:6,borderRightColor:"#cbce91ff",borderTopColor:"#cbce91ff",borderLeftColor:"#ea738dff",borderBottomColor:"#ea738dff"
                }} onPress={navigateToPage1}>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <View>
                    <Text style={{ color: "black", fontSize: 25,fontWeight:"bold",color:"white"}}>Add Plan</Text>
                    <Text style={{ color: "black", fontSize: 20,color:"white" }}>Total count: {addItemCount - paymentCount}</Text>
                    <MaterialIcons name="add-box" size={70} color="white" style={{marginLeft:150}} />
                    </View>
                    </View>

                </Pressable>
                <Pressable style={{  width: "80%", backgroundColor: "tomato", paddingHorizontal: 50, borderRadius: 7, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 ,height:175,
                borderBottomLeftRadius:30,borderTopRightRadius:30,
                borderWidth:6,borderRightColor:"#cbce91ff",borderTopColor:"#cbce91ff",borderLeftColor:"#ea738dff",borderBottomColor:"#ea738dff"}} onPress={navigateToPage2}>

                <Text style={{ color: "black", fontSize: 25,fontWeight:"bold",color:"white",marginBottom:20}}>Edit Plan</Text>
                    <View
                    style={{flexDirection:"row",justifyContent:"center",gap:40,alignItems:"center"}}
                    ><View>
                    <Text style={{ color: "black", fontSize: 20 , color:"white",fontWeight:"bold" }}>Priority: {priority}</Text>
                    <Text style={{ color: "black", fontSize: 20 , color:"white",fontWeight:"bold" }}>Normal: {normalCount}</Text></View>
                    <Text style={{ color: "black", fontSize: 20 , color:"white",fontWeight:"bold" }}>Total: {normalCount + priority}</Text></View>
                </Pressable>
                <Pressable style={{   width: "80%", backgroundColor: "tomato", paddingHorizontal: 50, borderRadius: 7, paddingVertical: 20, elevation: 10, marginVertical: 20, marginLeft: 0 ,height:175,
                borderBottomLeftRadius:30,borderTopRightRadius:30,paddingRight:25,
                borderWidth:6,borderRightColor:"#cbce91ff",borderTopColor:"#cbce91ff",borderLeftColor:"#ea738dff",borderBottomColor:"#ea738dff"}} onPress={navigateToPage3}>
                <Text style={{ color: "black", fontSize: 25,fontWeight:"bold",color:"white"}}>Payment</Text>
                <Text style={{ color: "black", fontSize: 20 , color:"white" }}>Total Count: {priorityCount}</Text>
                <MaterialIcons name="currency-rupee" size={70} color="white" style={{marginLeft:150}} />
                </Pressable>
               
            </View>
        </ScrollView>
    );
};

export default Stats;
