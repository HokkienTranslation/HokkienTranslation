import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const LandingPage = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => navigation.navigate("Home")}
    >
      <ImageBackground
        source={require("../assets/background.png")}
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <View
          style={{
            margin: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 150, height: 150 }}
          />
          <Text style={{ fontSize: 20, marginTop: 40, color: "gray" }}>
            Welcome
          </Text>
          <Text style={{ fontSize: 14, margin: 5, color: "gray" }}>
            Click anywhere to continue
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default LandingPage;
