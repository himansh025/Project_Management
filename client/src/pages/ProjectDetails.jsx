import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Folder, Calendar, Users, ArrowLeft } from 'lucide-react';
import TaskList from '../components/TaskList';
import axiosInstance from '../config/apiconfig';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [alltasks, setallTasks] = useState([]);

  const fetchallTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/tasks`);
      setallTasks(response.data);
      console.log(response.data)
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectAndUser = async () => {
    try {
      setIsLoading(true);
      

      // Fetch project details
      const projectResponse = await axiosInstance.get(`/projects/getproject/${id}`)
      console.log("fdf",projectResponse.data)
      setProject(projectResponse.data);
      
      // Fetch current user
      const userResponse = await axios.get('/api/auth/me', {
        withCredentials: true
      });
      setCurrentUser(userResponse.data);
      
      setError(null);
    } catch (err) {
      setError('Failed to load project details');
      console.error('Error fetching project details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchallTasks()
    fetchProjectAndUser();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error || 'Project not found'}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button
        onClick={() => navigate('/projects')}
        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Folder className="h-10 w-10 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created on {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="ml-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Project
            </button>
          )}
        </div>

        <div className="mt-4 prose max-w-none text-gray-700">
          <p>{project.description}</p>
        </div>
      </div>

      <TaskList projectId={id} currentUser={currentUser} />
    </div>
  );
}

export default ProjectDetails;