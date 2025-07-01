import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await api.get(`/payments/${id}`);
      setPayment(data.data);
    })();
  }, []);

  if (!payment) {
    return (
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa726" />
        <Text style={styles.loadingText}>Fetching transaction details...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#ffa726" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Transaction Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{payment.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.amount}>₹ {payment.amount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.status,
              { color: payment.status === 'success' ? '#4caf50' : '#e53935' },
            ]}
          >
            {payment.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Method:</Text>
          <Text style={styles.value}>{payment.method}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Receiver:</Text>
          <Text style={styles.value}>{payment.receiver}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>
            {new Date(payment.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
  },
  backButton: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    color: '#ffa726',
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    color: '#bbb',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    maxWidth: '60%',
    textAlign: 'right',
  },
  amount: {
    color: '#ffa726',
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
