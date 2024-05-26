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
    <Picker
  style={{ marginTop: 20, borderWidth: 2, borderColor: "black" }}
  selectedValue={selectedType}
  onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
>
  <Picker.Item label="Items" value="Items" />
  <Picker.Item label="Advertisements" value="Advertisements" />
</Picker>

      <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 5, marginTop: 50, backgroundColor: "blue" }}>
        <Text style={{ flex: 1, fontWeight: 'bold', color: "white", fontSize: 20 }}>Sno</Text>
        <Text style={{ flex: 3, fontWeight: 'bold', color: "white", fontSize: 20 }}>Name</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: "white", fontSize: 20 }}>Action</Text>
      </View>
      {selectedType === 'Items' && itemTable.map((item, index) => (
        <View key={index} style={{ flexDirection: "column", borderBottomWidth: 1, backgroundColor: index + 1 % 2 == 0 ? "white" : "#bbbbbb" }} >
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <Text style={{ flex: 1, marginLeft: 5, fontSize: 19 }}>{index + 1}</Text>
            <Text style={{ flex: 3, fontSize:19 }}>{item.Name}</Text>
<Pressable onPress={() =>updateItemPayment(item.Name)} style={{ backgroundColor: "blue", padding: 3, borderRadius: 3 }}>
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
<View key={index} style={{ flexDirection: "column", borderBottomWidth: 1, backgroundColor: index + 1 % 2 == 0 ? "white" : "#bbbbbb" }} >
<View style={{ flexDirection: 'row', padding: 5 }}>
<Text style={{ flex: 1, marginLeft: 5, fontSize: 19 }}>{index + 1}</Text>
<Text style={{ flex: 3, fontSize: 19 }}>{adv.Name}</Text>
<Pressable onPress={() => updateAdvPayment(adv.Name)} style={{ backgroundColor: "blue", padding: 3, borderRadius: 3 }}>
<Text style={{ color: 'white', fontSize: 18 }}>Pay Now</Text>
</Pressable>
</View>
<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30, marginVertical: 10 }}>
<Text style={{ flex: 3, fontSize: 17, fontWeight: "bold", color: "blue" }}>Place: {adv.Place}</Text>
</View>
</View>
))}
</View>
);
}
