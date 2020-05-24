import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, AsyncStorage, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  function codeToSixDigits(code) {
    while(code.length < 6) {
      code = `0${code}`;
    }
    return code;
  }
  async function saveStorage(code) {
    code = codeToSixDigits(code);
    try{
      const estoque = await AsyncStorage.getItem('estoque');
      if(estoque === null){
        console.log('estoque é null');
        
        await AsyncStorage.setItem('estoque', `${code}\n`);
      } else{
        const novoEstoque = `${estoque}${code}\n`
        console.log('novo estoque:', novoEstoque);
        await AsyncStorage.setItem('estoque', novoEstoque);
      }
    }catch(err){
      console.log('ERRORRRR:', err)
    }
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if(Alert.alert(
      `Confirmação`,
      `Código: ${data}`,
      [
        { text: 'Cancelar!', onPress: () => console.log('cancelado'), style: 'cancel',},
        { text: 'Ok!', onPress: () => saveStorage(data)}
      ]
    ));
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={'Clique para scanear o próximo produto'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
