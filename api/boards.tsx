import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL_API;
export const createBoardApi = async (token: string, boardData: { name: string, user_id: number }) => {
    try {
        const response = await axios.post(`${API_URL}/boards`, boardData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("createBoard error", error);
        throw error;
    }
};

export const getAllBoards = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/boards`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getAllBoards error", error);
        throw error;
    }
};

export const getBoardByIdApi = async (token: string, boardId: number) => {
    try {
        const response = await axios.get(`${API_URL}/boards/${boardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getBoardById error", error);
        throw error;
    }
};

export const updateBoardApi = async (token: string, boardId: number, boardData: { name: string }) => {
    try {
        const response = await axios.patch(`${API_URL}/boards/${boardId}`, boardData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("updateBoard error", error);
        throw error;
    }
};

export const deleteBoardApi = async (token: string, boardId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/boards/${boardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("deleteBoard error", error);
        throw error;
    }
};
