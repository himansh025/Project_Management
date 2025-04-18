import React, { useState } from 'react';

function EditTaskModal({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate.split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: task._id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onCancel(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTaskModal;
