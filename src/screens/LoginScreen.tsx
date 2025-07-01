import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import {Modal} from 'react-native';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      await SecureStore.setItemAsync('token', res.data.access_token);
      setLoading(false);
      navigation.navigate('MainTabs');
    } catch (err) {
      setLoading(false);
      setErrorModalVisible(true);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#374151']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Error Modal */}
      <Modal
  visible={errorModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setErrorModalVisible(false)}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modal}>
      <Text style={styles.modalText}>Login Failed. Please check your credentials.</Text>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setErrorModalVisible(false)}
      >
        <Text style={styles.modalButtonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  alignItems: 'center',
},

  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 36,
    color: '#F9FAFB',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '600',
  },
  modal: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    color: '#F9FAFB',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
});
