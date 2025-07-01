import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await api.post('/auth/login', { username, password });
      await SecureStore.setItemAsync('token', res.data.access_token);
      navigation.navigate('Dashboard');
    } catch (err) {
      Alert.alert('Login Failed');
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={login} />
    </View>
  );
}
