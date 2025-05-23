import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/apiconfig';
import { useDispatch } from 'react-redux';
import { logout  } from '../store/slices/authSlice'; // update path as per your structure

function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Optional: Call backend logout route
        await axiosInstance.post('auth/logout', {}, { withCredentials: true });

        // Clear session token from client
        sessionStorage.removeItem("token");

        // Dispatch Redux logout
        dispatch(logout());

        // Navigate to login page
        navigate('/');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return null; // No UI needed
}

export default LogoutButton;
