import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  Vibration,
} from "react-native";
import BackgroundGradient from "../components/BackgroundGradient";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { socket } from "../socket";

export default function GameScreen({ route, navigation }) {
  const [userMoves, setUserMoves] = useState([]);
  const [inputsVisibility, setInputsVisibility] = useState(false);
  const [timing, setTiming] = useState(5);
  const [gameRound, setGameRound] = useState(1);
  const [gameText, setGameText] = useState();
  const isFocused = useIsFocused();
  const [inputLength, setInputLength] = useState();
  const [isMinusRound, setIsMinusRound] = useState(false);
  const [isResultRound, setIsResultRound] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const [opponentData, setOpponentData] = useState({});
  const [displayOpponentMoves, setDisplayOpponentMoves] = useState([]);

  const userMovesRef = useRef(userMoves);
  const playerDataRef = useRef(playerData);
  const opponentDataRef = useRef(opponentData);

  const playersData = route.params;

  useEffect(() => {
    userMovesRef.current = userMoves;
    playerDataRef.current = playerData;
    opponentDataRef.current = opponentData;
    if (playerData?.playerScore === 3 || opponentData?.playerScore === 3) {
      socket.emit("gameOver", playerData?.roomId);
      Vibration.vibrate(1000);
      navigation.replace("EndGame", playerData?.playerScore);
    }
  }, [userMoves, playerData, opponentData]);
  useEffect(() => {
    dataHandler(playersData);

    socket.on("data", (data) => {
      dataHandler(data);
    });
  }, []);

  //Game Logic
  const playRPS = (player1, player2) => {
    // If both players choose the same option
    if (player1 === player2) {
      return "tie";
    }

    // Winning conditions
    const winConditions = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };

    // Determine the winner
    if (winConditions[player1] === player2) {
      return "victory";
    } else {
      return "defeat";
    }
  };

  const moveImages = {
    rock: require("../assets/rock.webp"),
    paper: require("../assets/paper.webp"),
    scissors: require("../assets/scissors.webp"),
  };

  function dataHandler(data) {
    data.forEach((player) => {
      if (player.playerId === socket.id) {
        setPlayerData((prev) => ({ ...prev, ...player }));
      } else {
        setOpponentData((prev) => ({ ...prev, ...player }));
      }
    });
  }

  //   timer function
  const setTimer = (time) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time > 0) {
          time = time - 1;
          setTiming(time);
        }
        if (time === 0) {
          clearInterval(interval); // Stop the interval when time reaches 0
          resolve(); // Resolve the promise
        }
      }, 1000);
    });
  };

  useEffect(() => {
    startRound(6, 11);
  }, [isFocused, gameRound]);

  useEffect(() => {
    if (userMoves.length === inputLength) {
      setInputsVisibility(false);
      socket.emit("userMoves", [playerData.roomId, userMoves]);
      setPlayerData((cur) => ({ ...cur, playerMoves: userMoves }));
    }
  }, [userMoves]);

  function setMoveHandler(val) {
    Vibration.vibrate(60);
    if (isMinusRound) {
      if (userMoves[0] === userMoves[1]) {
        setUserMoves((prev) => [prev[0]]);
      } else {
        setUserMoves((cur) => cur.filter((move) => move !== val));
      }
    } else {
      setUserMoves((cur) => [...cur, val]);
    }
  }

  function startRound(waitTime, roundTime) {
    setPlayerData((cur) => ({ ...cur, playerMoves: [] }));
    setOpponentData((cur) => ({ ...cur, playerMoves: [] }));
    setUserMoves([]);
    setGameText(`Round ${gameRound} begins soon`);
    setTimer(waitTime)
      .then(() => {
        setGameText("Please choose your moves!");
        setInputsVisibility(true);
        setInputLength(2);
        return setTimer(roundTime);
      })
      .then(() => {
        setIsMinusRound(true);
        setDisplayOpponentMoves(opponentDataRef.current.playerMoves);
        if (playerDataRef.current.playerMoves.length < 2) {
          throw "Insufficient Inputs By player";
        } else if (opponentDataRef.current.playerMoves.length < 2) {
          throw "Insufficient Inputs By opponent";
        }
        setGameText("Please select one of your moves to minus it!!");
        setInputsVisibility(true);
        setInputLength(1);
        return setTimer(roundTime);
      })
      .then(() => {
        setIsMinusRound(false);
        if (playerDataRef.current.playerMoves.length !== 1) {
          throw "Insufficient Inputs By player";
        } else if (opponentDataRef.current.playerMoves.length !== 1) {
          throw "Insufficient Inputs By opponent";
        }
        setDisplayOpponentMoves(opponentDataRef.current.playerMoves);
        setIsResultRound(true);
        // setUserMoves([]);
        setInputsVisibility(false);
        return setTimer(waitTime);
      })
      .then(() => {
        setIsResultRound(false);
        setInputsVisibility(false);
        setDisplayOpponentMoves([]);
        setPlayerData((cur) => ({ ...cur, playerMoves: [] }));
        setOpponentData((cur) => ({ ...cur, playerMoves: [] }));
        setUserMoves([]);
        setGameRound((cur) => cur + 1);
      })
      .catch((err) => {
        // console.log(err);
        setIsMinusRound(false);
        setPlayerData((cur) => ({ ...cur, playerMoves: [] }));
        setOpponentData((cur) => ({ ...cur, playerMoves: [] }));
        setUserMoves([]);
        setDisplayOpponentMoves([]);
        if (err === "Insufficient Inputs By player") {
          // socket.emit("insufficientInput", playerData.roomId);
          setInputsVisibility(false);
          setGameText("You did not choose sufficient inputs, so you lost !!");
          setTimer(6).then(() => setGameRound((cur) => cur + 1));
        } else if (err === "Insufficient Inputs By opponent") {
          setInputsVisibility(false);
          socket.emit("winner", playerDataRef.current.roomId, (res) => {
            dataHandler(res);
          });
          setGameText("You won this round");
          setTimer(6).then(() => setGameRound((cur) => cur + 1));
        }
        // setGameRound((cur) => cur + 1);
      });
  }

  useEffect(() => {
    if (isResultRound) {
      setGameText(
        playRPS(playerData.playerMoves[0], opponentData.playerMoves[0])
      );
      if (
        playRPS(playerData.playerMoves[0], opponentData.playerMoves[0]) ===
          "victory" ||
        playRPS(playerData.playerMoves[0], opponentData.playerMoves[0]) ===
          "tie"
      ) {
        socket.emit("winner", playerData.roomId, (res) => {
          dataHandler(res);
        });
      }

      setPlayerData((cur) => ({ ...cur, playerMoves: [] }));
      setOpponentData((cur) => ({ ...cur, playerMoves: [] }));
    }
  }, [isResultRound]);

  // useEffect(() => console.log(userMoves), [userMoves]);

  return (
    <BackgroundGradient>
      {inputsVisibility && (
        <View style={styles.inputContainer}>
          <Pressable
            android_ripple={{ color: "rgba(255,255,255,0.6)" }}
            style={styles.pressable}
            onPress={() => setMoveHandler("rock")}
          >
            <Image
              source={require("../assets/rock.webp")}
              style={styles.image}
            />
          </Pressable>
          <Pressable
            style={[
              styles.pressable,
              {
                borderLeftColor: "rgba(200,200,200,0.4)",
                borderLeftWidth: 0.19,
                borderRightColor: "rgba(200,200,200,0.4)",
                borderRightWidth: 0.19,
              },
            ]}
            android_ripple={{ color: "rgba(255,255,255,0.6)" }}
            onPress={() => setMoveHandler("paper")}
          >
            <Image
              source={require("../assets/paper.webp")}
              style={styles.image}
            />
          </Pressable>
          <Pressable
            android_ripple={{ color: "rgba(255,255,255,0.6)" }}
            style={styles.pressable}
            onPress={() => setMoveHandler("scissors")}
            // onPress={() => setUserMoves((cur) => [...cur, "scissors"])}
          >
            <Image
              source={require("../assets/scissors.webp")}
              style={styles.image}
            />
          </Pressable>
        </View>
      )}

      <View style={styles.playerInfoContainer}>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, styles.lightText]}>
            {opponentData["playerUsername"]}
          </Text>
          <View>
            <Text style={[styles.playerScore, styles.player1Score]}>
              {opponentData["playerScore"]}
            </Text>
          </View>
        </View>
        <View style={styles.timerObjectiveContainer}>
          <Text style={[styles.lightText]}>Objective: 03</Text>
          <Text style={[styles.lightText]}>
            0:{timing?.toString().padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.playerInfo}>
          <View>
            <Text style={[styles.playerScore, styles.player2Score]}>
              {playerData["playerScore"]}
            </Text>
          </View>
          <Text style={[styles.lightText, styles.playerName]}>
            {playerData["playerUsername"]}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.outputImageContainer}>
          <FlatList
            data={displayOpponentMoves} // The array to render
            keyExtractor={(item, index) => index.toString()} // Unique key for each item
            contentContainerStyle={styles.listContainer} // Style for the list container
            // style={styles.listContainer}
            renderItem={({ item }) =>
              (isMinusRound || isResultRound) && (
                <Image source={moveImages[item]} style={styles.outputImage} />
              )
            }
          />
        </View>
        <View style={styles.guidelines}>
          <Text style={styles.guidelinesText}>{gameText}</Text>
        </View>
        <View style={styles.outputImageContainer}>
          <FlatList
            data={userMoves} // The array to render
            keyExtractor={(item, index) => index.toString()} // Unique key for each item
            contentContainerStyle={styles.listContainer} // Style for the list container
            // style={styles.listContainer}
            renderItem={({ item }) => (
              <Image source={moveImages[item]} style={styles.outputImage} />
            )}
          />
        </View>
      </View>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: 250,
    height: 70,
    backgroundColor: "rgba(185,185,185,0.25)",
    borderRadius: 6,
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: "rgba(200,200,200,0.7)",
    borderWidth: 0.2,
    overflow: "hidden",
  },
  image: {
    height: 55,
    width: 60,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    height: "100%",
    justifyContent: "center",
  },
  playerInfoContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(25,25,25,0.8)",
    width: 380,
    height: 55,
    alignSelf: "center",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderColor: "rgba(2,2,2,0.5)",
    borderWidth: 0.6,
    borderTopWidth: 0,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerObjectiveContainer: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "space-around",
  },
  playerScore: {
    height: "100%",
    width: 35,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#f2f8fc",
    fontSize: 28,
    fontWeight: "700",
  },
  player1Score: {
    backgroundColor: "#A90601",
  },
  player2Score: {
    backgroundColor: "#0A2368",
  },
  lightText: {
    color: "#f2f8fc",
  },
  playerName: {
    flex: 1,
    fontSize: 17,
    textAlign: "center",
  },
  guidelines: {
    flex: 1.5,
    // width: 50,
    // textAlign: "center",
  },
  guidelinesText: {
    fontSize: 24,
    textAlign: "center",
    // marginTop: 100,
    width: 250,
    fontWeight: "600",
    color: "#f2f8fc",
    alignSelf: "center",
  },
  outputImage: {
    // marginBottom: 10,
    // marginTop: 10,
    height: 80,
    width: 80,
  },
  outputImageContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "space-around",
    // backgroundColor: "black",
    // position: "",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "black",
    flex: 0.73,
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    justifyContent: "space-around",
    // backgroundColor: "black",
    alignContent: "center",
  },
});
