import { Button, Text, View, StyleSheet } from "react-native";
import BackgroundGradient from "../components/BackgroundGradient";
import ConfettiCannon from "react-native-confetti-cannon";

const EndGameScreen = ({ navigation, route }) => {
  const playerScore = route.params;
  // console.log(playerScore);
  function homeButtonHandler() {
    navigation.navigate("Home");
  }

  function replayButtonHandler() {}
  return (
    <BackgroundGradient>
      {playerScore === 3 && (
        <ConfettiCannon
          count={1000}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
        />
      )}
      <View style={styles.container}>
        {playerScore === 3 ? (
          <Text style={styles.status}>Congratulations!!! You won</Text>
        ) : (
          <Text style={styles.status}>You lost</Text>
        )}
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <Button title="Home" onPress={homeButtonHandler} />
          </View>
          <View style={styles.button}>
            <Button title="Replay" onPress={replayButtonHandler} />
          </View>
        </View>
      </View>
    </BackgroundGradient>
  );
};

export default EndGameScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(70,70,70,0.28)",
    alignSelf: "center",
    marginVertical: "auto",
    padding: 24,
    borderRadius: 6,

    // height: "200",
    // width: "300",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    marginHorizontal: 6,
    overflow: "hidden",
    borderRadius: 4,
    width: 110,
  },
  status: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 26,
    color: "#f2f8fc",
    maxWidth: 210,
    textAlign: "center",
  },
});
