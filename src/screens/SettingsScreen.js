import React, { useState, useEffect } from 'react';
import { Text, ScrollView, AsyncStorage, TouchableOpacity, TextInput, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import { codeToSixDigits } from '../helpers';
import api from '../services/api';
import { withNavigationFocus } from 'react-navigation';
import Layout from '../constants/Layout';

function SettingsScreen({ isFocused }) {
  const [lastAltered, setLastAltered] = useState('');
  const [changed, setChanged] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused === true) {
      getEstoque();
    }
  }, [isFocused]);

  async function getEstoque() {
    setLoading(true);
    const estoque = await AsyncStorage.getItem('estoque');
    if(estoque) {
      const [last] = estoque.split('\n').slice(-2, -1);
      setLastAltered(last);
      setChanged(last);
    }
    setLoading(false);
    return estoque;
  }

  async function clearEstoque() {
    setLoading(true);
    await AsyncStorage.removeItem('estoque');
    setChanged('');
    setLastAltered('');
    setLoading(false);
  }

  function handleSaveButton() {  
    const fixedCode = codeToSixDigits(changed);
    if(Alert.alert(
      `Confirmação`,
      `Alterando para o código: ${fixedCode}`,
      [
        { text: 'Cancelar!', onPress: () => setChanged(lastAltered), style: 'cancel',},
        { text: 'Ok!', onPress: () => saveStorage(fixedCode)}
      ]
    ));
  }

  function handleClearButton() {  
    if(Alert.alert(
      `Confirmação`,
      `Tem certeza que deseja excluir o estoque coletado?`,
      [
        { text: 'Não', onPress: () => false, style: 'cancel',},
        { text: 'Sim, Excluir!', onPress: () => clearEstoque()}
      ]
    ));
  }
  function handleSendToServerButton() {
    if(Alert.alert(
      `Confirmação`,
      `Tem certeza que deseja enviar estoque pro servidor?`,
      [
        { text: 'Não', onPress: () => false, style: 'cancel' },
        { text: 'ENVIAR', onPress: () => sendToServer()}
      ]
    ));
  }
  function handleRemoveButton() {  
    if(Alert.alert(
      `Confirmação`,
      `Tem certeza que deseja excluir o último item inserido?`,
      [
        { text: 'Não', onPress: () => false, style: 'cancel',},
        { text: 'Sim, Excluir!', onPress: () => removeLastItem()}
      ]
    ));
  }

  async function saveStorage(fixedCode) {
    setLoading(true);
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      const arrEstoque = estoque.split('\n');
      arrEstoque[arrEstoque.length - 2] = fixedCode;
      const novoEstoque = arrEstoque.join('\n');
      await AsyncStorage.setItem('estoque', novoEstoque);
      setLastAltered(fixedCode);
      setLoading(false);
    }catch(err){
      setLoading(false);
      Alert.alert(
        'Erro tentando salvar!',
        err.message,
      )
    }
  }

  async function removeLastItem() {
    setLoading(true);
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      const arrEstoque = estoque.split('\n');
      setLastAltered(arrEstoque[arrEstoque.length - 3]);
      setChanged(arrEstoque[arrEstoque.length - 3]);
      const novoEstoque = arrEstoque.slice(0, -2).join('\n');
      await AsyncStorage.setItem('estoque', `${novoEstoque}\n`);
      setLoading(false);
    }catch(err){
      Alert.alert(
        'Erro tentando remover último ítem!',
        err.message,
      )
      setLoading(false);
    }
  }

  async function sendToServer() {
    setLoading(true);
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      const project = await AsyncStorage.getItem('project');
      const user = await AsyncStorage.getItem('user');
      const response = await api.post('save', {
        estoque,
        project,
        user
      });
      if (response.status === 200) {
        Alert.alert(
          'OK!',
          'Estoque salvo no servidor',
          [
            {text: 'ok', onPress: () => clearEstoque()}
          ]
        )
      } else {
        throw Error('Erro ao salvar estoque no servidor')
      }
      setLoading(false);
    } catch (err) {
      console.log('err.......')
      console.log(err);
      setLoading(false);
      Alert.alert(
        'Erro!',
        'Estoque NÃO foi salvo no servidor',
      )
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large"/>
      </View>
    )
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text>Último código: </Text>
        <TextInput style={styles.lastCodesTI} keyboardType="numeric" value={changed} maxLength={6} onChangeText={(text) => setChanged(text)}/>
      </View>
      {changed !== lastAltered && (
        <TouchableOpacity style={styles.buttons} onPress={() => handleSaveButton()}>
          <Text>Salvar acima</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleRemoveButton} style={styles.buttons}><Text style={styles.textButton}>Excluir último código!</Text></TouchableOpacity>
      <TouchableOpacity onPress={handleSendToServerButton} style={styles.buttons}><Text style={styles.textButton}>Enviar para servidor!</Text></TouchableOpacity>
      <TouchableOpacity onPress={handleClearButton} style={styles.buttons}><Text style={styles.textButton}>Limpar estoque gravado!</Text></TouchableOpacity>
    </ScrollView>
  );
}

export default withNavigationFocus(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  lastCodesTI: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 3,
    margin: 10,
    width: 100
  },
  buttons: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#D0D0D0',
    margin: 10,
    width: '80%',
    alignSelf: 'center',
    padding: 8,
  },
  textButton : {
    color: 'blue',
  },
  loading: {
    flex: 1,
    height: Layout.window.height,
    justifyContent: "center",
  }
})

