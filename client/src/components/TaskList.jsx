import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardList, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Clock, 
  AlertCircle, 
  User, 
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react';
import CreateProject from '../pages/CreateProject';
import axiosInstance from '../config/apiconfig';

function TaskList({ projectId, currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  
  // Filtering and sorting state
  const [filter, setFilter] = useState('all'); // 'all' or 'mine'
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // fetchTasks();
    fetchUsers();
  }, [projectId, filter, sortField, sortDirection]);

  


  // const fetchTasks = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`http://localhost:5000/api/tasks`, {
  //       params: {
  //         projectId,
  //         filter,
  //         sortField,
  //         sortDirection
  //       },
  //       withCredentials: true
  //     });
  //     setTasks(response.data);
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to load tasks');
  //     console.error('Error fetching tasks:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/auth/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    setShowCreateTask(false);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`, { withCredentials: true });
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'review': return 'Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  if (isLoading && tasks.length === 0) {
    return <div className="flex justify-center p-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <ClipboardList className="mr-2 h-6 w-6 text-blue-600" />
          Tasks
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateTask(!showCreateTask)}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            {showCreateTask ? 'Cancel' : '+ Add Task'}
          </button>
        </div>
      </div>

      {showCreateTask && (
        <div className="mb-6">
          <CreateProject 
            projectId={projectId} 
            onTaskCreated={handleTaskCreated} 
            onCancel={() => setShowCreateTask(false)} 
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
          <div className="flex items-center space-x-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${filter === 'mine' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              onClick={() => setFilter('mine')}
            >
              My Tasks
            </button>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          
          <button
            className={`px-3 py-1 rounded-md text-sm flex items-center ${sortField === 'priority' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => toggleSort('priority')}
          >
            Priority {renderSortIcon('priority')}
          </button>
          
          <button
            className={`px-3 py-1 rounded-md text-sm flex items-center ${sortField === 'status' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => toggleSort('status')}
          >
            Status {renderSortIcon('status')}
          </button>
          
          <button
            className={`px-3 py-1 rounded-md text-sm flex items-center ${sortField === 'createdAt' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => toggleSort('createdAt')}
          >
            Date {renderSortIcon('createdAt')}
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Create a new task to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks?.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {formatStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-900">{getUserName(task.assignedTo)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 

export default TaskList;