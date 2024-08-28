

import React from 'react';
import { Task as TaskType } from '../../types';

interface TaskProps {
    task: TaskType;
    handleEditTask: (taskId: number) => void;
    handleDeleteTask: (taskId: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, handleEditTask, handleDeleteTask }) => {
    return (
        <div className="bg-white p-2 rounded-md shadow-sm">
            <div className="flex justify-between items-center">
                <span className="font-bold">{task.content}</span>
                <div className="flex space-x-2">
                    <button onClick={() => handleEditTask(task.id)} className="text-blue-500">
                        Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-red-500">
                        Delete
                    </button>
                </div>
            </div>
            <p>{task.description}</p>
        </div>
    );
};

export default Task;
