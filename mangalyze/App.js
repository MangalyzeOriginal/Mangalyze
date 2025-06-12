import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ChaptersScreen from './screens/ChaptersScreen';
import ReaderScreen from './screens/ReaderScreen';
import GenreScreen from './screens/GenreScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mangalyze' }} />
        <Stack.Screen name="Chapters" component={ChaptersScreen} options={{ title: 'Capítulos' }} />
        <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: 'Modo Leitura' }} />
        <Stack.Screen name="Genre" component={GenreScreen} options={{ title: 'Categorias' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
