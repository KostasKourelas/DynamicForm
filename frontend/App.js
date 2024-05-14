import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screens from './screens/index';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        {screens.map((screen) => (
          <Stack.Screen key={screen.name} name={screen.name} component={screen.component} />
          
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
