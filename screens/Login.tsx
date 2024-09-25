import React, { useContext, useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/auth/AuthContent";
import { LoginProps } from "../utils/types";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext)!;
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleLogin(userData: LoginProps) {
    setIsAuthenticating(true);
    try {
      await login(userData);
      navigation.navigate("Welcome" as never);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      Alert.alert("Authentication failed", message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <AuthContent isLogin onAuthenticate={handleLogin} />;
}

export default LoginScreen;
