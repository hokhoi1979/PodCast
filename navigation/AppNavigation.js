import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// Pages
import FavouriteScreen from "../pages/FavouriteScreen/FavouriteScreen";
import HomeScreen from "../pages/HomeScreen/HomeScreen";
import SignInScreen from "../pages/LoginScreen/SignInScreen";
import SignUpScreen from "../pages/LoginScreen/SignUpScreen";
import ProfileScreen from "../pages/ProfileScreen/ProfileScreen";
import ShopScreen from "../pages/ShopScreen/ShopScreen";

// Custom TabBar
import CustomTabBar from "../components/CustomTabBar/CustomTabBar";
import AdminScreen from "../pages/AdminScreen/AdminScreen";
import CategoryManagementScreen from "../pages/AdminScreen/CategoryManagementScreen";
import PodcastManagementScreen from "../pages/AdminScreen/PodcastManagementScreen";
import ProductManagementScreen from "../pages/AdminScreen/ProductManagementScreen";
import UserManagementScreen from "../pages/AdminScreen/UserManagementScreen";
import ChatwithAIScreen from "../pages/ChatwithAI/ChatwitAIScreen";
import FlashcardNative from "../pages/FlashCard/FlashCard";
import LetterScreen from "../pages/Letter/LetterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator (Main App)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Chat" component={ChatwithAIScreen} />
      <Tab.Screen name="Favourite" component={FavouriteScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SignIn"
      >
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen
          name="CategoryManagement"
          component={CategoryManagementScreen}
        />
        <Stack.Screen
          name="ProductManagement"
          component={ProductManagementScreen}
        />
        <Stack.Screen
          name="PodcastManagement"
          component={PodcastManagementScreen}
        />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen
          name="Letter"
          component={LetterScreen}
          options={{ title: "Gửi Thư" }}
        />
        <Stack.Screen
          name="FlashCard"
          component={FlashcardNative}
          options={{ title: "FlashCard" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
