import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  View,
  Text,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Default({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("./assets/background.png")}
        style={{ flex: 1, width: width, height: height }}
      >
        <View>
          <Text
            style={{
              fontSize: 50,
              color: "black",
              textAlign: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            GameVerse
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            {/* First Game Card */}
            <View
              style={{
                height: height * 0.35,
                width: height * 0.35,
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "white",
                marginRight: 20,
              }}
            >
              <Pressable
                onPress={() => navigation.navigate("RPS")}
                style={{ flex: 1 }}
              >
                <Image
                  source={require("./assets/Logo.png")}
                  style={{ flex: 1 }}
                  resizeMode="repeat"
                />
              </Pressable>
            </View>

            {/* Second Game Card */}
            <View
              style={{
                height: height * 0.35,
                width: height * 0.35,
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "white",
                marginLeft: 20,
              }}
            >
              <Pressable
                onPress={() => navigation.navigate("TTT")}
                style={{ flex: 1 }}
              >
                <Image
                  source={require("./assets/LogoTTT.png")}
                  style={{ flex: 1 }}
                  resizeMode="repeat"
                />
              </Pressable>
            </View>
          </View>

          {/* Coming Soon Card */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              height: 80,
              width: width * 0.338,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, color: "black" }}>
              More Games Coming Soon...
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
