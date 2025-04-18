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
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function TaskListforUser() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [EditStatus,setEditStatus]= useState(false)
  const [filter, setFilter] = useState('all'); // 'all' or 'mine'
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [tempStatus, setTempStatus] = useState(null);
    const [assignedUsernames, setAssignedUsernames] = useState({});
  
const {user} = useSelector((state)=>state.auth)
  const [users, setUsers] = useState([]);


  useEffect(() => {
    if (filter === 'mine') {
      setFilteredTasks(tasks.filter(task => task.assignedTo === user._id));
    } else {
      setFilteredTasks(tasks);
    }
  }, [filter, tasks, user._id]);



  const fetchAndStoreAssignedUser = async (userId) => {
    if (assignedUsernames[userId]) return; // already fetched
  
    try {
      const res = await axiosInstance.get(`/auth/username/${userId}`, {
        withCredentials: true,
      });
      console.log(res.data,"for user name")
      if (res.status === 200) {
        setAssignedUsernames((prev) => ({
          ...prev,
          [userId]: res.data.name,
        }));
      }
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };
  
  
  useEffect(() => {
    const uniqueUserIds = new Set(tasks.map((task) => task.assignedTo));
    console.log(uniqueUserIds,"aya")
    uniqueUserIds.forEach((userId) => {
      if (userId) fetchAndStoreAssignedUser(userId);
    });
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

 const handleSubmitUpdate=  async (updatestatus,id) => {

  try {
    setIsLoading(true);
    const response = await axiosInstance.patch(`/tasks/update/status/${id}`,{status:updatestatus},{
      withCredentials: true
    });
    console.log("updateed task",response.data)
    toast.success(response.data.message)

    // setTasks(response?.data.data);
    setError(null);
  } catch (err) {
    setError('Failed to load tasks');
    console.error('Error updating tasks:', err);
  } finally {
    setIsLoading(false);
  }
};



  const fetchTasks = async () => {
    try {
      setIsLoading(true);      
      const response = await axiosInstance.get(`/tasks/getall`,{
        withCredentials: true
      });
      console.log("user tasks",response.data)
      setTasks(response?.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/auth/users', { withCredentials: true });
      console.log(response)
      setUsers(response?.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
    console.log(userId)
    console.log(users)
    const user = users.find(u => u._id === userId);
    // return "unknown";
     return user ? user.name :'Unknown User';
  };

  const getPriorityColor = (priority) => {
    console.log("pri",priority)

    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditstatus= ()=>{
    setEditStatus(true)
  }

  const getStatusColor = (status) => {
    console.log("stauts",status)
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status) => {
    console.log("stauts",status)

    switch (status) {
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
      </div>
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

        {/* for the sorting the tasks */}

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

      {filteredTasks.length === 0 ? (
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
              {filteredTasks?.map((task) => (
                <tr key={task._id}>
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
                       <span>
                    {assignedUsernames[task.assignedTo] || "Loading..."}
                  </span> 
                      {/* <span className="text-sm text-gray-900">{getUserName(task.assignedTo)}</span> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>

                  {/* hadnle edit */}
   
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <div className="relative flex items-center justify-end space-x-2">
    <button
      className="text-blue-600 hover:text-blue-900"
      title="Edit Task"
      onClick={handleEditstatus}
    >
      <Edit className="h-4 w-4" />
    </button>

    {EditStatus && (
      <div className="absolute bottom-6 right-0 z-10 w-56 md:p-1  border bg-white rounded shadow-lg space-y-2">
        <label className="block text-sm font-medium text-gray-700">New Status:</label>
        <select
          onChange={(e) => setTempStatus(e.target.value)}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm"
          defaultValue=""
        >
          <option disabled value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setEditStatus(false)}
            className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => (handleSubmitUpdate(tempStatus, task._id),setEditStatus(false))}
            className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    )}
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

export default TaskListforUser;