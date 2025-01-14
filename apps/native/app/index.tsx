import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import * as SecureStore from 'expo-secure-store';
import { View } from 'react-native';
import { Input } from '~/components/ui/input';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '~/hooks/useAuth';


export default function Dash() {
    const { userinfo } = useAuth()
    const nav = useNavigation()

    if (!userinfo) {
        return <Text>Loading...</Text>
    }

    return <View className='p-4'>
        <Text className="text-4xl font-black">Hey <Text className='text-[#17CF97] text-4xl'>{userinfo.given_name}</Text>,</Text>
        <Text className="text-gray-600 font-bold">check out the latest <Text className='text-[#17CF97]'>recipes</Text> and <Text className='text-[#17CF97]'>meal plans!</Text></Text>

        <View className='flex space-x-2 justify-between h-[90%]'>
            <View className='flex-grow'>
                <Input placeholder='Search for recipes' className='mt-4' />
            </View>
            <Button onPress={() => { nav.navigate('add_recipe' as never) }}><Text>Create recipe</Text></Button>
        </View >
    </View>
}