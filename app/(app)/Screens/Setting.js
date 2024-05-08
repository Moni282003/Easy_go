import React from 'react';
import { View, Text, Image } from 'react-native';
import { UseAuth } from '../../../Context/UseAuth';

export default function Setting() {
  const { user } = UseAuth();

  return (
    <View>
      <Image source={{ uri: user.profileurl }} style={{ width: 200, height: 200,borderRadius:100,marginTop:20,marginLeft:"25%" }} />
      <Text>{user.username}</Text>
    </View>
  );
}
