import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const createColumnApi = async (token: string, columnData: { title: string, board_id: number }) => {
    try {
        const response = await axios.post(`${API_URL}/columns`, columnData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("createColumn error", error);
        throw error;
    }
};

export const getAllColumnsApi = async (token: string,) => {
    try {
        const response = await axios.get(`${API_URL}/columns`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        return response.data;
    } catch (error) {
        console.error("getAllColumns error", error);
        throw error;
    }
};


export const getColumnByIdApi = async (token: string, columnId: number) => {
    try {
        const response = await axios.get(`${API_URL}/columns/${columnId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getColumnById error", error);
        throw error;
    }
};

export const updateColumnApi = async (token: string, columnId: number, data: { title: string }) => {
    try {
        const response = await axios.patch(`${API_URL}/columns/${columnId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("updateColumn error", error);
        throw error;
    }
};

export const deleteColumnApi = async (token: string, columnId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/columns/${columnId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("deleteColumn error", error);
        throw error;
    }
};
