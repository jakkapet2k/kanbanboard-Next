import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const inviteMemberApi = async (token: string, boardId: number, email: string) => {
    try {
        const response = await axios.post(
            `${API_URL}/invite`,
            { boardId, email },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error inviting member", error);
        throw error;
    }
};

export const getBoardMembersApi = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/board-members`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching board members", error);
        throw error;
    }
};
