import { Image, StyleSheet, View } from "react-native";

const style = StyleSheet.create({
    image: {
        width: 120,
        resizeMode: "contain",
    },
})

export default function AppHeader() {
    return <Image source={require("assets/foodorg_logo.png")} style={style.image} />;
}