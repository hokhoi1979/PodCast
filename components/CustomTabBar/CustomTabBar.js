import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let icon;
        if (route.name === "Search")
          icon = (
            <Ionicons
              name="search"
              size={24}
              color={isFocused ? "#946f4a" : "#9a9a9a"}
            />
          );
        if (route.name === "Favourite")
          icon = (
            <Ionicons
              name={isFocused ? "heart" : "heart-outline"}
              size={24}
              color={isFocused ? "#946f4a" : "#9a9a9a"}
            />
          );
        if (route.name === "Home") {
          icon = (
            <View style={styles.homeButton}>
              <Ionicons name="home" size={30} color="white" />
            </View>
          );
        }
        if (route.name === "Shop")
          icon = (
            <Ionicons
              name="cart"
              size={24}
              color={isFocused ? "#946f4a" : "#9a9a9a"}
            />
          );
        if (route.name === "Profile")
          icon = (
            <Ionicons
              name="person"
              size={24}
              color={isFocused ? "#946f4a" : "#9a9a9a"}
            />
          );

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
          >
            {icon}
            {route.name !== "Home" && (
              <Text
                style={{
                  color: isFocused ? "#946f4a" : "#9a9a9a",
                  fontSize: 12,
                }}
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#f1e8df",
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  homeButton: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#946f4a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
});
