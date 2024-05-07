import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function StartPage() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('./../assets/images/logo.png')}
        />
      </View>
      <ActivityIndicator size={40} color="midnightblue" />
      <Text style={styles.welcomeText}>Welcome to Easy Go App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 250,
  },
  welcomeText: {
    fontSize: 20,
    marginTop: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});
