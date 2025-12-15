import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from './Notification';
import { getInitials } from '../../utils/helpers';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900">
              Task Manager
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                All Tasks
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user && getInitials(user.name)}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;