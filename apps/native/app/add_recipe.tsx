import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Recipe } from "~/types/Recipe";

export default function AddRecipe({ route }: { route: { params: { recipe: Recipe } | undefined } }) {
    const [tab, setTab] = useState('ingredients');
    const [recipe, setRecipe] = useState<Recipe>(
        route.params?.recipe || {
            name: '',
            ingredients: [{ name: '', amount: '', unit: '' }],
            method: [],
        } as Recipe
    );
    const nav = useNavigation();

    const amountRegex = /^\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*$/;

    const handleIngredientChange = (index: number, field: 'name' | 'amount' | 'unit', value: string) => {
        const updatedIngredients = [...recipe.ingredients];
        if (field === 'amount') {
            const match = value.match(amountRegex);
            if (match) {
                updatedIngredients[index].amount = match[1];
                updatedIngredients[index].unit = match[2];
            } else {
                updatedIngredients[index].amount = value; // Preserve the original input if it doesn't match
                updatedIngredients[index].unit = '';
            }
        } else {
            updatedIngredients[index][field] = value;
        }
        setRecipe({ ...recipe, ingredients: updatedIngredients });
    };
    const dismissKeyboard = () => Keyboard.dismiss();

    useEffect(() => {
        // Add a new ingredient if the last one is not empty
        if (recipe.ingredients[recipe.ingredients.length - 1].name) {
            setRecipe({
                ...recipe,
                ingredients: [...recipe.ingredients, { name: '', amount: '', unit: '' }],
            });
        }
        // Remove the last ingredient if the second-to-last one is empty
        if (recipe.ingredients.length > 1 && !recipe.ingredients[recipe.ingredients.length - 2].name) {
            setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.slice(0, -1),
            });
        }
    }, [recipe.ingredients]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View className="p-4">
                        <Text className="text-4xl font-black">
                            Add a new <Text className="text-[#17CF97] text-4xl">recipe.</Text>
                        </Text>
                        <Text className="text-gray-600 font-bold">Fill out the form below to add a new recipe.</Text>
                        <View className="flex space-x-2 justify-between mt-4">
                            <View className="flex-grow flex">
                                <Label className="uppercase font-bold">Recipe name</Label>
                                <Input
                                    placeholder="Recipe name"
                                    value={recipe.name}
                                    onChangeText={(text) => setRecipe({ ...recipe, name: text })}
                                />
                                <Tabs
                                    value={tab}
                                    onValueChange={setTab}
                                    className="w-full gap-1.5 flex-col mx-auto mt-4 flex-grow pb-4"
                                >
                                    <TabsList className="flex-row w-full">
                                        <TabsTrigger value="ingredients" className="flex-1">
                                            <Text>Ingredients</Text>
                                        </TabsTrigger>
                                        <TabsTrigger value="method" className="flex-1">
                                            <Text>Method</Text>
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="ingredients" className="flex-grow">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <View
                                                className="flex-row justify-between items-center mt-2"
                                                key={index}
                                            >
                                                <Input
                                                    placeholder="Qnt."
                                                    className="w-[25%]"
                                                    onChangeText={(text) =>
                                                        handleIngredientChange(index, 'amount', text)
                                                    }
                                                    value={ingredient.amount + ingredient.unit}
                                                />
                                                <Input
                                                    placeholder="Ingredient"
                                                    className="w-[70%]"
                                                    onChangeText={(text) =>
                                                        handleIngredientChange(index, 'name', text)
                                                    }
                                                    value={ingredient.name}
                                                />
                                            </View>
                                        ))}
                                    </TabsContent>
                                    <TabsContent value="method" className="flex-grow">
                                        <Text>{JSON.stringify(recipe.method)}</Text>
                                    </TabsContent>
                                </Tabs>
                            </View>

                            <View>
                                <Button
                                    onPress={() => nav.navigate('scan_recipe' as never)}
                                    variant="outline"
                                >
                                    <Text>Scan an image</Text>
                                </Button>
                                <Button className="mb-8 mt-4">
                                    <Text>Add recipe</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
