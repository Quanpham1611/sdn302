import axios from "axios";

const API_URL = "http://localhost:5173/api/auth";

// Định nghĩa header
const config = {
    headers: {
        "Content-Type": "application/json",
    },
};

export const register = async (username, password) => {
    return await axios.post(`${API_URL}/register`, { username, password }, config);
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password }, config);
    return response.data;
};
