import axios from "axios";

//const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://gitcommitai-backend-aafdg3cwdtctc9e6.centralindia-01.azurewebsites.net/";
//const API_URL = "http://192.168.8.105:8000";


export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
  }
};

export const addUser = async (user) => {
  const response = await axios.post(`${API_URL}/users/`, user);
  return response.data;
};

export const updateUser = async (userId, updatedUser, token) => {
  const response = await axios.put(`${API_URL}/users/${userId}/`, updatedUser, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
