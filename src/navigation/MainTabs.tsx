import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotesListScreen } from '../screens/NotesListScreen';
import { CreateNoteScreen } from '../screens/CreateNoteScreen';
import { theme } from '../theme';
import type { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="NotesList"
        component={NotesListScreen}
        options={{
          title: 'My Notes',
          tabBarLabel: 'Notes',
          tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="CreateNote"
        component={CreateNoteScreen}
        options={{
          title: 'New Note',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>➕</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
