import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ClipboardList } from 'lucide-react';
import axiosInstance from '../config/apiconfig';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

// Enhanced schema with additional task fields
const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  assignedTo: z.string().min(1, 'Please select a user'),
  priority: z.string(),
  status: z.string(),
  dueDate: z.string()
});

function CreateTask({ onSubmit, onCancel }) {    
  const { id } = useParams(); // Get project ID from URL params
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      status: 'todo'
    }
  });
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/auth/alluser');
        const onlyUsers = response.data.filter((user) => user.role !== "admin");
        setUsers(onlyUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // This function handles the form submission
  const handleFormSubmit = async (formData) => {
    try {
      // Add projectId to the form data
      const taskData = {
        ...formData,
        projectId: id
      };
      
      await onSubmit(taskData);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="bg-white max-w-6xl rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
        <h3 className="text-xl font-bold">Create & Assign New Task</h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              {...register('assignedTo')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select User</option>
              {isLoading ? (
                <option disabled>Loading users...</option>
              ) : (
                users?.map((user) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))
              )}
            </select>
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              {...register('priority')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register('status')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;