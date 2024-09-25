import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SignUpProps, LoginProps } from "./types";
import { storeSession, retrieveSession, deleteSession } from "./storecookies";

// Base URL for the API
const BASE_URL = "http://192.168.1.8:8080/user";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle API errors uniformly
const handleError = (error: any, context: string) => {
  console.error(`${context} error:`, error);
  throw error;
};

// Function to create a user
export const createUser = async (userData: SignUpProps): Promise<any> => {
  try {
    const response = await api.post("/signup", userData);
    return response.data;
  } catch (error) {
    handleError(error, "Creating user");
  }
};

// Function to log in a user
export const loginUser = async (userData: LoginProps): Promise<any> => {
  try {
    const response = await api.post("/login", userData);

    const sessionCookie = response.headers["set-cookie"]?.[0] || null;
    if (sessionCookie) {
      await storeSession(sessionCookie);
    } else {
      console.error("No session cookie found");
    }

    return response.data;
  } catch (error) {
    handleError(error, "Logging in");
  }
};

// Function to sign out a user
export const signOut = async (): Promise<any> => {
  try {
    const sessionCookie = await retrieveSession();
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: sessionCookie || "",
      },
    };

    const response = await api.post("/signout", {}, config);
    await deleteSession();
    return response.data;
  } catch (error) {
    handleError(error, "Signing out");
  }
};

// Function to get the current user
export const getUser = async (): Promise<any> => {
  try {
    const sessionCookie = await retrieveSession();
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: sessionCookie || "",
      },
    };

    const response = await api.get("/me", config);
    return response.data;
  } catch (error) {
    handleError(error, "Fetching user");
  }
};
