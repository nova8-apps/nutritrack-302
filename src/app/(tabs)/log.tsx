import React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';

// This tab redirects to the log-meal modal via the tab listener.
// This file exists so Expo Router doesn't 404 on the route.
export default function LogTab() {
  return <Redirect href="/log-meal" />;
}
