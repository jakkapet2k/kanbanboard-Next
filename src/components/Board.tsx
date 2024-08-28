"use client";
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { FaEdit } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
import Column from './Column';
import { createColumnApi, getAllColumnsApi, deleteColumnApi, updateColumnApi } from '../../api/columns';
import { createTaskApi, getAllTasksApi, deleteTaskApi, updateTaskApi } from '../../api/tasks';
import { getBoardByIdApi } from '../../api/boards';
import { inviteMemberApi, getBoardMembersApi } from '../../api/boardMembers'; 
import { Columns, Task, ColumnType } from '../../types'; 

interface BoardProps {
    boardId: number;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
    const [boardName, setBoardName] = useState<string>('Project Board');
    const [columns, setColumns] = useState<Columns>({});
    const [newColumnTitle, setNewColumnTitle] = useState<string>('');
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [newTaskTags, setNewTaskTags] = useState<string>('');
    const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
    const [dataChanged, setDataChanged] = useState(false);

    // New states for column editing
    const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
    const [newColumnTitleForEdit, setNewColumnTitleForEdit] = useState<string>('');

    // New states for board members
    const [members, setMembers] = useState<string[]>([]);
    const [inviteEmail, setInviteEmail] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken') || '';

                const boardResponse = await getBoardByIdApi(token, boardId);
                setBoardName(boardResponse.name || 'Project Board');

                const columnsResponse = await getAllColumnsApi(token);
                const filteredColumns = columnsResponse.filter((item: any) => item.board_id === boardId);

                const columnIds = filteredColumns.map((column: ColumnType) => column.id);

                const tasksResponse = await getAllTasksApi(token);
                const filteredTasks = tasksResponse.filter((task: any) => columnIds.includes(task.column_id));

                const columns: Columns = {};
                filteredColumns.forEach((column: ColumnType) => {
                    columns[column.id] = { ...column, tasks: {} };
                });

                filteredTasks.forEach((task: Task) => {
                    const column = columns[task.column_id];
                    if (column) {
                        column.tasks[task.id] = task;
                    }
                });

