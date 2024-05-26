import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { UseAuth } from '../Context/UseAuth';
import { useNavigation } from '@react-navigation/native'; 
import LottieView from 'lottie-react-native';

export default function Header() {
    const { user, logout,type } = UseAuth();
    const navigate = useNavigation();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                    if(type){
                        await logout();
                    }

                    else{
                        navigate.navigate('signIn'); 
                    }
                    },
                },
            ],
            { cancelable: true }
        );


    };

    return (
        <View
            style={{
                paddingVertical: 20,
                paddingTop: 60,
                backgroundColor: '#051923',
                paddingHorizontal: 15,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
            }}>
            {
            type?
            <Text style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', color: 'white', fontStyle:"italic" }}>ADMIN WORKSPACE
            </Text>
        :     <Text style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', color: 'white' }}>STAFF WORKSPACE
        </Text>
        }
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                <Pressable style={{ backgroundColor: 'red', borderRadius: 8, padding: 5 }} onPress={handleLogout}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}><LottieView style={{width:50,height:50}} source={require('../util/Animation - 1716706278559.json')} autoPlay loop />
</Text>
                </Pressable>
            </View>
        </View>
    );
}
