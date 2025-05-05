import React, { useState } from 'react';
import { X, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'Admin'>('user');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (role === 'Admin' && !email.endsWith('@admin.roadmonitor.in')) {
      setError('Admin accounts must use an @admin.roadmonitor.in email');
      return;
    }
  
    if (role === 'user' && !email.endsWith('@roadmonitor.in')) {
      setError('User accounts must use an @roadmonitor.in email');
      return;
    }
  
    const userName = email.split('@')[0];
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        role: role,
        password: password, 
      });
  
      if (response.status === 200) {
        login(userName, email, role);
  
        if (role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/index');
        }
  
        onClose();
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred while logging in.');
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="absolute inset-0 bg-dark-slate/50" onClick={onClose}></div>

      <div className="relative bg-cream rounded-lg shadow-xl w-full max-w-md p-6 modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-slate hover:text-forest-green transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-dark-slate">
              Login as:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'Admin')}
              className="w-full px-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
            >
              <option value="user">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-dark-slate">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                placeholder={role === 'Admin' ? 'admin@admin.roadmonitor.in' : 'user@roadmonitor.in'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-dark-slate">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-forest-green hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-forest-green hover:bg-forest-green/90 text-cream py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <span>Login</span>
            <ChevronRight size={18} className="ml-1" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-dark-slate">
            Don't have an account?{' '}
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                navigate('/signup');
              }}
              className="text-forest-green hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

/* fuctions to understand the code better 
useState(...)	Manages state for email, password, role, and error
useNavigate()	React Router hook to programmatically redirect users
useUser()	Custom context hook to access the global user state (login function)
handleSubmit(e)	Handles form submission: validates, logs in, redirects, closes modal
onClose()	Passed as prop to close the modal (when clicking outside or 'X') */
// Another important thing is the constraints of the user and admin //