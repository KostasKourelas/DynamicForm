import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import screens from '../screens/index';

const HomeScreen = ({ navigation }) => {
  const filteredScreens = screens.filter(screen => screen.name !== 'Home');
  
  const renderScreenItem = ({ item }) => { 
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(item.name, { screenName: item.name })}
      >
        <Text style={styles.buttonText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredScreens}
        keyExtractor={(item) => item.id}
        renderItem={renderScreenItem}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#222831',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#222831',
    fontSize: 18,
  },
});

export default HomeScreen;
