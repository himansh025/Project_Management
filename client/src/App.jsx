import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Layout from './components/Layout';
import AllUsersPage from './pages/AllUserPage';
import LogoutButton from './components/LogoutButton';
import TaskListforUser from './components/TaskListforUser';

function App() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
          <Route element={<Layout />}>
        {/* Public Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login /> } />
              <Route path="/register" element={ <Register />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              
           
          {/* auth for admin */}
          {
            user&&(
             <>
              <Route path="/task-list" element={< TaskListforUser />} /> 
              <Route path="/logout" element={< LogoutButton />} />
             </>
            )
          }
          {
            user && user.role=="admin"&&(
              <>
              <Route path="/projects/new" element={<CreateProject />} />
              <Route path="/all-users" element={<AllUsersPage />} />
              </>
            )
          }
         
          </Route>

      </Routes>
    </div>
  );
}

export default App;
