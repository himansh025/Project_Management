import { Calendar, Delete, Folder, Plus } from "lucide-react";
import { User } from "lucide-react";
const ProjectHeader = ({ project, user, onNewTask }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      {/* Responsive layout: column on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
        {/* Left Side: Icon + Info */}
        <div className="flex flex-row items-start">
          <Folder className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{project?.title}</h1>

            <div className="mt-1 text-xs sm:text-sm text-gray-500 flex items-center">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>Created By: {project?.createdBy?.name}</span>
            </div>

            <div className="mt-1 text-xs sm:text-sm text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>
                Created on {new Date(project?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Buttons */}
        {user?.role === "admin" && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 self-start md:self-auto">
            {/* <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow hover:bg-blue-700 w-full sm:w-auto"
            >
              Edit Project
            </button> */}
            <button
              type="button"
              onClick={onNewTask}
              className="bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow hover:bg-blue-800 flex items-center  justify-center w-full sm:w-auto"
            >
              <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span>New Task</span>
            </button>
    
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">
        {project?.description}
      </div>
    </div>
  );
};
export {ProjectHeader}