                setColumns(columns);


            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [boardId, dataChanged]);


    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        const startColumnId = parseInt(source.droppableId);
        const finishColumnId = parseInt(destination.droppableId);

        const startColumn = columns[startColumnId];
        const finishColumn = columns[finishColumnId];

        if (!startColumn || !finishColumn) return;

        if (startColumnId === finishColumnId) {
            const newTaskIds = Array.from(Object.keys(startColumn.tasks));
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newTasks = newTaskIds.reduce((acc: Record<number, Task>, id: string) => {
                const taskId = parseInt(id);
                if (startColumn.tasks[taskId]) {
                    acc[taskId] = startColumn.tasks[taskId];
                }
                return acc;
            }, {});

            setColumns((prev: any) => ({
                ...prev,
                [startColumnId]: { ...startColumn, tasks: newTasks }
            }));
        } else {
            const startTaskIds = Array.from(Object.keys(startColumn.tasks));
            startTaskIds.splice(source.index, 1);

            const newStartTasks = startTaskIds.reduce((acc: Record<number, Task>, id: string) => {
                const taskId = parseInt(id);
                if (startColumn.tasks[taskId]) {
                    acc[taskId] = startColumn.tasks[taskId];
                }
                return acc;
            }, {});

            const finishTaskIds = Array.from(Object.keys(finishColumn.tasks));
            finishTaskIds.splice(destination.index, 0, draggableId);

            const newFinishTasks = finishTaskIds.reduce((acc: Record<number, Task>, id: string) => {
                const taskId = parseInt(id);
                if (finishColumn.tasks[taskId]) {
                    acc[taskId] = finishColumn.tasks[taskId];
                }
                return acc;
            }, {});

            setColumns((prev: any) => ({
                ...prev,
                [startColumnId]: { ...startColumn, tasks: newStartTasks },
                [finishColumnId]: { ...finishColumn, tasks: newFinishTasks }
            }));

            try {
                const token = localStorage.getItem('accessToken') || '';
                await updateTaskApi(token, parseInt(draggableId), {
                    content: startColumn.tasks[parseInt(draggableId)].content,
                    description: startColumn.tasks[parseInt(draggableId)].description,
                    column_id: finishColumnId
                });
                setDataChanged(prev => !prev);
            } catch (error) {
                console.error("Error updating task", error);
            }
        }
    };

    const addColumn = async () => {
        if (newColumnTitle.trim() === '') return;

        try {
            const token = localStorage.getItem('accessToken') || '';
            await createColumnApi(token, { board_id: boardId, title: newColumnTitle });
            setNewColumnTitle('');
            const columnsResponse = await getAllColumnsApi(token);
            const filteredColumns = columnsResponse.filter((item: any) => item.board_id === boardId);
            const columnIds = filteredColumns.map((column: any) => column.id);
            const tasksResponse = await getAllTasksApi(token);
            const filteredTasks = tasksResponse.filter((task: any) => columnIds.includes(task.column_id));

            const columns: Columns = {};
            filteredColumns.forEach((column: ColumnType) => {
                columns[column.id] = { ...column, tasks: {} };
            });

            filteredTasks.forEach((task: Task) => {
                const column = columns[task.column_id];
                if (column) {
                    column.tasks[task.id] = task;
                }
            });

            setColumns(columns);
            setDataChanged(prev => !prev);
        } catch (error) {
            console.error("Error adding column", error);
        }
    };

    const addTask = async () => {
        if (newTaskName.trim() === '' || selectedColumnId === null) return;
    
        try {
            const token = localStorage.getItem('accessToken') || '';
            const tagsArray = newTaskTags ? newTaskTags.split(',').map(tag => tag.trim()) : [];
    
            const task = await createTaskApi(token, {
                column_id: selectedColumnId,
                content: newTaskName,
                description: newTaskDescription,
                tags: tagsArray, 
            });
    
            setNewTaskName('');
            setNewTaskDescription('');
            setNewTaskTags(''); 
            setSelectedColumnId(null);
            setColumns(prev => {
                const updatedColumns = { ...prev };
                if (updatedColumns[selectedColumnId!]) {
                    updatedColumns[selectedColumnId!].tasks[task.id] = task;
                }
                return updatedColumns;
            });
            setDataChanged(prev => !prev);
        } catch (error) {
            console.error("Error adding task", error);
        }
    };
    

    const handleEditColumn = async (columnId: number) => {
        const newTitle = prompt('Enter the new column title:');
        if (newTitle && newTitle.trim() !== '') {
            try {
                const token = localStorage.getItem('accessToken') || '';
                await updateColumnApi(token, columnId, { title: newTitle });
                setColumns(prev => {
                    const updatedColumns = { ...prev };
                    if (updatedColumns[columnId]) {
                        updatedColumns[columnId].title = newTitle;
                    }
                    return updatedColumns;
                });
                alert('Column updated successfully.');
                setDataChanged(prev => !prev);
            } catch (error) {
                console.error("Error updating column", error);
                alert('Failed to update the column. Please try again.');
            }
        }
    };

    const handleDeleteColumn = async (columnId: number) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await deleteColumnApi(token, columnId);
            setColumns(prev => {
                const newColumns = { ...prev };
                delete newColumns[columnId];
                return newColumns;
            });
            alert('Column deleted successfully.');
            setDataChanged(prev => !prev);
        } catch (error) {
            console.error("Error deleting column", error);
            alert('Failed to delete the column. Please try again.');
        }
    };

    const handleEditTask = async (taskId: number) => {
        const newContent = prompt('Enter the new task content:');
        const newDescription = prompt('Enter the new task description:');
        const newTags = prompt('Enter the new task tags (comma-separated):');
        if (newContent && newDescription) {
            try {
                const token = localStorage.getItem('accessToken') || '';
                const updatedTask = await updateTaskApi(token, taskId, {
                    content: newContent,
                    description: newDescription,
                    tags: newTags ? newTags.split(',').map(tag => tag.trim()) : [] 
                });
                setColumns(prev => {
                    const updatedColumns = { ...prev };
                    const columnId = Object.keys(updatedColumns).find(columnId => taskId in updatedColumns[parseInt(columnId)].tasks);
                    if (columnId) {
                        const column = updatedColumns[parseInt(columnId)];
                        if (column) {
                            column.tasks[taskId] = updatedTask;
                        }
                    }
                    return updatedColumns;
                });
                alert('Task updated successfully.');
                setDataChanged(prev => !prev);
            } catch (error) {
                console.error("Error updating task", error);
                alert('Failed to update the task. Please try again.');
            }
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await deleteTaskApi(token, taskId);
            setColumns(prev => {
                const newColumns = { ...prev };
                const columnId = Object.keys(newColumns).find(columnId => taskId in newColumns[parseInt(columnId)].tasks);
                if (columnId) {
                    const column = newColumns[parseInt(columnId)];
                    if (column) {
                        delete column.tasks[taskId];
                    }
                }
                return newColumns;
            });
            alert('Task deleted successfully.');
            setDataChanged(prev => !prev);
        } catch (error) {
            console.error("Error deleting task", error);
            alert('Failed to delete the task. Please try again.');
        }
    };

    const inviteMember = async () => {
        if (inviteEmail.trim() === '') return;

        try {
            const token = localStorage.getItem('accessToken') || '';
            await inviteMemberApi(token, boardId, inviteEmail);
            setInviteEmail('');
            // Re-fetch members
            const membersResponse = await getBoardMembersApi(token);
            setMembers(membersResponse.members);
        } catch (error) {
            console.error("Error inviting member", error);
        }
    };

    return (
        <div className='w-full relative'>
        <div className="flex justify-between items-center px-20 border-b py-5 bg-black/10">
            <p className="font-bold">{boardName}</p>
            <div className="space-x-4 flex items-center">
                <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="New Column Title"
                    className="border p-2 text-xs rounded-md"
                />
                <button
                    className="bg-white hover:bg-gray-200 border p-2 text-xs rounded-md"
                    onClick={addColumn}
                >
                    + Add Column
                </button>
            </div>
        </div>
        <div className="p-10">
           
            <div className="mb-4">
                <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Task Name"
                    className="border p-2 text-xs rounded-md mr-2"
                />
                <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task Description"
                    className="border p-2 text-xs rounded-md mr-2"
                />
                <input
                    type="text"
                    value={newTaskTags}
                    onChange={(e) => setNewTaskTags(e.target.value)}
                    placeholder="Task Tags (comma-separated)"
                    className="border p-2 text-xs rounded-md mr-2"
                />
                <select
                    value={selectedColumnId || ''}
                onChange={(e) => setSelectedColumnId(Number(e.target.value))}
                    className="border p-2 text-xs rounded-md mr-2"
                >
                    <option value="">Select Column</option>
                    {Object.values(columns).map(column => (
                        <option key={column.id} value={column.id}>{column.title}</option>
                    ))}
                </select>
                <button
                    className="bg-white hover:bg-gray-200 border p-2 text-xs rounded-md"
                    onClick={addTask}
                >
                    + Add Task
                </button>
            </div>

          
            <div className="mb-4">
                <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Invite Member by Email"
                    className="border p-2 text-xs rounded-md mr-2"
                />
                <button
                    className="bg-white hover:bg-gray-200 border p-2 text-xs rounded-md"
                    onClick={inviteMember}
                >
                    Invite Member
                </button>
            </div>

            

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4">
                    {Object.keys(columns).length === 0 ? (
                        <div className="flex-1 p-4 text-center">Data Not Available!</div>
                    ) : (
                        Object.values(columns).map(column => (
                            <Column
                                key={column.id}
                                column={column}
                                handleEditColumn={handleEditColumn}
                                handleDeleteColumn={handleDeleteColumn}
                                handleEditTask={handleEditTask}
                                handleDeleteTask={handleDeleteTask}
                            />
                        ))
                    )}
                </div>
            </DragDropContext>
        </div>
    </div>
);
}

export default Board;
