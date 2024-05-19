import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../util/supabase';

export default function AddPay() {
  const [table, setTable] = useState([]);

  const Update = async (item) => {
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
          const { data, error } = await supabase
          .from('Payment')
          .update({ Start: today.toISOString().split('T')[0], End: endDate.toISOString().split('T')[0] })
          .eq('Name', item)
          .select();
  
          if (error) {
            console.error(error.message);
          } else {
            console.log("Payment updated successfully.");
            display();
            Alert.alert("Payment Successful", "Payment has been made successfully.");
          }
        }}
      ],
      { cancelable: false }
    );
  };

  const display = async () => {
    const formattedToday = new Date().toISOString().split('T')[0];
    try {
      const { data: payments, error: paymentError } = await supabase
        .from('Payment')
        .select('Name')
        .eq('Plan', 'Priority')
        .or(`End.is.null,End.lt.${formattedToday}`);

      if (paymentError) {
        console.error(paymentError.message);
      } else {
        const { data: addItems, error: addItemError } = await supabase
          .from('AddItem')
          .select('Name, Category, Place');

        if (addItemError) {
          console.error(addItemError.message);
        } else {
          const combinedData = payments.map(payment => {
            const addItem = addItems.find(item => item.Name === payment.Name);
            return { ...payment, Category: addItem.Category, Place: addItem.Place };
          });
          setTable(combinedData);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    display();
  }, []);

  return (
    <View>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 5, marginTop: 50, backgroundColor: "blue" }}>
        <Text style={{ flex: 1, fontWeight: 'bold', color: "white", fontSize: 20 }}>Sno</Text>
        <Text style={{ flex: 3, fontWeight: 'bold', color: "white", fontSize: 20 }}>Name</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: "white", fontSize: 20 }}>Action</Text>
      </View>
      {table.map((item, index) => (
        <View key={index} style={{ flexDirection: "column", borderBottomWidth: 1, backgroundColor: index + 1 % 2 == 0 ? "white" : "#bbbbbb" }} >
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <Text style={{ flex: 1, marginLeft: 5, fontSize: 19 }}>{index + 1}</Text>
            <Text style={{ flex: 3, fontSize: 19 }}>{item.Name}</Text>
            <Pressable onPress={() => Update(item.Name)} style={{ backgroundColor: "blue", padding: 3, borderRadius: 3 }}>
              <Text style={{ color: 'white', fontSize: 18 }}>Pay Now</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30, marginVertical: 10 }}>
            <Text style={{ flex: 3, fontSize: 19, fontWeight: "bold", color: "blue" }}>Category: {item.Category}</Text>
            <Text style={{ flex: 3, fontSize: 19, fontWeight: "bold", color: "blue" }}>Place: {item.Place}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
