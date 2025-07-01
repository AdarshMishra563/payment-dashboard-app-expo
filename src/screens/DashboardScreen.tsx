import { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import { useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';

export default function DashboardScreen({navigation}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setCount(prev => prev + 1);
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
    <LinearGradient 
      colors={['#000000', '#1f1f1f']} 
      style={[styles.container, { top: '50%' }]}
    >
      <ActivityIndicator size="large" color="#fff" />
    </LinearGradient>
  );
}


  const labels = stats.payments.map((_, i) => `#${i + 1}`);
  const amounts = stats.payments.map(p => p.amount);

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : Constants.statusBarHeight;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient colors={['#000000', '#1f1f1f']} style={styles.container}>

        <View style={{ height: statusBarHeight }} />  {/* Spacer for status bar */}

        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: 'https://tse1.mm.bing.net/th/id/OIP.YeFjDDDXF1DwQ21c1rjl1QHaHw?pid=Api&P=0&h=180' }} style={styles.profileImage} />
            <Text style={styles.profileName}>Adarsh</Text>
          </View>
          <TouchableOpacity onPress={() => {navigation.navigate("Login")}}>
            <MaterialIcons name="logout" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Payment Dashboard</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Total Payments: {stats.totalPayments}</Text>
            <Text style={styles.statText}>Total Revenue: ₹{stats.totalRevenue}</Text>
            <Text style={styles.statText}>Failed Payments: {stats.failedCount}</Text>
          </View>

          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: amounts }],
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
                r: '0',
              },
            }}
            bezier
            renderDotContent={({ x, y, index }) => {
              const status = stats.payments[index].status;
              return (
                <View
                  key={index}
                  style={{
                    position: 'absolute',
                    top: y - 6,
                    left: x - 6,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: status === 'success' ? '#4caf50' : '#e53935',
                    borderWidth: 1,
                    borderColor: '#000',
                  }}
                />
              );
            }}
            style={styles.chart}
          />
        </ScrollView>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginRight: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    marginTop: 20,
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
