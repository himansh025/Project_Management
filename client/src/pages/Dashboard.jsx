import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';
import axiosInstance from '../config/apiconfig';
import CreateProject from './CreateProject';
import { toast } from 'react-toastify';
import ImageSlider from '../components/ImageSlider';
import DeleteConfirmation from '../components/DeleteConfirmation';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);
  console.log("user",user)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleCreateProject = async (projectData) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post('/projects/', projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Project Created Successfully!");
      refreshProjects();
      handleCloseCreateModal();
    } catch (error) {
      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = async () => {
    try {
      const response = await axiosInstance.get("/projects/");
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    const id= projectToDelete
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.delete(`/projects/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Project deleted successfully");
      refreshProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleOpenDeleteModal = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  useEffect(() => {
    refreshProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl min-h-screen md:px-6 mt-8 md:mt-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Projects Overview</h1>
         
        {user?.role == 'admin' && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      <ImageSlider/>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateProject
              onSubmit={handleCreateProject}
              onCancel={handleCloseCreateModal}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmation
          message="Are you sure you want to delete this project? All associated tasks will also be deleted."
          onConfirm={handleDeleteProject}
          onCancel={() => {
            setShowDeleteModal(false);
            setProjectToDelete(null);
          }}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 mt-4 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:-translate-y-1 relative"
            >
              {/* Delete button (only for admin) */}
              { user && user?.role ==='admin' && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenDeleteModal(project._id);
                  }}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                  title="Delete project"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <Link to={`/projects/${project._id}`} className="block h-full">
                <div className="flex flex-col justify-between h-full">
                  {/* Title + Icon */}
                  <div className="flex justify-between items-start mb-4 pr-6">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-600 rounded-lg p-2">
                      <Briefcase size={20} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                    {project.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>{project.tasks?.length || 0} Tasks</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-500">
              Projects you create or are assigned to will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;