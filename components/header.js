import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { UseAuth } from '../Context/UseAuth'

export default function Header() {
    const {user,logout}=UseAuth();
  return (
    <View
    style={{paddingVertical:20,paddingTop:60,backgroundColor:"#051923",paddingHorizontal:15,
        display:"flex",justifyContent:"space-between",alignItems:'center',flexDirection:"row"
    }}
    >
      <Text
      style={{paddingBottom:10,fontSize:18,fontWeight:"bold",color:"white"}}
      >ADMIN PANEL</Text>
      <View
      style={{  display:"flex",justifyContent:"center",alignItems:'center',flexDirection:"row",gap:5}}
      >
        <Pressable
        onPress={async()=>{
            await logout();
        }}
        >
      <Text
    style={{paddingBottom:10,fontSize:18,fontWeight:"bold",color:"red"}}
      >LOGOUT</Text></Pressable>
      </View>
    </View>
  )
}