import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Pages
import HomeScreen from "../pages/HomeScreen/HomeScreen";
import SearchScreen from "../pages/SearchScreen/SearchScreen";
import LibraryScreen from "../pages/LibraryScreen/LibraryScreen";
import ProfileScreen from "../pages/ProfileScreen/ProfileScreen";
import ShopScreen from "../pages/ShopScreen/ShopScreen";

// Custom TabBar
import CustomTabBar from "../components/CustomTabBar/CustomTabBar";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
