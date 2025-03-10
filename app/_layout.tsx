// import {
//   DarkTheme as NavigationDarkTheme,
//   DefaultTheme as NavigationDefaultTheme,
//   ThemeProvider as NavigationThemeProvider,
// } from "@react-navigation/native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { Provider } from "react-redux";
// import { PaperProvider } from "react-native-paper";
// import store from "@/features/strore";
// import { darkTheme, lightTheme } from "@/constants/theme";
// import "../global.css";
// import { View } from "react-native";
// import { useEffect, useState } from "react";

// //  import * as SplashScreen from 'expo-splash-screen';

// //  SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme(); // Get the system's color scheme (light or dark)

//   const [appIsReady, setAppIsReady] = useState(false);

//   useEffect(() => {
//     const prepareApp = async () => {
//       try {
//         // Reduce timeout to minimize blank screen time
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       } catch (error) {
//         console.warn("Error during app initialization:", error);
//       } finally {
//         setAppIsReady(true);
//         // Make sure to hide splash screen AFTER the state update
//         SplashScreen.hideAsync().catch(console.warn);
//       }
//     };

//     prepareApp();
//   }, []);

//   // Return a loading placeholder instead of null
//   if (!appIsReady) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colorScheme === "dark" ? "#000" : "#fff" }} />
//     );
//   }

//   // Use appropriate themes based on the color scheme
//   const navigationTheme =
//     colorScheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme;
//   const paperTheme = colorScheme === "dark" ? darkTheme : lightTheme;

//   return (
//     <Provider store={store}>
//       <PaperProvider theme={paperTheme}>
//         <NavigationThemeProvider value={navigationTheme}>
//           <View
//             className={`flex-1 ${
//               colorScheme === "dark"
//                 ? "dark bg-background-dark"
//                 : "light bg-background-light"
//             }`}
//           >
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="index" options={{ headerShown: false }} />
//               <Stack.Screen name="auth" options={{ headerShown: false }} />
//               <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             </Stack>
//             <StatusBar
//               style={colorScheme === "dark" ? "light" : "dark"}
//               backgroundColor={
//                 colorScheme === "dark"
//                   ? paperTheme.colors.background
//                   : paperTheme.colors.background
//               }
//             />
//           </View>
//         </NavigationThemeProvider>
//       </PaperProvider>
//     </Provider>
//   );
// }

import { Stack } from "expo-router";
//  import "@/global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
