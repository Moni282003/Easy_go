import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { UseAuth } from '../Context/UseAuth';

export default function Header() {
    const { user, logout } = UseAuth();

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
                        await logout();
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
            <Text style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                ADMIN PANEL
            </Text>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                <Pressable style={{ backgroundColor: 'red', borderRadius: 8, padding: 5 }} onPress={handleLogout}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>LOGOUT</Text>
                </Pressable>
            </View>
        </View>
    );
}
