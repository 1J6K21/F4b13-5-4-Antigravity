import { useState } from 'react';
import { useAppStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function Login() {
  const login = useAppStore(state => state.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'admin@resolvai.co', 'admin');
    navigate('/admin');
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'customer@example.com', 'customer');
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Bot className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to ResolvAI
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          The autonomous resolution engine for CX.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCustomerLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login as Customer
              </button>
              <button
                onClick={handleAdminLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login as Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
