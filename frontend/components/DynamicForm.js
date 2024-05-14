import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Switch,
  Button
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { getValidationRules } from '../utils/validationRules';
import { evaluateCondition } from '../utils/evaluateCondition';

const DynamicForm = ({ schema, visibility, onSubmit }) => {
  const { control, watch, handleSubmit, formState: { errors } } = useForm();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [queryResults, setQueryResults] = useState({});
  const [error, setError] = useState(null);

  const fieldValues = watch();

  const handleLookupClick = async (key) => {
    const results = { ...queryResults }
    const field = schema[key];
    if (field.dynamicLookup) {
      const modelName = field.lookupValues.model;
      const fieldName = field.lookupValues.fieldName;
      const watchedField = field.lookupValues.watchedField;
      const watchedFieldValue = fieldValues[watchedField] ?? null;
      const operator = field.lookupValues.operator;
  
      try {
        let url = ''
        if (watchedField && operator && watchedFieldValue) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/m/${modelName}?fieldName=${fieldName}&watchedField=${watchedField}&watchedFieldValue=${watchedFieldValue}&operator=${operator}`;
        } else {
          url = `${process.env.EXPO_PUBLIC_API_URL}/m/${modelName}?fieldName=${fieldName}`;
        }
        const response = await axios.get(url);
        results[key] = response.data.data;
      } catch (error) {
        console.error("Error fetching data for key:", key, error);
        setError("Error fetching data.");
      }
    }
    setQueryResults(results);
    console.log('results', results);
  };

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  const toggleDatepicker = () => {
    setDatePickerVisible(!datePickerVisible);
  }

  const renderField = (key, field) => {
    const validationRules = getValidationRules(field);
  
    let isVisible = true;
    if (visibility) {      
      visibility.forEach(obj => {
        if (obj.field == key) {
          const watchedFieldValue = obj.watchedFieldValue;
          const watchedField = obj.watchedField;
          const operator = obj.operator;
          const fieldValue = fieldValues[watchedField];

          isVisible = isVisible && evaluateCondition(watchedFieldValue, operator, fieldValue);
        }
      })
    }

    if (!isVisible) return null;
 
    let inputComponent;
    switch (field.type) {
      case 'TEXT':
        if (field.lookup) {
          inputComponent = (
            <View style={styles.fieldContainer}>
            <Controller
              control={control} 
              name={key}
              rules={validationRules}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value || ''}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  {field.lookupValues?.map((option, idx) => (
                    <Picker.Item
                      key={idx}
                      label={option}
                      value={option}
                    />
                  ))}
                </Picker>
              )}
            />
            </View>
          );
        } else if (field.dynamicLookup) {
          return (
            <>
            <Text style={styles.label}>{key}</Text>
            <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name={key}
              rules={validationRules}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value || ''}
                  onValueChange={onChange}
                  style={{ borderColor: errors[key] ? 'red' : 'black', borderWidth: 1 }}
                  onFocus={() => handleLookupClick(key)}
                >
                  {queryResults[key]?.map((option, idx) => {
                    const values = Object.values(option);
                    return (
                      <Picker.Item key={idx} label={values[0]} value={values[0]} />
                    );
                  })}
                </Picker>
              )}
            />
            </View>
            </>
          );
        } else {
          inputComponent = (
            <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name={key}
              rules={validationRules}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors[key] && styles.inputError,
                  ]}
                  placeholder={key}
                  onChangeText={onChange}
                  keyboardType={key === 'email' ? 'email-address' : 'default'}
                  value={value || ''}
                />
              )}
            />
            </View>
          );
        }
        break;

      case "INTEGER":
        inputComponent = (
          <View style={styles.fieldContainer}>
          <Controller
            control={control}
            name={key}
            rules={validationRules}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors[key] && styles.inputError,
                ]}
                placeholder={key}
                onChangeText={(val) => onChange(parseInt(val, 10))}
                keyboardType="numeric"
                value={value ? value.toString() : ''}
              />
            )}
          />
          </View>
        )
        break;

        case 'DATETIME':
            inputComponent = (
              <View style={styles.fieldContainer}>
                <Controller
                control={control}
                name={key}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    {Platform.OS === 'ios' && (
                      <DateTimePicker
                        value={value || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || value;
                          onChange(currentDate);
                          setDatePickerVisible(false);
                        }}
                      />
                    )}
                    {Platform.OS === 'android' && (
                      <View>
                        <TouchableOpacity onPress={toggleDatepicker} style={styles.dateButton}>
                          <Text style={styles.dateText}>{value ? value.toDateString() : "Select Date"}</Text>
                        </TouchableOpacity>
                        {datePickerVisible && (
                          <DateTimePicker
                            value={value || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              const currentDate = selectedDate || value;
                              onChange(currentDate);
                              setDatePickerVisible(false);
                            }}
                          />
                        )}
                      </View>
                    )}
                  </View>
                  )}
                />
            </View>
            );
            break;
        
        case 'BOOLEAN':
          inputComponent = (
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name={key}
                rules={validationRules}
                render={({ field: { onChange, value } }) => (
                <View style={styles.switchContainer}>
                  <Switch
                    value={!!value}
                    onValueChange={onChange}
                  />
                </View>
              )}
              />
            </View>
          );
          break;
        
        case 'DECIMAL':
          inputComponent = (
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name={key}
                rules={validationRules}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors[key] && styles.inputError,
                    ]}
                    placeholder={key}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    value={value ? value.toString() : ''}
                  />
                )}
              />
            </View>
          );
          break;

      default:
        inputComponent = <Text>Unsupported field type</Text>;
        break;
    }

    return (
      <View key={key}>
        <Text style={styles.label}>{key}</Text>
        {inputComponent}
        {errors[key] && <Text style={styles.errorText}>{errors[key]?.message}</Text>}
      </View>
    );
  };

  return (
    <ScrollView>
    <View style={styles.container}>
    {Object.entries(schema).map(([key, field]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        return renderField(key, field);
      }
    })}
    <TouchableOpacity
      style={styles.submitButton}
      onPress={handleSubmit(onSubmit)}
    >
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: 'white',
    borderRadius: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    color: 'black'
  },
  inputError: {
    borderColor: 'red',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 4
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    textAlign: 'left'
  },
});

export default DynamicForm;
