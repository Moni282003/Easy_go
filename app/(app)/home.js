import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Category from './Screens/Category';
import List from './Screens/List';
import Ionicons from '@expo/vector-icons/Ionicons';
import Stats from './Screens/Stats';
import Setting from './Screens/Setting';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SignUp from './Screens/signUp';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12, // Adjust the font size here
          color: "#40916c" 
        },
        tabBarActiveTintColor: "#40916c", 
        tabBarInactiveTintColor: "white", 
        tabBarStyle:{
            backgroundColor:"#051923", 
            padding:5,
            height:60,
            borderWidth:0
        }
      }}
    >
      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          title: 'Add Items',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={24} color={color} />, // Adjust the size here
        }}
      />
      <Tab.Screen
        name="List Items"
        component={List}
        options={{
          title: 'List Items',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={24} color={color} />, // Adjust the size here
        }}
      />
      <Tab.Screen
        name="Payment"
        component={Stats}
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={24} color={color} />, // Adjust the size here
        }}
      />
     
      <Tab.Screen
        name="signUp"
        component={SignUp}
        options={{
          title: 'Add Admin',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-add" size={24} color={color}/>, // Adjust the size here
        }}
      />
       <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          title: 'Setting',
          tabBarIcon: ({ color, size }) => <Fontisto name="player-settings" size={24} color={color} />, // Adjust the size here
        }}
      />
    </Tab.Navigator>
  );
}
