import React, { useContext, useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/auth/AuthContent";
import { SignUpProps } from "../utils/types";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext } from "../store/auth-context";

function SignupScreen() {
  const navigation = useNavigation();
  const { signup } = useContext(AuthContext)!;
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleSignup(userData: SignUpProps) {
    setIsAuthenticating(true);
    try {
      await signup(userData);

      Alert.alert("Signup Success", "You can now login with your account");
      navigation.navigate("Login" as never);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Signup failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent isLogin={false} onAuthenticate={handleSignup} />;
}

export default SignupScreen;
