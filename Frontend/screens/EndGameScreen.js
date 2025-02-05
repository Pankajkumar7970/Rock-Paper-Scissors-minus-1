import { Button, Text, View, StyleSheet } from "react-native";
import BackgroundGradient from "../components/BackgroundGradient";

const EndGameScreen = ({ navigation }) => {
  function homeButtonHandler() {
    navigation.navigate("Home");
  }
  return (
    <BackgroundGradient>
      <View style={styles.container}>
        <Button title="Home" onPress={homeButtonHandler} />
      </View>
    </BackgroundGradient>
  );
};

export default EndGameScreen;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginVertical: "auto",
  },
});
