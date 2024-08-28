
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoLogOut } from 'react-icons/io5';
import { getUserByIdApi } from '../../api/users'; 
import { useRouter } from 'next/navigation';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function Header() {
    const [username, setUsername] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>('');
    const router = useRouter(); 

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('accessToken');
            const userId = parseInt(localStorage.getItem('userId') || '', 10);

            if (token && userId) {
                try {
                    const userData = await getUserByIdApi(token, userId);
                    setUsername(userData.username);
                    setBgColor(getRandomColor()); 
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');

     
        router.push('/login');
    };

    const userInitial = username ? username.charAt(0).toUpperCase() : 'U';

    return (
        <div className="bg-white left-0 z-50 right-0">
            <header className="flex h-14 items-center justify-between border-b px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
                        <span>Kanban Board</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden rounded-full border"
                        style={{ backgroundColor: bgColor }}
                    >
                        <span className="font-medium text-gray-200">{userInitial}</span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground border-r-2 pr-4">
                        @{username || 'Username'}
                    </div>
                    <button
                        onClick={handleLogout} 
                        className="flex items-center gap-x-2 font-medium text-red-400 hover:text-red-600"
                    >
                        <IoLogOut className="text-2xl" /> Log out
                    </button>
                </div>
            </header>
        </div>
    );
}

export default Header;
