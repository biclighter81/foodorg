import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Text } from "../components/ui/text";
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "expo-router";

export default function RecipeScanner() {

    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const camRef = useRef<CameraView>(null);
    const nav = useNavigation()
    const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(undefined);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function takePhoto() {
        if (!camRef.current) {
            return;
        }
        camRef.current.takePictureAsync().then(setPhoto)
    }

    useEffect(() => {
        console.log('fetching health')
        fetch('http://7.32.34.209:3000/health').then(res => res.json()).then(console.log) //this is my device ip!
    }, [])

    const navigate = (...params: any) => nav.navigate(...params as never)
    async function uploadPhoto() {
        if (!photo) return;
        setLoading(true);
        const formData = new FormData();

        // Append the Blob to FormData with a proper name and type
        formData.append('image', { uri: photo.uri, name: 'image.jpg', type: 'image/jpeg' } as any);
        try {
            const res = await fetch('http://7.32.34.209:3000/scan-recipe', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await res.json();
            const { recipe } = data;
            navigate('add_recipe', { recipe })
        } catch (error) {
            console.error('Error uploading photo:', error);

        } finally {
            setLoading(false);
        }
    }


    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View >
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission}><Text>Grant permissions</Text></Button>
            </View>
        );
    }

    return <View style={styles.container}>
        {
            photo ?
                <View style={styles.container}>
                    <View style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 48, zIndex: 10 }} className="flex flex-col justify-end">
                        <Button onPress={uploadPhoto}><Text>Use Photo</Text></Button>
                        <Button variant={'outline'} className="mt-4" onPress={() => {
                            setPhoto(undefined)
                        }}><Text>Retake Photo</Text></Button>
                    </View>
                    <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
                </View>
                :
                <CameraView style={styles.camera} facing={facing} ref={camRef}>
                    <View className="flex flex-col items-center justify-end h-full pb-12 px-4">
                        <Button className="w-full" variant='secondary' onPress={toggleCameraFacing} disabled={loading}><Text>Flip Camera</Text></Button>
                        <Button className="w-full mt-4" onPress={takePhoto} disabled={loading}><Text>Take photo</Text></Button>
                    </View>
                </CameraView>
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 64,
        marginHorizontal: 16,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});