import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import FindPassword from '../screens/FindPassword';
import {AuthStackParamList} from '../types/AuthNavigatorTypes';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="FindPassword" component={FindPassword} />
    </Stack.Navigator>
  );
}
