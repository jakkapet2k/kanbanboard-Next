import React from 'react';
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaEdit } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';

interface Task {
    id: number;
    content: string;
    description?: string;
    tags?: string[]; // Make tags optional
}

interface ColumnData {
    id: number;
    title: string;
    tasks: Record<number, Task>;
}

interface ColumnProps {
    column: ColumnData;
    handleEditColumn: (columnId: number) => void;
    handleDeleteColumn: (columnId: number) => void;
    handleEditTask: (taskId: number) => void;
    handleDeleteTask: (taskId: number) => void;
}

const Column: React.FC<ColumnProps> = ({ column, handleEditColumn, handleDeleteColumn, handleEditTask, handleDeleteTask }) => {
    const tasks = Object.values(column.tasks);

    return (
        <Droppable droppableId={String(column.id)}>
            {(provided) => (
                <div
                    className="bg-gray-100 p-4 rounded-md w-[370px] border"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">{column.title}</h2>
                        <div className="relative flex items-center border rounded-md">
                            <button
                                className="bg-white hover:bg-yellow-300 border-l p-2"
                                onClick={() => handleEditColumn(column.id)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="bg-white hover:bg-red-300 border-r p-2 rounded-r-md"
                                onClick={() => handleDeleteColumn(column.id)}
                            >
                                <MdDeleteSweep />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                {(provided) => (
                                    <div
                                        className="bg-white p-4 rounded-md shadow-md mb-2"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold">{task.content}</h3>
                                            <div className="relative flex items-center border rounded-md">
                                                <button
                                                    className="bg-white hover:bg-yellow-300 border-l p-2"
                                                    onClick={() => handleEditTask(task.id)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="bg-white hover:bg-red-300 border-r p-2 rounded-r-md"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                >
                                                    <MdDeleteSweep />
                                                </button>
                                            </div>
                                        </div>
                                        <p className='text-xs my-2 bg-black/10 p-2 rounded-md'>{task.description}</p>
                                        {task.tags && task.tags.length > 0 ? ( 
                                            <div className="mt-2 flex items-center">
                                                <strong>Tags:</strong>
 
                                                    {task.tags.map((tag, idx) => (

                                                        <div
                                                            className="inline-flex items-center justify-between space-x-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-md text-sm">
                                                            <svg  className="cursor-pointer h-4 w-4 text-green-900"
                                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            <div className="select-none" key={idx}>
                                                                {tag}
                                                            </div>
                                                        </div>
                                                    ))}
                                          
                                            </div>
                                        ) : (
                                            <div className="mt-2 text-gray-500 text-xs">No tags available</div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
}

export default Column;
