import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";

import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/SignUp";
import WelcomeScreen from "./screens/Welcome";
import { Colors } from "./constants/styles";
import IconButton from "./components/ui/IconButton";
import LoadingOverlay from "./components/ui/LoadingOverlay";

import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { Alert } from "react-native";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authContext = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Set loading to true
    try {
      await authContext?.logout(); // Call logout
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false); // Reset loading state
    }
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Logging out..." />}
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary800 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.primary100 },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit"
                onPress={handleLogout} // Use the handleLogout function
                color={tintColor ?? "white"}
                size={28}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);

  // Check if the context is available and determine the navigation stack to display
  if (!authContext) {
    return null; // Handle undefined context
  }

  const { isLoggedIn, isLoading } = authContext;

  if (isLoading) {
    return <LoadingOverlay message="Loading..." />; // Show loading overlay
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
