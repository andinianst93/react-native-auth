import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import Input from "./Input";

function AuthForm({
  isLogin,
  onSubmit,
  credentialsInvalid,
}: {
  isLogin: boolean;
  onSubmit: Function;
  credentialsInvalid: any;
}) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const {
    username: usernameIsInvalid,
    email: emailIsInvalid,
    password: passwordIsInvalid,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType: any, enteredValue: string) {
    switch (inputType) {
      case "username":
        setEnteredUsername(enteredValue);
        break;
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    const userData: { email: string; password: string; username?: string } = {
      email: enteredEmail,
      password: enteredPassword,
    };

    if (!isLogin) {
      userData.username = enteredUsername; // Include username for signup
    }

    onSubmit(userData);
  }

  return (
    <View style={styles.form}>
      <View>
        {!isLogin && (
          <Input
            label="Username"
            onUpdateValue={updateInputValueHandler.bind(null, "username")}
            value={enteredUsername}
            isInvalid={usernameIsInvalid}
          />
        )}
        <Input
          label="Email Address"
          onUpdateValue={updateInputValueHandler.bind(null, "email")}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(null, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  form: {},
});
