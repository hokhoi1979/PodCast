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
import SearchScreen from "../pages/SearchScreen/SearchScreen";
import ShopScreen from "../pages/ShopScreen/ShopScreen";

// Custom TabBar
import CustomTabBar from "../components/CustomTabBar/CustomTabBar";
import AdminScreen from "../pages/AdminScreen/AdminScreen";
import CategoryManagementScreen from "../pages/AdminScreen/CategoryManagementScreen";
import ProductManagementScreen from "../pages/AdminScreen/ProductManagementScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator (Main App)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
