import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const createTaskApi = async (token: string, taskData: { content: string, description?: string, column_id: number ,tags?: string[]}) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, taskData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("createTask error", error);
        throw error;
    }
};

export const getAllTasksApi = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getAllTasks error", error);
        throw error;
    }
};

export const getTaskByIdApi = async (token: string, taskId: number) => {
    try {
        const response = await axios.get(`${API_URL}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("getTaskById error", error);
        throw error;
    }
};


export const updateTaskApi = async (token: string,taskId: number,taskData: {content: string;description?: string; column_id?: number; tags?: string[];    }
) => {
    try {
        const response = await axios.patch(`${API_URL}/tasks/${taskId}`,taskData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("updateTask error", error);
        throw error;
    }
};



export const deleteTaskApi = async (token: string, taskId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("deleteTask error", error);
        throw error;
    }
};

export const deleteTagApi = async (token: string, tag: string) => {
    try {
        const response = await axios.delete(`${API_URL}/tags/${tag}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("deleteTagApi error", error);
        throw error;
    }
};

