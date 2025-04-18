import React, { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import axiosInstance from '../config/apiconfig';


const TaskList = ({ tasks, onEdit, onDelete }) => {
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/auth/alluser');
        
        // Create a map of user IDs to names
        const userMapping = {};
        response.data.forEach(user => {
          userMapping[user._id] = user.name;
        });
        
        setUserMap(userMapping);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading tasks and user data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Project Tasks ({tasks?.length || ""})</h2>
      {tasks?.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">No tasks found for this project</div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {tasks.map((task, idx) => (
            <TaskCard
              key={task._id}
              task={task}
              index={idx}
              onEdit={onEdit}
              onDelete={onDelete}
              userMap={userMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export {TaskList}