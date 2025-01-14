import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Recipe } from "~/types/Recipe";

export default function AddRecipe({ route }: { route: { params: { recipe: Recipe } | undefined } }) {
    const [tab, setTab] = useState('ingredients')
    const [recipe, setRecipe] = useState(route.params?.recipe || { name: '', ingredients: [], method: [] } as Recipe)
    const nav = useNavigation()
    return <View className='p-4'>
        <Text className="text-4xl font-black">Add a new <Text className="text-[#17CF97] text-4xl">recipe.</Text></Text>
        <Text className="text-gray-600 font-bold">Fill out the form below to add a new recipe.</Text>
        <View className='flex space-x-2 justify-between h-[90%] mt-4'>
            <View className='flex-grow flex'>
                <Label className="uppercase font-bold">Recipe name</Label>
                <Input placeholder='Recipe name' value={recipe.name} onChangeText={(text) => {
                    setRecipe({ ...recipe, name: text })
                }} />
                <Tabs value={tab} onValueChange={setTab} className="w-full gap-1.5 flex-col mx-auto mt-4 flex-grow pb-4">
                    <TabsList className="flex-row w-full">
                        <TabsTrigger value="ingredients" className="flex-1">
                            <Text>Ingredients</Text>
                        </TabsTrigger>
                        <TabsTrigger value="method" className="flex-1">
                            <Text>Method</Text>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={'ingredients'} className="flex-grow">
                        <Text>{JSON.stringify(recipe.ingredients)}</Text>
                    </TabsContent>
                    <TabsContent value={'method'} className="flex-grow">
                        <Text>{JSON.stringify(recipe.method)}</Text>
                    </TabsContent>
                </Tabs>
            </View>

            <View>
                <Button onPress={() => nav.navigate('scan_recipe' as never)}><Text>Scan an image</Text></Button>
                <Button variant='outline' className="mb-4"><Text>Add recipe</Text></Button>
            </View>
        </View >
    </View>
}