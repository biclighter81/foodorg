import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';
import { Input } from '~/components/ui/input';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '~/hooks/useAuth';
import { Recipe } from '~/types/Recipe';


export default function Dash() {
    const { userinfo, auth } = useAuth()
    const nav = useNavigation()
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        if (!auth) return
        console.log(auth)
        fetch('http://10.0.0.22:3000/recipes', {
            headers: {
                Authorization: `Bearer ${auth.access_token}`
            },
        }).then(res => res.json()).then((recipes: { _id: string, recipe: Recipe }[]) => {
            setRecipes(recipes.map(r => r.recipe))
        })
    }, [auth])

    if (!userinfo) {
        return <Text>Loading...</Text>
    }

    return <View className='p-4'>
        <Text className="text-4xl font-black">Hey <Text className='text-[#17CF97] text-4xl'>{userinfo.given_name}</Text>,</Text>
        <Text className="text-gray-600 font-bold">check out the latest <Text className='text-[#17CF97]'>recipes</Text> and <Text className='text-[#17CF97]'>meal plans!</Text></Text>

        <View className='flex space-x-2 justify-between h-[90%]'>
            <View className=''>
                <Input placeholder='Search for recipes' className='mt-4'
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>
            <View className='flex-grow'>
                {recipes.filter((r) => r.name.includes(searchTerm)).map((recipe, i) => <View key={i} className='flex flex-col p-4 bg-white rounded-lg border border-gray-300 even:mt-4'>
                    <Text className='text-xl font-bold'>{recipe.name}</Text>
                    <Text className='text-gray-600 mb-2'>{recipe.method[0]?.description}</Text>
                    <Button
                        onPress={() => console.log(recipe)}
                    ><Text>View recipe</Text></Button>
                </View>)}
            </View>
            <Button onPress={() => { nav.navigate('add_recipe' as never) }}><Text>Create recipe</Text></Button>
        </View >
    </View >
}