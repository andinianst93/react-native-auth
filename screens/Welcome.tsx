import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../store/auth-context";

function WelcomeScreen() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  const { user, fetchExpenses, expenses } = authContext;

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      {user ? <Text>Hi, {user.email}!</Text> : <Text>User not found!</Text>}
      {expenses.length > 0 ? (
        expenses.map((expense) => <Text key={expense.id}>{expense.title}</Text>)
      ) : (
        <Text>No expenses found!</Text>
      )}
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
