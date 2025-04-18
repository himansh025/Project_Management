import { Calendar, EditIcon, Trash2, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import { useSelector } from "react-redux";
import Comments from "./Comments";

const TaskCard = ({ task, index, onEdit, onDelete, userMap }) => {
  // Get username from the userMap or display "Unknown" if not found
  const username = userMap[task.assignedTo] || "Unknown";
  const [editMode, setEditMode] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <h3 className="font-medium text-base sm:text-lg">
            {index + 1}. {task.title}
          </h3>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{task.description}</p>
        </div>

        <div className="flex justify-between sm:justify-end items-center gap-2">
          <div className="flex gap-1 sm:gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium 
                ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
            >
              {task.priority}
            </span>

            <span
              className={`px-2 py-1 text-xs rounded-full font-medium 
                ${
                  task.status === "todo"
                    ? "bg-gray-100 text-gray-800"
                    : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : task.status === "review"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>
          {user && (
            <div className="flex gap-2">
              {/* Comment button to toggle comments */}
              <button
                type="button"
                onClick={() => setShowComments(!showComments)}
                className="p-1 rounded hover:bg-gray-100 transition"
                title="Show Comments"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              
              {/* Edit is visible to all logged-in users */}
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="p-1 rounded hover:bg-blue-100 text-blue-600 transition"
                title="Edit Task"
              >
                <EditIcon className="h-4 w-4" />
              </button>

              {/* Delete is only for admins */}
              {user.role === "admin" && (
                <button
                  type="button"
                  onClick={() => onDelete(task._id)}
                  className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500">
        <div className="flex md:flex-row items-center">
          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span>Assigned to: {username}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Assigned Date: {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Due Date:
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Show comments section when toggled */}
      {showComments && <Comments taskId={task._id} />}

      {editMode && (
        <EditTaskModal
          task={task}
          onSubmit={onEdit}
          onCancel={() => setEditMode(false)}
        />
      )}
    </div>
  );
};

export { TaskCard };