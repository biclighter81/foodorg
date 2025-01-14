import { useNavigation } from "@react-navigation/native";
import { fetchUserInfoAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from "react";
import { Image, Platform, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";

export default function Login() {
    const discovery = useAutoDiscovery('https://keycloak.rimraf.de/realms/RIMRAF_TEST');
    const { setAuth, setUserInfo } = useAuth()
    const [request, result, promptAsync] = useAuthRequest(
        {
            clientId: 'foodorg-app',
            redirectUri: makeRedirectUri({
                scheme: 'foodorg',
            }),
            responseType: 'token',
            scopes: ['openid', 'profile'],
        },
        discovery
    );

    const nav = useNavigation()
    useEffect(() => {
        if (result && result.type == 'success') {
            fetchUserInfoAsync({ accessToken: result.params.access_token }, { userInfoEndpoint: discovery?.userInfoEndpoint }).then((userinfo) => {
                if (Platform.OS != 'web') {
                    SecureStore.setItemAsync('userinfo', JSON.stringify(userinfo))
                    setUserInfo(userinfo)
                }
            })
            const auth = result.params;
            const storageValue = JSON.stringify(auth);

            if (Platform.OS != 'web') {
                SecureStore.setItemAsync('auth', storageValue);
                setAuth(auth)
            }
            nav.navigate('dash' as never)
        }
    }, [result]);

    return <View className="flex flex-col items-center justify-between mt-12 h-full p-2">
        <View className="flex flex-col items-center mb-8">
            <Text className="text-4xl font-bold">Login</Text>
            <Text className="text-sm text-gray-800">Melde dich an um <Text className="text-[#17CF97] font-semibold">foodorg.</Text> kennenzulernen.</Text>
        </View>
        <Image source={require('~/assets/undraw_authentication_tbfc.png')} style={{ height: 200, width: 150 }} />
        <View className="flex-grow w-full flex flex-col justify-end mb-32">
            <Button onPress={() => promptAsync()}>
                <Text>Anmelden</Text>
            </Button>
            <Button variant={'outline'} onPress={() => promptAsync()} className="mt-2">
                <Text>Als Gast fortfahren</Text>
            </Button>
        </View>
    </View>
}