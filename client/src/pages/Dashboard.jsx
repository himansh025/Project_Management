import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../config/apiconfig';
import CreateProject from './CreateProject';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);  
  const { user } = useSelector(state => state.auth);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalType, setModalType] = useState(null);
   // 'create', 'update', 'assign', 'delete'
   const [showCreateModal, setShowCreateModal] = useState(false);
   console.log(showCreateModal)

  // API operations
  const handleCreateProject = async (projectData) => {
    setLoading(true);
    try {
      await axiosInstance.post('/projects/create', projectData);
      refreshProjects();
      closeModal();
    } catch (error) {
      console.error('Creation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  


  const handleAssign = async (userIds) => {
    setLoading(true);
    try {
      await axios.patch(`/api/projects/${selectedProject._id}/assign`, { userIds });
      refreshProjects();
      closeModal();
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenCreateModal = () => {
    console.log(showCreateModal)
    setShowCreateModal(true);
  }
  
  const handleCloseCreateModal = () => {
    console.log(showCreateModal)
    setShowCreateModal(false);
  }
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects Overview</h1>
      
     {/* create button */}
        <div className="action-buttons">
        <button 
          onClick={handleOpenCreateModal}
          className="btn-create bg-blue-700 font-bold text-white rounded-lg px-2 py-2"
        >
          Create Project
        </button>
      </div>

      {/* create Modals */}
      {showCreateModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
        <div className="bg-white max-h-[90vh] w-[90%] md:w-max overflow-y-auto rounded-lg p-4">
          <CreateProject
            onSubmit={handleCreateProject}  // Pass submission handler
            onCancel={handleCloseCreateModal}  // Pass cancel handler
          />
        </div>
      </div>
    )}

        {user?.role === 'admin' && (
          <Link to="/projects/new" className="btn-primary">
            Create New Project
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.length > 0 ? projects.map(project => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Briefcase className="text-indigo-600" size={20} />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={16} />
                <span>{project.tasks?.length || 0} Tasks</span>
              </div>
            </div>
          </Link>
        )) : (
          <div className="text-center py-12 col-span-full">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="text-gray-500" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Projects Yet</h3>
            <p className="text-gray-500">Projects you create or are assigned to will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;