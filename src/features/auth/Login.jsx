import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from './userSlice'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // 1. Call your existing Django View
      const response = await api.post('/accounts/login/', formData);
      
      console.log("Backend Response:", response.data); // Debugging check

      // 2. CRITICAL FIX: Match the exact keys from your Django 'login_user' view
      // Your View returns: { 'username', 'accesstoken', 'refresh_token' }
      const { accesstoken, refresh_token, username } = response.data;

      // 3. Save to Local Storage
      localStorage.setItem('access_token', accesstoken); 
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_info', JSON.stringify({ username }));

      // 4. Update Redux
      // We manually construct the user object because your backend sends 'username' at the top level
      dispatch(loginSuccess({
        token: accesstoken, 
        user: { username: username } 
      }));

      navigate('/'); 

    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.message || "Invalid email or password.";
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Welcome Back</h2>
        
        {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center border border-red-500/50">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 rounded transition duration-200 flex justify-center items-center
                ${loading 
                    ? 'bg-blue-800 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;