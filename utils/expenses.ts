import axios, { AxiosRequestConfig } from "axios";
import { retrieveSession } from "./storecookies";

// Base URL for the API (adjust if needed)
const BASE_URL = "http://192.168.1.8:8080/user/expenses";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the expenses for the authenticated user
export const getExpenses = async (): Promise<any> => {
  try {
    const sessionCookie = await retrieveSession(); // Retrieve the session cookie
    const config: AxiosRequestConfig = {
      headers: {
        Cookie: sessionCookie || "", // Attach the cookie to the request
      },
    };

    const response = await api.get("/", config); // Fetch expenses from the protected route
    return response.data; // Return the expenses data
  } catch (error) {
    console.error("Fetching expenses error:", error);
    throw error; // Throw error for further handling
  }
};
