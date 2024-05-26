import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Category from './Screens/Category';
import List from './Screens/List';
import Stats from './Screens/Stats';
import Staff from './Screens/Staff';
import { UseAuth } from '../../Context/UseAuth';
import { useWindowDimensions } from 'react-native';
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  const { type } = UseAuth();
  const windowWidth = useWindowDimensions().width;
  const tabBarPadding = type ? 0 : windowWidth * 0.13; // Adjust padding based on screen width

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#40916c",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: {
          fontSize: 11,
          color: "#40916c"
        },
        tabBarStyle: {
          backgroundColor: "#051923",
          height: 80,
          borderWidth: 0,
          padding: 8,
          paddingBottom: 0,
          paddingHorizontal: tabBarPadding,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          width: "100%",
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarContentContainerStyle: {
          justifyContent: 'space-between', 
        },
      }}
    >
      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          title: 'Add items',
          tabBarIcon: ({ color, size }) => <Ionicons name="bag-add-sharp" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="List Items"
        component={List}
        options={{
          title: 'List items',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Payment"
        component={Stats}
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="rupee-sign" size={22} color={color} />,
        }}
      />

      {type && (
        <Tab.Screen
          name="Staff"
          component={Staff}
          options={{
            title: 'Staff',
            tabBarIcon: ({ color, size }) => <Entypo name="add-user" size={22} color={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}
