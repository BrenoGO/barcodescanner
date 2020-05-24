import React, { useState, useEffect } from 'react';
import { Text, ScrollView, AsyncStorage, TouchableOpacity, TextInput, StyleSheet, Alert, View } from 'react-native';
import api from '../services/api';

export default function SettingsScreen() {
  const [lastAltered, setLastAltered] = useState('');
  const [changed, setChanged] = useState('');

  useEffect(() => {
    getEstoque();
  }, []);

  async function getEstoque() {
    const estoque = await AsyncStorage.getItem('estoque');
    console.log('estoque:', estoque);
    if(estoque) {
      const [last] = estoque.split('\n').slice(-2, -1);
      setLastAltered(last);
      setChanged(last);
    }
    return estoque;
  }

  async function clearEstoque() {
    await AsyncStorage.removeItem('estoque');
    setChanged('');
    setLastAltered('');
  }

  function codeToSixDigits() {
    let newCode = changed;
    while(newCode.length < 6) {
      newCode = `0${newCode}`;
    }
    setChanged(newCode);
    return newCode;
  }

  function handleSaveButton() {  
    const fixedCode = codeToSixDigits();
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
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      const arrEstoque = estoque.split('\n');
      arrEstoque[arrEstoque.length - 2] = fixedCode;
      const novoEstoque = arrEstoque.join('\n');
      console.log('novo estoque:', novoEstoque);
      await AsyncStorage.setItem('estoque', novoEstoque);
      setLastAltered(fixedCode);
    }catch(err){
      console.log('ERRORRRR:', err)
    }
  }

  async function removeLastItem() {
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      const arrEstoque = estoque.split('\n');
      setLastAltered(arrEstoque[arrEstoque.length - 3]);
      setChanged(arrEstoque[arrEstoque.length - 3]);
      const novoEstoque = arrEstoque.slice(0, -2).join('\n');
      console.log('novoEstoque');
      console.log(novoEstoque);
      await AsyncStorage.setItem('estoque', `${novoEstoque}\n`);
    }catch(err){
      console.log('ERROR trying remove last item:', err)
    }
  }

  async function sendToServer() {
    try{
      console.log('in sendToServer!')
      const estoque = await AsyncStorage.getItem('estoque');
      console.log('estoque', estoque);
      const response = await api.post('/sendData', {estoque});
      console.log('response', response);
      if (response.status === 200) {
        console.log('tudo ok!');
        Alert.alert(
          'OK!',
          'Estoque salvo no servidor',
          [
            {text: 'ok', onPress: () => clearEstoque()}
          ]
        )
      } 
    } catch (err) {
      console.log('Error trying to send estoque: ', err);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={getEstoque} style={styles.buttons}><Text style={styles.textButton}>Verificar último código inserido</Text></TouchableOpacity>
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

SettingsScreen.navigationOptions = {
  title: 'app.json',
};

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
  }
})
