import React, { useState } from 'react';
import { Text, StyleSheet, AsyncStorage, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';

export default function Welcome({ navigation }) {
  Welcome.navigationOptions = {
    header: null,
  }
  const [project, setProject] = useState('Agito');
  const [user, setUser] = useState('');
  const [errors, setErrors] = useState({});

  const validator = () => {
    const newErrors = {};
    if (project.length === 0) {
      newErrors.project = 'Projeto não pode ser vazio';
    }
    if (user.length === 0) {
      newErrors.user = 'Nome não pode ser vazio';
    }
    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  }

  const handleContinue = async () => {
    if (validator()) {
      await AsyncStorage.setItem('project', project);
      await AsyncStorage.setItem('user', user);
      navigation.navigate('Main');
    }
  }

  return (
    <ScrollView>
    <KeyboardAvoidingView
      style={styles.container}
    >
      <Text style={styles.title}>Bem Vindo!</Text>
      <Text style={styles.fieldTitle}>Projeto</Text>
      <TextInput
        style={styles.textInput}
        value={project}
        onChange={e => setProject(e.nativeEvent.text)}
      />
      {errors.project && (<Text style={styles.errors}>{errors.project}</Text>)}
      <Text style={styles.fieldTitle}>Nome</Text>
      <TextInput
        style={styles.textInput}
        value={user}
        onChange={e => setUser(e.nativeEvent.text)}
        
      />
      {errors.user && (<Text style={styles.errors}>{errors.user}</Text>)}
      <TouchableOpacity 
        onPress={handleContinue}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  fieldTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    width: '90%',
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#111',
    maxHeight: 35,
    fontSize: 20
  },
  errors: {
    fontSize: 14,
    color: 'red',
    marginTop: -3,
  },
  button: {
    flex: 1,
    minHeight: 30,
    maxHeight: 60,
    backgroundColor: '#1669CD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 25,
    minWidth: 230,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  }
})