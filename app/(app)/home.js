import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Category from './Screens/Category';
import List from './Screens/List';
import Ionicons from '@expo/vector-icons/Ionicons';
import Stats from './Screens/Stats';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Staff from './Screens/Staff';
import Entypo from '@expo/vector-icons/Entypo';
import { UseAuth } from '../../Context/UseAuth';

const Tab = createMaterialTopTabNavigator();

export default function Home() {

const {type}=UseAuth();



  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#40916c", 
        tabBarInactiveTintColor: "white", 
        tabBarLabelStyle: {
          fontSize: 12, 
          color: "#40916c" 
        },
        tabBarStyle:{
            backgroundColor:"#051923", 
            height:80,
            borderWidth:0,
            padding:8,
            paddingBottom:0,
            paddingHorizontal: type ? 0 : '14%',
          },
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent' 
        },
        
      }}
    >
      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          title: 'Add Items',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={24} color={color} />, 
        }}
      />
      <Tab.Screen
        name="List Items"
        component={List}
        options={{
          title: 'List Items',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={24} color={color} />, 
        }}
      />
      <Tab.Screen
        name="Payment"
        component={Stats}
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="rupee-sign" size={24} color={color} />
        }}
      />

{
type &&
      <Tab.Screen
        name="Staff"
        component={Staff}
        options={{
          title: 'Add Staff',
          tabBarIcon: ({ color, size }) => <Entypo name="add-user" size={24} color={color} />, 
        }}
      />}
    </Tab.Navigator>
    

  );
}
