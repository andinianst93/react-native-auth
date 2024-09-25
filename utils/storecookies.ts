import * as SecureStore from "expo-secure-store";

export const storeSession = async (sessionCookie: string) => {
  try {
    await SecureStore.setItemAsync("session", sessionCookie);
  } catch (error) {
    console.error("Error storing session:", error);
  }
};

export const retrieveSession = async () => {
  try {
    const sessionCookie = await SecureStore.getItemAsync("session");
    return sessionCookie;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};
export const deleteSession = async () => {
  await SecureStore.deleteItemAsync("session");
};
