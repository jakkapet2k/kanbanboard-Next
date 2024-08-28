"use client";
import React, { useState, useEffect } from 'react';
import { createBoardApi, getAllBoards, updateBoardApi, deleteBoardApi } from '../../api/boards';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
import { getBoardMembersApi } from '../../api/boardMembers';

interface Board {
    id: number;
    name: string;
}

interface SidebarProps {
    onBoardSelect: (boardId: number | null) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ onBoardSelect }) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [boardsMember, setBoardsMember] = useState<Board[]>([]);
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchBoards = async () => {
            const token = localStorage.getItem('accessToken');
            const userId =  localStorage.getItem('userId')
            console.log('userId',userId);
            
            if (token) {
                try {
                    const boardsData = await getAllBoards(token);
                    setBoards(boardsData);
                    const boardsMemberData = await getBoardMembersApi(token);
                    console.log(boardsMemberData);  
                    const filteredBoardsMemberData = boardsMemberData.filter((bd: any) => bd.user_id == userId);
                    console.log(filteredBoardsMemberData);  
                    setBoardsMember(filteredBoardsMemberData);
                } catch (err) {
                    setError('Failed to load boards.');
                }
            } else {
                setError('No access token found.');
            }
        };

        fetchBoards();
    }, []);

    const handleCreateNewBoard = async () => {
        const newBoardName = prompt('Enter the new board name:');
        if (newBoardName) {
            try {
                const token = localStorage.getItem('accessToken') || '';
                const userId = Number(localStorage.getItem('userId'));

                const newBoard = await createBoardApi(token, { name: newBoardName, user_id: userId });

                setBoards([...boards, newBoard]);
                setCurrentBoard(newBoard);
                onBoardSelect(newBoard.id); 
            } catch (error) {
                console.error("Error creating new board", error);
                alert('Failed to create new board. Please try again.');
            }
        }
    };
    const handleEditBoard = async (boardId: number) => {
        const newBoardName = prompt('Enter the new board name:');
        if (newBoardName) {
            try {
                const token = localStorage.getItem('accessToken') || '';


                const updatedBoard = await updateBoardApi(token, boardId, { name: newBoardName });


                setBoards(prevBoards => prevBoards.map(board => board.id === boardId ? updatedBoard : board));
                if (currentBoard?.id === boardId) {
                    setCurrentBoard(updatedBoard);
                }
                alert('Board updated successfully.');
                window.location.reload(); 
            } catch (error) {
                console.error("Error updating board", error);
                alert('Failed to update the board. Please try again.');
            }
        }
    };

    const handleDeleteBoard = async (boardId: number) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await deleteBoardApi(token, boardId);


            setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
            if (currentBoard?.id === boardId) {
                setCurrentBoard(null);
                onBoardSelect(null); 
            }
            alert('Board deleted successfully.');
            window.location.reload(); 
        } catch (error) {
            console.error("Error deleting board", error);
            alert('Failed to delete the board. Please try again.');
        }
    };

    const handleBoardSelect = (board: Board) => {
        setCurrentBoard(board);
        onBoardSelect(board.id); 
    };

    return (
        <div className="bg-white left-0 z-30 w-[18.75rem] flex-none">
            <aside className="border-r min-h-screen px-2">
                <p className={`text-xs font-medium p-3 border-b mb-2 ${boards.length === 0 ? 'text-gray-500' : 'text-muted-foreground'}`}>
                    Your Board {`All Boards (${boards.length})`}
                </p>
                <div className="space-y-2">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {boards.length === 0 ? (
                        <p className="text-xs text-center text-gray-500">No boards available</p>
                    ) : (
                        <div className="space-y-2">
                            {boards.map(board => (
                                <div key={board.id} className='flex items-center'>
                                    <button
                                        className={`text-xs p-3 w-full rounded-s-md ${currentBoard?.id === board.id ? 'bg-blue-400 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                        onClick={() => handleBoardSelect(board)}
                                    >
                                        {board.name}
                                    </button>
                                    <button
                                        className="bg-white hover:bg-yellow-300 border-y p-2"
                                        onClick={() => handleEditBoard(board.id)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="bg-white hover:bg-red-300 border p-2 rounded-r-md"
                                        onClick={() => handleDeleteBoard(board.id)}
                                    >
                                        <MdDeleteSweep />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        className="text-xs border border-dashed hover:bg-black/10 p-3 w-full rounded-lg"
                        onClick={handleCreateNewBoard}
                    >
                        + Create New Board
                    </button>
                </div>

                <p className={`text-xs font-medium p-3 border-y my-2 ${boardsMember.length === 0 ? 'text-gray-500' : 'text-muted-foreground'}`}>
                    Board Members {`All Boards (${boardsMember.length})`}
                </p>
                {boardsMember.length === 0 ? (
                        <p className="text-xs text-center text-gray-500">No boards available</p>
                    ) : (
                        <div className="space-y-2">
                            {boardsMember.map(boardMember => (
                                <div key={boardMember.id} className='flex items-center'>
                                    <button
                                        className={`text-xs p-3 w-full rounded-s-md ${currentBoard?.id === boardMember.id ? 'bg-blue-400 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                        onClick={() => handleBoardSelect(boardMember)}
                                    >
                                        {boardMember.name}
                                    </button>
                                    <button
                                        className="bg-white hover:bg-yellow-300 border-y p-2"
                                        onClick={() => handleEditBoard(boardMember.id)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="bg-white hover:bg-red-300 border p-2 rounded-r-md"
                                        onClick={() => handleDeleteBoard(boardMember.id)}
                                    >
                                        <MdDeleteSweep />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
            </aside>
        </div>
    );
};

export default Sidebar;
