import '~/global.css';

import { Theme, ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import AppHeader from '~/components/app/Header';
import Login from './login';
import { useFonts } from '@expo-google-fonts/inter';
import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_900Black } from '@expo-google-fonts/montserrat'
import Dash from './index';
import AddRecipe from './add_recipe';
import RecipeScanner from './scan_recipe';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '~/hooks/useAuth';


const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
    const hasMounted = React.useRef(false);
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_900Black
    })

    const [userinfo, setUserInfo] = React.useState<any>(null)
    const [auth, setAuth] = React.useState<any>(null)
    React.useEffect(() => {
        SecureStore.getItemAsync('userinfo').then((userinfo) => userinfo && setUserInfo(JSON.parse(userinfo)))
        SecureStore.getItemAsync('auth').then((auth) => auth && setAuth(JSON.parse(auth)))
    }, [])

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }

        if (Platform.OS === 'web') {
            // Adds the background color to the html element to prevent white background on overscroll.
            document.documentElement.classList.add('bg-background');
        }
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    if (!isColorSchemeLoaded) {
        return null;
    }

    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={{
            userinfo,
            auth,
            setAuth,
            setUserInfo
        }}>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <Stack.Navigator screenOptions={{ headerTitle: () => <AppHeader /> }} initialRouteName='login'>
                    <Stack.Screen name='login' component={Login} />
                    <Stack.Screen name='dash' component={Dash} options={{ headerBackVisible: false }} />
                    <Stack.Screen name='add_recipe' component={AddRecipe as any} options={{ headerBackVisible: false }} />
                    <Stack.Screen name='scan_recipe' component={RecipeScanner} options={{ headerBackVisible: false }} />
                </Stack.Navigator>
            </ThemeProvider>
        </AuthContext.Provider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;