import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text /* , Platform  */, View } from "react-native";
import Default from "./Default";
import App from "./App";
import TicTacToe from "./Tic-Tac-Toe/app/index";

const Stack = createNativeStackNavigator();

export default function dummy() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Default} />
          <Stack.Screen name="RPS" component={App} />
          <Stack.Screen name="TTT" component={TicTacToe} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
