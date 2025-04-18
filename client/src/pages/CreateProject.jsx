import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClipboardList, Users } from 'lucide-react';
import axiosInstance from '../config/apiconfig';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

function CreateProject({ onSubmit,onCancel }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(projectSchema)
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/auth/alluser');
        // console.log(response.data,"users")
        const onlyuser= response.data.filter((users)=>users.role!="admin")
        // console.log(onlyuser)
        setUsers(onlyuser);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // This function handles the form submission
  const handleFormSubmit = async (formData) => {
    console.log(" clicked")
    try {
      console.log("formdata",formData)
      // Call the parent's onSubmit callback with the form data
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
      // Note: Error handling should be done in the parent component
    }
  };


  return (
    <div className="bg-white  max-w-6xl rounded-lg shadow-md p-6">
      <div className="flex items-center p-10 mb-6">
        <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
        <h3 className="text-xl font-bold">Create New Project</h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter Project title"
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
            placeholder="Enter Project description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
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

export default CreateProject;