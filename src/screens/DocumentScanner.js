

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { FlashMode } from 'expo-camera/build/legacy/Camera.types';
import { useNavigation } from '@react-navigation/native';


export default function DocumentScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [flashOn, setFlashOn] = useState(false)
    const cameraRef = useRef()
    const navigation = useNavigation()

    const flashLightToggle = () => {
        setFlashOn(!flashOn)
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <TouchableOpacity
                    onPress={() => { requestPermission() }}
                    style={{ marginTop: 15, backgroundColor: "black", height: 40, alignSelf: "center", paddingHorizontal: 10, justifyContent: "center", borderRadius: 5 }}>
                    <Text style={{ textAlign: 'center', color: "white" }}>Grant permission</Text>
                </TouchableOpacity>

            </View>
        );
    }

    async function saveCamera() {
        if (cameraRef.current) {
            const { uri } = await cameraRef.current.takePictureAsync();
            let saveToGallery = await MediaLibrary.saveToLibraryAsync(uri)
        }

    }


    return (
        <View style={{ flex: 1 }}>

            <CameraView style={{ flex: 1 }} ref={cameraRef} flash={flashOn ? FlashMode.on : FlashMode.off} >
                <View style={{ flex: 1, position: "relative", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <TouchableOpacity style={{ borderRadius: 70, height: 45, width: 45, alignItems: 'center', justifyContent: 'center', alignSelf: "flex-start", marginLeft: 20, marginTop: 15 }} onPress={() => navigation.goBack()}>
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ borderRadius: 70, height: 45, width: 45, alignItems: 'center', justifyContent: 'center', alignSelf: "flex-end", marginRight: 20, marginTop: 15 }} onPress={() => flashLightToggle()}>
                            <MaterialIcons name={flashOn ? "flashlight-on" : "flashlight-off"} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, position: "relative", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity style={{ position: "absolute", bottom: 50, height: 60, width: 60, borderRadius: 999, borderColor: "white", borderWidth: 2, justifyContent: "center", alignItems: "center" }} onPress={() => { saveCamera() }}>
                            <Entypo name="camera" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}
