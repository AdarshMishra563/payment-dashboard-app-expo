import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { useFocusEffect } from 'expo-router';

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count,setcount]=useState(0);
useFocusEffect(
    useCallback(() => {
     setcount(prev=>prev+1)
    }, [])
  );
  useEffect(() => {
    api.get('/payments/stats')
      .then(res => {
        setStats(res.data);
        console.log(res.data)
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [count]);

  if (loading) {
    return (
      <LinearGradient colors={['#000000', '#1f1f1f']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#1f1f1f']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Payment Dashboard</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>Total Payments: {stats.totalPayments}</Text>
          <Text style={styles.statText}>Total Revenue: ₹{stats.totalRevenue}</Text>
          <Text style={styles.statText}>Failed Payments: {stats.failedCount}</Text>
        </View>

        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ data: [500, 800, 1000, 700, 1500] }],
          }}
          width={Dimensions.get('window').width - 32}
          height={240}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: '#000',
            backgroundGradientFrom: '#1f1f1f',
            backgroundGradientTo: '#000',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: () => '#ccc',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40,
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 30,
    width: '100%',
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  statText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
