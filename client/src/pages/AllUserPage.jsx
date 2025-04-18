import { useEffect, useState } from 'react';
import axiosInstance from '../config/apiconfig';
import { Briefcase, ListChecks, User } from 'lucide-react';

function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get('/auth/userinfo');
      console.log(res.data)
      const  newdata= res.data.filter((user)=>user.role!=="admin")
      setUsers(newdata); // directly use the full user data
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10">
        👥 All Users 
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map(user => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 text-indigo-700 p-3 rounded-full">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-medium mb-1">
                <Briefcase size={18} /> Projects ({user.projects?.length || 0})
              </div>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                {user.projects?.map(project => (
                  <li key={project._id}>{project.title}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                <ListChecks size={18} /> Tasks ({user.tasks?.length || 0})
              </div>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
                {user.tasks?.map(task =>
                  typeof task === 'object' ? (
                    <li key={task._id}>{task.title}</li>
                  ) : (
                    <li key={task}>{task}</li> // if task is just an ID
                  )
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsersPage;
