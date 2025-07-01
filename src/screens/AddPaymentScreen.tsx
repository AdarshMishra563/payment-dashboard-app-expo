import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

export default function AddPaymentScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [method, setMethod] = useState('upi');

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const getRandomStatus = () => (Math.random() < 0.8 ? 'success' : 'failed');

  const handleSubmit = async () => {
    if (!amount || !receiver) {
      setModalMessage('Please enter both amount and receiver.');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const status = getRandomStatus();

      await api.post('/payments', { amount, receiver, status, method });
      setModalMessage(`Payment ${status === 'success' ? 'added' : 'attempted'} successfully!`);
      setModalVisible(true);
      setAmount('');
      setReceiver('');
    } catch (err) {
      setModalMessage('Failed to add payment.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Add Payment</Text>

          <TextInput
            placeholder="Amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Receiver"
            placeholderTextColor="#aaa"
            value={receiver}
            onChangeText={setReceiver}
            style={styles.input}
          />

          <Text style={styles.subTitle}>Select Payment Method</Text>
          <View style={styles.methodContainer}>
            {['upi', 'card', 'wallet'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setMethod(item)}
                style={[styles.methodButton, method === item && styles.methodButtonSelected]}
              >
                <Text style={[styles.methodButtonText, method === item && styles.methodButtonTextSelected]}>
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <LinearGradient colors={['#ffa726', '#fb8c00']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Submit Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#ffa726" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Processing...</Text>
        </View>
      )}

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                if (modalMessage.includes('successfully')) navigation.goBack();
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  scroll: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    color: '#ffa726',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  methodButtonSelected: {
    backgroundColor: '#ffa726',
  },
  methodButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  methodButtonTextSelected: {
    color: '#1a1a1a',
  },
  button: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#ffa726',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
