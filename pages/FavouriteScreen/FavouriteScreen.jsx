import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { initialData } from "../../data";
import Toast from "react-native-toast-message";

export default function FavouriteScreen() {
  const [favourites, setFavourites] = useState(initialData);

  const removeFavourite = (id) => {
    setFavourites((prev) => prev.filter((item) => item.id !== id));
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: "Bạn đã xóa thành công",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="heart-outline"
          size={20}
          color="red"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.headerText}>Yêu thích</Text>
      </View>

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>
                {item.author} · {item.duration}
              </Text>
            </View>

            <TouchableOpacity onPress={() => removeFavourite(item.id)}>
              <Ionicons name="heart" size={22} color="#f45454" />
            </TouchableOpacity>

            <Ionicons
              name="play"
              size={20}
              color="#333"
              style={{ marginLeft: 12 }}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            Chưa có mục yêu thích nào
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefcf7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1e8df",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
});
