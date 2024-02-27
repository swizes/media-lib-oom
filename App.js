import { StatusBar } from 'expo-status-bar';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import {getAlbumPickerItems} from "./pickerUtils";
import * as MediaLibrary from "expo-media-library";



const renderItem = ({item}) => {
    return (
        <View style={{borderWidth:1, padding:5,margin:5,flexDirection:'row',alignItems:'center'}}>
            <Image source={{uri:item.image}} style={{width:100,height:100}}/>
            <Text>{item.title}</Text>
        </View>
    )
}

export default function App() {
    const [albums,setAlbums] = useState([])
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    useEffect(() => {
        if(permissionResponse?.granted){
            getAlbumPickerItems(['photo','video']).then(res => {
                setAlbums(res)
            })
        } else {
            requestPermission()
        }

    }, [requestPermission,permissionResponse?.granted]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
        <FlatList data={albums} renderItem={renderItem} contentContainerStyle={{
            paddingVertical:20,
        }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
