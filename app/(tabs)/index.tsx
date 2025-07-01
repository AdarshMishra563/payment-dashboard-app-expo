import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../../src/screens/LoginScreen';
import DashboardScreen from '../../src/screens/DashboardScreen';
import TransactionListScreen from '../../src/screens/TransactionListScreen';
import TransactionDetailsScreen from '../../src/screens/TransactionDetailsScreen';
import AddPaymentScreen from '../../src/screens/AddPaymentScreen';
import * as SecureStore from 'expo-secure-store';

// Type for stack params
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  TransactionDetails: { id: string };
};

// Type for tab params
export type TabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  AddPayment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab navigator component
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1f1f1f' },
        tabBarActiveTintColor: '#ffa726',
        tabBarInactiveTintColor: '#ccc',
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Transactions') iconName = 'list';
          else if (route.name === 'AddPayment') iconName = 'add-circle';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="AddPayment" component={AddPaymentScreen} />
      <Tab.Screen name="Transactions" component={TransactionListScreen} />
      
    </Tab.Navigator>
  );
}

export default function App() {

    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  return (
    
      <Stack.Navigator initialRouteName={isAuthenticated?"MainTabs":"Login"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Details"
          component={TransactionDetailsScreen}
          options={{ title: 'Transaction Details' }}
        />
      </Stack.Navigator>
   
  );
}
