import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
// import ProjectHandler from './components/ProjectHandler';

function App() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          <Route path="/" element={ <Dashboard /> } />
          {/* <Route path="/handle-project" element={ <ProjectHandler  />}  /> */}
          <Route path="/projects/new" element={ <CreateProject  />}  />
          <Route path="/projects/:id" element={ <ProjectDetails />  } />

          {/* <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} /> */}
          {/* <Route path="/projects/new" element={user?.role === 'admin' ? <CreateProject /> : <Navigate to="/" />} /> */}
          {/* <Route path="/projects/:id" element={user ? <ProjectDetails /> : <Navigate to="/login" />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;