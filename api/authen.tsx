import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const LoginApi = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, 
            { username, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; 
    } catch (error:any) {
        if (error.response && error.response.data) {
          
            throw new Error(error.response.data.message || 'Login failed : username or password incorrect');
        } else {
         
            throw new Error('An error occurred during login.');
        }
    }
};


export const RegisterApi = async (username: string, password: string, email: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, 
            { username, password, email },
            {
                headers: {
                    'Content-Type': 'application/json', 
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("RegisterApi error", error);
        throw error; 
    }
};