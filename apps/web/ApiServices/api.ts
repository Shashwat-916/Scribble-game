import axios from "axios";

const HTTP_BACKEND = "http://localhost:3001"

// Helper to handle Axios errors consistently
const handleAxiosError = (error: any, defaultMessage: string) => {
  if (axios.isAxiosError(error) && error.response) {
    console.error("API Error Details:", error.response.data);
    const errorMessage = (error.response.data as any)?.message || defaultMessage;
    throw new Error(errorMessage);
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
    console.log(response.data);
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

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user Details", JSON.stringify(response.data.user));

    return response.data; // Returns { token, roomId, slug }
  } catch (error) {
    handleAxiosError(error, "Failed to join room");
  }
}

export async function getRoom(slug: string) {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to get room");
  }
}

export async function getRoomId(slug: string) {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to get room");
  }
}