import axios from "axios";

const API_URL = "http://localhost:3001";

export async function createRoom(username: string, avatarId: number) {
  try {
    const response = await axios.post(`${API_URL}/room`, {
      username: username, // Make sure this matches Backend Zod Schema
      avatarId: avatarId,
    });
console.log(response.data);
    return response.data; // Axios automatically gives parsed JSON here
    

  } catch (error: any) {
    // Better Error Logging
    if (axios.isAxiosError(error)) {
      console.log(error?.response?.data);
      console.error("Axios Error Details:", error.response?.data);
      // Return the specific message from backend (e.g. "Invalid Inputs")
      throw new Error(error.response?.data?.message || "Server rejected request");
    } else {
      console.error("Network/Unknown Error:", error);
      throw new Error("Could not connect to server");
    }
  }
}


export async function joinRoom(username: string, avatarId: number, roomId: string) {
  try {
    // Note: You need to implement this /join endpoint on your backend!
    // It should create a User and link them to the roomId.
    const response = await axios.post(`${API_URL}/join`, {
      username,
      avatarId,
      roomId, // The slug or ID entered by user
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to join room");
  }
}