import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const createUserApi = async (token: string, userData: { username: string, email: string, password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/users`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("createUser error", error);
        throw error;
    }
};

export const getAllUsersApi = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getAllUsers error", error);
        throw error;
    }
};

export const getUserByIdApi = async (token: string, userId: number) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getUserById error", error);
        throw error;
    }
};

export const updateUserApi = async (token: string, userId: number, userData: { username?: string, email?: string, password?: string }) => {
    try {
        const response = await axios.patch(`${API_URL}/users/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("updateUser error", error);
        throw error;
    }
};

export const deleteUserApi = async (token: string, userId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("deleteUser error", error);
        throw error;
    }
};
