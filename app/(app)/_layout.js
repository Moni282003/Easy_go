import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { UseAuth } from '../../Context/UseAuth';

export default function _layout() {
    const {logout}=UseAuth();
  return (
    <View className="mt-40">
        <Pressable onPress={ async()=>{
      await logout();
    } }>
            <Text>Logout</Text>
        </Pressable>
    </View>
  )
}