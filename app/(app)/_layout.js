import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { UseAuth } from '../../Context/UseAuth';
import { Stack } from 'expo-router';
import Header from '../../components/header';
export default function _layout() {
    const {logout}=UseAuth();
  return (
    <Stack>
        <Stack.Screen
        name="home"
        options={{
            header:()=><Header/>
        }}/>
    </Stack>
  )
}