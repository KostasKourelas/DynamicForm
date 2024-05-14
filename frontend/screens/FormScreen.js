import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, ActivityIndicator, View, Text, Alert } from 'react-native';
import DynamicForm from '../components/DynamicForm';

const FormScreen = ({ route, navigation }) => {
const [attributeSchema, setAttributeSchema] = useState('');
const [visibility, setVisibility] = useState('');
const { screenName } = route.params;

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/m/${screenName}`)
        setAttributeSchema(response.data.attributeTypes)
        setVisibility(response.data.visibility)
      } catch (err) {
        console.log('Error:', err.message);
      }
    };

    fetchData();
  }, []); 
 
  const handleFormSubmit = async (formData) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/m/${screenName}`, formData);
      console.log("Form submitted with:", formData);
      Alert.alert(
        "Success",
        "Form submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('Home'),
          }
        ]
      );
    } catch (err) {
      console.error("Error during form submission:", err.message);
      Alert.alert("Error", "Form submission failed. Please try again.");
    }
  };
 
  if (attributeSchema === null) {
    return (
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <DynamicForm schema={attributeSchema} visibility={visibility} onSubmit={handleFormSubmit} />
    </SafeAreaView>
  );
};


export default FormScreen;
