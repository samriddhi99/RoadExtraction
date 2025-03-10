import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, LogIn, User, Inbox, MapPin, List } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  openLoginModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openLoginModal }) => {
  const { isLoggedIn, userName, userRole, logout } = useUser();

  return (
    <nav className="w-64 bg-forest-green text-cream h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-playfair font-bold">Road Monitor</h1>
      </div>
      
      <div className="flex-1 px-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
                }`
              }
            >
              <Home className="mr-3" size={20} />
              <span className="font-medium">Home</span>
            </NavLink>
          </li>
          {isLoggedIn && (
            <li>
              <NavLink 
                to="/index" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
                  }`
                }
              >
                <List className="mr-3" size={20} />
                <span className="font-medium">Index</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
                }`
              }
            >
              <Info className="mr-3" size={20} />
              <span className="font-medium">About</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
                }`
              }
            >
              <User className="mr-3" size={20} />
              <span className="font-medium">Contact</span>
            </NavLink>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <NavLink 
                  to="/inbox" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
                    }`
                  }
                >
                  <Inbox className="mr-3" size={20} />
                  <span className="font-medium">Inbox</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/location-request" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-light-olive/20' : 'hover:bg-light-olive/10'
                    }`
                  }
                >
                  <MapPin className="mr-3" size={20} />
                  <span className="font-medium">Request Location</span>
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
              onClick={logout}
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