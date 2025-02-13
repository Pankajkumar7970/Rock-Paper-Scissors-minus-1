import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import StartGame from "./screens/StartGame";
import WaitingScreen from "./screens/WaitingScreen";
import GameScreen from "./screens/GameScreen";
import EndGameScreen from "./screens/EndGameScreen";
import { SafeAreaView /* , Platform  */ } from "react-native";
import { BackHandler } from "react-native";
import { useEffect } from "react";
// import * as ScreenOrientation from "expo-screen-orientation";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);
    // if (Platform.OS === "web") {
    //   //     ScreenOrientation.lockPlatformAsync(
    //   //       ScreenOrientation.WebOrientationLock.LANDSCAPE
    //   //     );
    // }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={StartGame} />
          <Stack.Screen name="Waiting" component={WaitingScreen} />
          <Stack.Screen name="GameScreen" component={GameScreen} />
          <Stack.Screen name="EndGame" component={EndGameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
