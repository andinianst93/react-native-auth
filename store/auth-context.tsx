import { createContext, useState, useEffect } from "react";
import { SignUpProps, LoginProps, Expense } from "../utils/types";
import { createUser, loginUser, signOut, getUser } from "../utils/auth";
import { getExpenses } from "../utils/expenses";
import { retrieveSession } from "../utils/storecookies";

interface UserContextProps {
  user: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  signup: (userData: SignUpProps) => Promise<void>;
  login: (userData: LoginProps) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  expenses: Expense[];
}

export const AuthContext = createContext<UserContextProps | undefined>(
  undefined
);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Set to true initially
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const sessionCookie = await retrieveSession(); // Check for session cookie
      if (!sessionCookie) {
        setUser(null);
        setIsLoggedIn(false);
      } else {
        try {
          const response = await getUser(); // Attempt to fetch user data
          setUser(response.data); // Update state with user data
          setIsLoggedIn(true); // Set logged-in status to true
          await fetchExpenses(); // Fetch expenses if user is logged in
        } catch (err: any) {
          console.error("Fetch user error:", err);
          setUser(null);
          setIsLoggedIn(false);
        }
      }
      setIsLoading(false); // Update loading state after check
    };

    checkLoggedInStatus(); // Run the check on mount
  }, []); // Only runs once on mount

  const signup = async (userData: SignUpProps) => {
    try {
      await createUser(userData);
    } catch (err: any) {
      console.error("Signup error:", err);
    }
  };

  const login = async (userData: LoginProps) => {
    try {
      await loginUser(userData);
      await fetchUser(); // Fetch user data after login
      // Note: fetchUser already sets isLoggedIn
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(); // Call the signOut function
      setUser(null); // Clear user data
      setIsLoggedIn(false); // Update login status
      setExpenses([]); // Optionally clear expenses on logout
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };

  const fetchUser = async () => {
    const sessionCookie = await retrieveSession(); // Retrieve session
    if (!sessionCookie) {
      setUser(null); // Set user to null if no session exists
      setIsLoggedIn(false);
      return; // Exit if no session cookie
    }

    try {
      const response = await getUser(); // Attempt to fetch user data
      setUser(response.data); // Update state with user data
      setIsLoggedIn(true); // Set logged-in status to true
    } catch (err: any) {
      console.error("Fetch user error:", err);
      setUser(null); // Clear user state on error
      setIsLoggedIn(false); // Set logged-in status to false
    }
  };

  const fetchExpenses = async () => {
    try {
      const expensesData = await getExpenses(); // Fetch expenses
      setExpenses(expensesData.data); // Update state with fetched expenses
    } catch (err: any) {
      console.error("Fetch expenses error:", err);
    }
  };

  const values = {
    user,
    isLoggedIn,
    isLoading,
    signup,
    login,
    logout,
    fetchUser,
    fetchExpenses,
    expenses,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
