import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Category from './Screens/Category';
import List from './Screens/List';
import Ionicons from '@expo/vector-icons/Ionicons';
import Stats from './Screens/Stats';
import Setting from './Screens/Setting';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 14, 
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
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="List Items"
        component={List}
        options={{
          title: 'List Items',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="Payment"
        component={Stats}
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          title: 'Setting',
          tabBarIcon: ({ color, size }) => <Fontisto name="player-settings" size={30} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
