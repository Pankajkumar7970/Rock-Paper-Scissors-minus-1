import {
  Button,
  Modal,
  TextInput,
  Text,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { socket } from "../socket";

export default function ModalWindow({ visible, setVisibility }) {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  function modalButtonHandler() {
    if (!userName) {
      Alert.alert("Please enter your username.");
      return;
    }
    socket.emit("join", userName);
    setVisibility(false);
    navigation.navigate("Waiting");
  }

  function inputHandler(input) {
    setUserName(input);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.container}>
        <Text>Enter your Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={inputHandler}
          value={userName}
        />
        <Button title={"Find Opponent"} onPress={modalButtonHandler} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fffff0",
    padding: 20,
    width: 300,
    borderRadius: 8,
    marginHorizontal: "auto",
    marginVertical: 70,
  },
  input: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 4,
    width: 150,
    height: 30,
    marginVertical: 12,
    elevation: 30,
  },
});
