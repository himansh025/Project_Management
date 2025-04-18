import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/apiconfig';
import { TaskList } from '../components/TaskList';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { ProjectHeader } from '../components/ProjectHeader';
import { useSelector } from 'react-redux';
import CreateTask from '../components/CreateTask';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get(`/tasks/getall`);
      const protask = res.data.data.filter((task) => task.projectId === id);
      setTasks(protask);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      console.log("data",taskData)
      // Add the projectId to the task data
      const taskWithProject = {
        ...taskData,
        projectId: id
      };
      
      // Submit the task to the API
      const response = await axiosInstance.post('/tasks/', taskWithProject);
      
      // Show success message
      toast.success('Task created successfully');
      
      // Update the tasks list with the newly created task
      setTasks(prevTasks => [...prevTasks, response.data.data]);
      
      // Close the modal
      handleCloseCreateModal();
    } catch (error) {
      toast.error('Failed to create task: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axiosInstance.get(`projects/getproject/${id}`);
        setProject(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch project details');
      }
    };

    fetchProjectDetails();
    fetchTasks();
  }, [id]);

  const handleupdateProject = async () => {
    try {
      await axiosInstance.patch(`/projects/update/${id}`);
      toast.success('Project deleted successfully');
      // You can redirect or navigate away if needed after deletion
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      // setShowDeleteModal(false);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const id= taskData.id
      await axiosInstance.patch(`/tasks/update/${id}`, taskData);
      toast.success('Task updated successfully');
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, ...taskData } : task
        )
      );
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      console.log(id)
      await axiosInstance.delete(`/tasks/delete/${id}`);
      toast.success('Task deleted successfully');
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-2 mt-10 md:mt-10 sm:p-4">
      <ProjectHeader
        project={project}
        user={user}
        onNewTask={handleOpenCreateModal}
      />


      {user?.role=="admin" && showCreateModal && (
        <CreateTask
          onCancel={handleCloseCreateModal}
          onSubmit={handleCreateTask}
        />
      )}

      {/* Task List */}
      <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />

    </div>
  );
}

export default ProjectDetails;