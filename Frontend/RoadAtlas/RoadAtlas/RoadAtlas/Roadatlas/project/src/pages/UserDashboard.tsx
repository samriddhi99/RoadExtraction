import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { userName } = useUser();
  const isLoggedIn = !!userName;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-playfair text-forest-green">
        Road Monitoring
      </div>
      <div className="flex space-x-6">
        <Link to="/" className="text-dark-slate hover:text-forest-green">
          Home
        </Link>
        <Link to="/about" className="text-dark-slate hover:text-forest-green">
          About
        </Link>
        <Link to="/contact" cla      ssName="text-dark-slate hover:text-forest-green">
          Contact
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="text-dark-slate hover:text-forest-green">
              Dashboard
            </Link>
            {/* Add more logged-in links here if you want */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
