import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Prepare data (Backend usually doesn't want 'confirmPassword')
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      // 3. Call Backend
      // Adjust URL to match your Django URL (often /users/register/)
      await api.post('/accounts/register/', dataToSend);
      
      // 4. On Success: Redirect to Login
      alert("Registration successful! Please log in.");
      navigate('/login');

    } catch (err) {
      console.error("Registration Error:", err);
      // Try to read the specific error message from Django
      setError(err.response?.data?.detail || "Registration failed. Try a different username.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Create Account</h2>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              name="username"
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded transition duration-200 ${
                isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;