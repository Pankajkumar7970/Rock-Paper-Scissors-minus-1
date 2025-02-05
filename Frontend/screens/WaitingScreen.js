import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { socket } from "../socket";

export default function WaitingScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [waitingTime, setWaitingTime] = useState(0);

  useEffect(() => {
    isFocused &&
      setInterval(() => {
        setWaitingTime((cur) => cur + 1);
      }, 1000);
  }, [isFocused]);

  socket.on("startGame", (playersData) => {
    navigation.navigate("GameScreen", playersData);
  });

  return (
    <View style={styles.root}>
      <ActivityIndicator size={60} color={"red"} style={styles.loader} />
      <View style={styles.container}>
        <Text style={styles.waitingText}>
          ({waitingTime}) Waiting for an Opponent.....
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            color={"red"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#342E37",
  },
  loader: {
    flex: 5,
    paddingTop: 35,
  },
  waitingText: {
    color: "#bbbbbb",
    alignSelf: "center",
    fontSize: 17,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  container: {
    flex: 2,
  },
});
