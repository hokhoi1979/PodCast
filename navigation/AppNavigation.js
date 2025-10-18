import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Pages
import FavouriteScreen from "../pages/FavouriteScreen/FavouriteScreen";
import HomeScreen from "../pages/HomeScreen/HomeScreen";
import SignInScreen from "../pages/LoginScreen/SignInScreen"; // Add this
import SignUpScreen from "../pages/LoginScreen/SignUpScreen";
import ProfileScreen from "../pages/ProfileScreen/ProfileScreen";
import SearchScreen from "../pages/SearchScreen/SearchScreen";
import CartScreen from "../pages/ShopScreen/Cart";
import CheckoutScreen from "../pages/ShopScreen/Checkout";
import ShopScreen from "../pages/ShopScreen/ShopScreen";

// Custom TabBar
import CustomTabBar from "../components/CustomTabBar/CustomTabBar";
import AdminScreen from "../pages/AdminScreen/AdminScreen";
import PaymentCancel from "../pages/ShopScreen/PaymentCancel";
import PaymentSuccess from "../pages/ShopScreen/PaymentSuccess";
import TrackOrdersScreen from "../pages/ShopScreen/TrackOrder";

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
        initialRouteName="SignIn" // Start with SignIn
      >
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="PaymentCancel" component={PaymentCancel} />
        <Stack.Screen name="TrackOrder" component={TrackOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
