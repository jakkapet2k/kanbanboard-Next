"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Board from '@/components/Board';

export default function Home() {
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            router.push('/login'); 
        }
    }, [router]);

    const handleBoardSelect = (boardId: number | null) => {
        setSelectedBoardId(boardId);
    };

    return (
        <>
            <Header />
            <main className="flex h-full">
                <Sidebar onBoardSelect={handleBoardSelect} />
                {selectedBoardId !== null ? (
                    <Board boardId={selectedBoardId} />
                ) : (
                    <div className="flex-1 p-4 text-center">
                        Please select a board from the sidebar
                    </div>
                )}
            </main>
        </>
    );
}
