import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { useFocusEffect } from 'expo-router';

export default function TransactionListScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // 'all' | 'success' | 'failed'
  const [page, setPage] = useState(1);
  const limit = 5;

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchTransactions();
    }, [])
  );

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments`);
      setTransactions(response.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchTransactions();
  };

  const filteredTransactions = useMemo(() => {
    if (selectedTab === 'all') return transactions;
    return transactions.filter((item) => item.status === selectedTab);
  }, [transactions, selectedTab]);

  const totalPages = Math.ceil(filteredTransactions.length / limit);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredTransactions.slice(startIndex, startIndex + limit);
  }, [filteredTransactions, page]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { id: item.id })}
      style={styles.touchable}
    >
      <LinearGradient colors={['#2c2c2c', '#1a1a1a']} style={styles.card}>
        <Text style={styles.cardTitle}>Transaction id #{item.id}</Text>
        <Text style={styles.amount}>₹ {item.amount}</Text>
        <Text
          style={[
            styles.status,
            { color: item.status === 'success' ? '#4caf50' : '#e53935' },
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {['all', 'success', 'failed'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            selectedTab === tab && styles.activeTabButton
          ]}
          onPress={() => {
            setSelectedTab(tab);
            setPage(1);
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText
            ]}
          >
            {tab.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPaginationButtons = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            page === i + 1 && styles.activePageButton
          ]}
          onPress={() => setPage(i + 1)}
        >
          <Text
            style={[
              styles.pageButtonText,
              page === i + 1 && styles.activePageButtonText
            ]}
          >
            {i + 1}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (<SafeAreaView style={{ flex: 1, backgroundColor: '#000',marginTop:30 }}>
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffa726" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <>
          {renderTabs()}
          <FlatList
            data={paginatedTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ffa726"
                colors={['#ffa726']}
                progressBackgroundColor="#1a1a1a"
              />
            }
            ListEmptyComponent={() => (
              <Text style={styles.noDataText}>No transactions found</Text>
            )}
          />
          {renderPaginationButtons()}
        </>
      )}
    </LinearGradient></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
  },
  listContainer: {
    padding: 20,
  },
  touchable: {
    marginBottom: 16,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    color: '#ffa726',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  amount: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#2c2c2c',
  },
  activeTabButton: {
    backgroundColor: '#ffa726',
  },
  tabText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#000',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pageButton: {
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#2c2c2c',
  },
  activePageButton: {
    backgroundColor: '#ffa726',
  },
  pageButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activePageButtonText: {
    color: '#000',
  },
});
