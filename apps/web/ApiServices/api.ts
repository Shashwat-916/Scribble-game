import axios from "axios";

const HTTP_BACKEND = "http://localhost:3001"



export async function createRoom(username: string, avatarId: number) {
  try {
    const response = await axios.post(`${HTTP_BACKEND}/room`, {

      username: username,
      avatarId: avatarId,

    });
    localStorage.setItem("token", response.data.token);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Create room error:", error);
    throw new Error(error.response?.data?.error || "Failed to create room");
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
  } catch (error: any) {
    console.error("Join room error:", error);
    throw new Error(error.response?.data?.error || "Failed to join room");
  }
}

export async function getRoom(slug: string) {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get room error:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch room");
  }
}



