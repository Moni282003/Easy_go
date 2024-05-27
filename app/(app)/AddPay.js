import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../util/supabase';

export default function AddPay() {
  const [itemTable, setItemTable] = useState([]);
  const [advTable, setAdvTable] = useState([]);
  const [selectedType, setSelectedType] = useState('Items');

  const updateItemPayment = async (itemName) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    Alert.alert(
      "Confirmation",
      "Are you sure you want to make the payment?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
          try {
            const { data, error } = await supabase
              .from('Payment')
              .update({ Start: today.toISOString().split('T')[0], End: endDate.toISOString().split('T')[0] })
              .eq('Name', itemName)
              .select();

            if (error) {
              console.error(error.message);
            } else {
              console.log("Payment date updated successfully for item.");
              displayItemTable();
              Alert.alert("Payment Successful", "Payment has been made successfully.");
            }
          } catch (error) {
            console.error(error.message);
          }
        }}
      ],
      { cancelable: false }
    );
  };

  const updateAdvPayment = async (advName) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    Alert.alert(
      "Confirmation",
      "Are you sure you want to make the payment?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
          try {
            const { data, error } = await supabase
              .from('Adv')
              .update({ Date: endDate.toISOString().split('T')[0] })
              .eq('Name', advName)
              .select();

            if (error) {
              console.error(error.message);
            } else {
              console.log("Payment date updated successfully for advertisement.");
              displayAdvTable();
              Alert.alert("Payment Successful", "Payment has been made successfully.");
            }
          } catch (error) {
            console.error(error.message);
          }
        }}
      ],
      { cancelable: false }
    );
  };

  const displayItemTable = async () => {
    try {
      const formattedToday = new Date().toISOString().split('T')[0];
      const { data: paymentData, error: paymentError } = await supabase
        .from('Payment')
        .select('Name, Start, End')
        .or(`End.is.null,End.lte.${formattedToday}`)
        .eq('Plan','Priority')
        ;


      if (paymentError) {
        console.error(paymentError.message);
        return;
      }

      const itemPromises = paymentData.map(async (item) => {
        const { data: addItemData, error: addItemError } = await supabase
          .from('AddItem')
          .select('Place, Category')
          .eq('Name', item.Name)
          .single();

        if (addItemError) {
          console.error(addItemError.message);
          return null;
        }

        return {
          ...item,
          Place: addItemData?.Place || 'N/A',
          Category: addItemData?.Category || 'N/A',
        };
      });

      const itemDetails = await Promise.all(itemPromises);

      setItemTable(itemDetails.filter(Boolean));
    } catch (error) {
      console.error(error.message);
    }
  };

  const displayAdvTable = async () => {
    try {
      const formattedToday = new Date().toISOString().split('T')[0];
      const { data: advData, error: advError } = await supabase
        .from('Adv')
        .select('Name, Place, Date, Des')
        .or(`Date.is.null,Date.lte.${formattedToday}`);

      if (advError) {
        console.error(advError.message);
        return;
      }

      setAdvTable(advData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedType === 'Items') {
      displayItemTable();
    } else if (selectedType === 'Advertisements') {
      displayAdvTable();
    }
  }, [selectedType]);

  return (
    <View>
      <View style={{borderWidth:2,padding:2,marginTop:40,borderRadius:10,width:"90%",marginLeft:"5%"}}>
    <Picker
  style={{ borderWidth: 2, borderColor: "black" }}
  selectedValue={selectedType}
  onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
>
  <Picker.Item label="Items" value="Items" />
  <Picker.Item label="Advertisements" value="Advertisements" />
</Picker>
</View>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 5, marginTop: 50, backgroundColor: "blue",backgroundColor: 'midnightblue', padding: 15, paddingHorizontal: 25, marginBottom: 10
                ,width:"96%",borderTopLeftRadius:25,borderTopRightRadius:25,marginLeft:"2%"}}>
        <Text style={{ flex: 3, fontWeight: 'bold', color: "white", fontSize: 20 }}>Name</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: "white", fontSize: 20,marginLeft:60 }}>Action</Text>
      </View>
      {selectedType === 'Items' && itemTable.map((item, index) => (
        <View key={index} style={{ flexDirection: "column", borderBottomWidth: 0, backgroundColor: index + 1 % 2 == 0 ? "white" : "#bbbbbb",width:"96%",marginLeft:"2%",
          borderBottomLeftRadius:itemTable.length==index+1?20:0,borderBottomRightRadius:itemTable.length==index+1?20:0,paddingVertical:20

         }} >
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <Text style={{ flex: 3, fontSize:19 }}>{item.Name}</Text>
<Pressable onPress={() =>updateItemPayment(item.Name)} style={{ backgroundColor: "blue", padding: 3, borderRadius: 3,marginLeft:20 }}>
<Text style={{ color: 'white', fontSize: 18 }}>Pay Now</Text>
</Pressable>
</View>
<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30, marginVertical: 10 }}>
<Text style={{ flex: 3, fontSize: 17, fontWeight: "bold", color: "blue" }}>Place: {item.Place}</Text>
<Text style={{ flex: 3, fontSize: 17, fontWeight: "bold", color: "blue" }}>Category: {item.Category}</Text>
</View>
</View>
))}
{selectedType === 'Advertisements' && advTable.map((adv, index) => (
<View key={index} style={{ flexDirection: "column", borderBottomWidth: 0, backgroundColor: index + 1 % 2 == 0 ? "white" : "#bbbbbb",width:"96%",marginLeft:"2%",
          borderBottomLeftRadius:advTable.length==index+1?20:0,borderBottomRightRadius:advTable.length==index+1?20:0,paddingVertical:20 }} >
<View style={{ flexDirection: 'row', padding: 5 }}>
<Text style={{ flex: 3, fontSize: 20,marginLeft:15,fontWeight:"bold"}}>{adv.Name}</Text>
<Pressable onPress={() => updateAdvPayment(adv.Name)} style={{ backgroundColor: "blue", padding: 3, borderRadius: 3,marginRight:10, }}>
<Text style={{ color: 'white', fontSize: 18 }}>Pay Now</Text>
</Pressable>
</View>
<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30, marginVertical: 10,width:"50%"}}>
<Text style={{ flex: 3, fontSize: 17, fontWeight: "bold", color: "white",backgroundColor:"blue",padding:8,borderRadius:5,width:"auto"}}>Place: {adv.Place}</Text>
</View>
</View>
))}
</View>
);
}
