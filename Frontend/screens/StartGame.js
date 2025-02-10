import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFonts } from "expo-font";
import ModalWindow from "../components/ModalWindow";
import BackgroundGradient from "../components/BackgroundGradient";
import { socket } from "../socket";

export default function StartGame() {
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, error] = useFonts({
    Angelos: require("../assets/Angelos.ttf"),
  });

  function playButtonHandler() {
    setIsVisible(true);
  }

  useEffect(() => {
    if (socket.connected) {
      console.log("connection");
    }
  }, []);
  if (!loaded) return <ActivityIndicator />;
  return (
    <BackgroundGradient>
      <ModalWindow visible={isVisible} setVisibility={setIsVisible} />
      {!isVisible && (
        <View style={styles.outerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Rock, Paper and Scissors - 1</Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/bg.webp")}
                style={styles.image}
              ></Image>
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Play Game"
                  color={"red"}
                  onPress={playButtonHandler}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Settings" color={"red"} />
              </View>
            </View>
          </View>
        </View>
      )}
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    marginTop: 16,
    // backgroundColor: "white",
  },
  titleContainer: {
    flex: 3,
    alignItems: "center",
    // backgroundColor: "red",
  },
  title: {
    fontSize: 36,
    fontFamily: "Angelos",
    color: "#f2f8fc",
  },
  innerContainer: {
    flexDirection: "row",
    flex: 13,
    marginBottom: 30,
  },
  buttonsContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 85,
    // backgroundColor: "black",
    // paddingVertical: 130,
  },
  image: {
    height: 199,
    width: 311,
  },
  imageContainer: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    // backgroundColor: "black",
    alignItems: "center",
  },
  buttonContainer: {
    width: 150,
    borderRadius: 6,
    overflow: "hidden",
    marginVertical: 6,
  },
});
