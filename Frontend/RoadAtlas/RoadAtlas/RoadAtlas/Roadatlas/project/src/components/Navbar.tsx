import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Info, LogIn, User, Inbox, MapPin, List, UserCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  openLoginModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openLoginModal }) => {
  const { isLoggedIn, userName, userRole, logout, isAdmin } = useUser();
  const navigate = useNavigate(); // Added navigate hook

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to Home after logout
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 rounded-lg transition-colors ${
      isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
    }`;

  return (
    <nav className="w-64 bg-forest-green text-cream h-screen flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-bold">Road Monitor</h1>
        {isLoggedIn && (
          <div className="relative group">
            <button className="hover:text-light-olive transition-colors">
              <UserCircle size={24} />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-forest-green font-medium">{userName}</p>
                <p className="text-sm text-gray-500">{isAdmin() ? 'Admin' : 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-dark-slate hover:bg-light-olive/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 px-4">
        <ul className="space-y-2">
          {/* Admin Only */}
          {isLoggedIn && isAdmin() && (
            <li>
              <NavLink to="/admin" className={navLinkClass}>
                <User className="mr-3" size={20} />
                <span className="font-medium">Admin Dashboard</span>
              </NavLink>
            </li>
          )}

          {/* Normal User */}
          {isLoggedIn && !isAdmin() && (
            <>
              <li>
                <NavLink to="/" className={navLinkClass}>
                  <Home className="mr-3" size={20} />
                  <span className="font-medium">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass}>
                  <Info className="mr-3" size={20} />
                  <span className="font-medium">About</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/index" className={navLinkClass}>
                  <List className="mr-3" size={20} />
                  <span className="font-medium">Alerts</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/location-request" className={navLinkClass}>
                  <MapPin className="mr-3" size={20} />
                  <span className="font-medium">Request Location</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={navLinkClass}>
                  <User className="mr-3" size={20} />
                  <span className="font-medium">Contact</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Not Logged In */}
          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/" className={navLinkClass}>
                  <Home className="mr-3" size={20} />
                  <span className="font-medium">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass}>
                  <Info className="mr-3" size={20} />
                  <span className="font-medium">About</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={navLinkClass}>
                  <User className="mr-3" size={20} />
                  <span className="font-medium">Contact</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="p-4 border-t border-light-olive/20">
        {isLoggedIn ? (
          <div className="flex flex-col">
            <div className="mb-2 p-3 bg-light-olive/10 rounded-lg">
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-light-olive">{userRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors text-center"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="w-full flex items-center justify-center p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors"
          >
            <LogIn className="mr-2" size={18} />
            <span className="font-medium">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
