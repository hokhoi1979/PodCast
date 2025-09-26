import { AntDesign, Entypo } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from "../../assests/logo.jpg";

export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.leftSide}>
        <View>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>PodcastVN</Text>
      </View>
      <View style={styles.rightSide}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <EvilIcons name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Shop")}>
          <AntDesign name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#604B3B",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
