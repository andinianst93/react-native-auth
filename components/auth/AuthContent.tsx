import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";

function AuthContent({
  isLogin,
  onAuthenticate,
}: {
  isLogin: boolean;
  onAuthenticate: Function;
}) {
  const navigation = useNavigation();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    username: false,
    email: false,
    password: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.navigate("Signup" as never);
    } else {
      navigation.navigate("Login" as never);
    }
  }

  function submitHandler(credentials: any) {
    let { username, email, password } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;

    if (!emailIsValid || !passwordIsValid || (!isLogin && !username)) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        username: !isLogin && !username,
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    onAuthenticate({ username, email, password });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
