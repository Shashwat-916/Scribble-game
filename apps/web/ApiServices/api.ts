import axios from "axios";

const HTTP_BACKEND= "http://localhost:3001"

// Helper to handle Axios errors consistently
const handleAxiosError = (error: any, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error Details:", error.response?.data);
    throw new Error(error.response?.data?.message || defaultMessage);
  } else {
    console.error("Network/Unknown Error:", error);
    throw new Error("Could not connect to server");
  }
};

export async function createRoom(username: string, avatarId: number) {
  try {
    const response = await axios.post(`${HTTP_BACKEND}/room`, {
      username: username,
      avatarId: avatarId,
    });
    return response.data; // Returns { token, roomId, slug }
  } catch (error) {
    handleAxiosError(error, "Failed to create room");
  }
}

export async function joinRoom(username: string, avatarId: number, slug: string) {
  try {
    const response = await axios.post(`${HTTP_BACKEND}/join`, {
      username: username,
      avatarId: avatarId,
      slug: slug, // Backend expects 'slug', NOT 'roomId'
    });
    return response.data; // Returns { token, roomId, slug }
  } catch (error) {
    handleAxiosError(error, "Failed to join room");
  }
}