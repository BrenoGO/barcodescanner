import React, { useState } from 'react';
import { Text, Keyboard, ScrollView, StyleSheet, AsyncStorage, Alert, TextInput, TouchableWithoutFeedback, TouchableOpacity, View } from 'react-native';

export default function FieldScreen() {
  const [code, setCode] = useState('');
  const [qt, setQt] = useState('1');
  const [loading, setLoading] = useState('');

  function codeToSixDigits() {
    let newCode = code;
    while(newCode.length < 6) {
      newCode = `0${newCode}`;
    }
    setCode(newCode);
    return newCode;
  }

  function handleTextChange(text) {
    if(text.match(/^\d+$/)) {
      setCode(text);
    }
  }

  async function handleButtonClick() {  
    const fixedCode = codeToSixDigits();
    if(Alert.alert(
      `Confirmação`,
      `Código: ${fixedCode}${+qt != 1 ? '. Qtd: '+qt : ''}`,
      [
        { text: 'Cancelar!', onPress: () => console.log('cancelado'), style: 'cancel',},
        { text: 'Ok!', onPress: () => saveStorage(fixedCode)}
      ]
    ));
  }

  async function saveStorage(fixedCode) {
    setLoading(true);
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      let novoEstoque = estoque || '';
      if(+qt > 1) {
        const codes = `${fixedCode}\n`.repeat(+qt);
        novoEstoque = `${novoEstoque}${codes}`;
      } else if (+qt !== 1) {
        Alert.alert(
          'Erro',
          'Quantidade deve ser 1 ou mais',
          [
            { text: 'Fechar e ajustar...' }
          ]
        )
        return;
      } else { // qt == 1
        novoEstoque = `${novoEstoque}${fixedCode}\n`;
      }
      await AsyncStorage.setItem('estoque', novoEstoque);
      Keyboard.dismiss();
      setCode('');
      setLoading(false);
      setQt('1');
    }catch(err){
      console.log('ERRORRRR:', err)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container}>
        <View style={styles.containerContent}>
          <Text>  
            Digite o código no campo abaixo:
          </Text>
          <TextInput
            style={{borderColor: 'black', borderWidth: 2, padding: 3, margin: 10, width: 100}}
            value={code}
            maxLength={6}
            keyboardType="number-pad"
            onChangeText={text => handleTextChange(text)}
          />
          <Text>  
            Quantidade:
          </Text>
          <TextInput
            style={{borderColor: 'black', borderWidth: 2, padding: 3, margin: 10, width: 100}}
            value={qt}
            maxLength={2}
            keyboardType="number-pad"
            onChangeText={val => setQt(val)}
          />
          <TouchableOpacity style={styles.buttons} onPress={handleButtonClick}>
            <Text style={styles.textButton}>Salvar código</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  containerContent: {
    alignItems: 'center'
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