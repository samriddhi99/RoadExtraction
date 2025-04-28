import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Inbox from './pages/Inbox';
import LocationRequest from './pages/LocationRequest';
import Index from './pages/Index';
import LoginModal from './components/LoginModal';
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  return (
    <UserProvider>
      <div className="flex h-screen bg-cream">
        <Navbar openLoginModal={openLoginModal} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/location-request" element={<LocationRequest />} />
            <Route path="/index" element={<Index />} />
          </Routes>
        </main>
        <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
      </div>
    </UserProvider>
  );
}

export default App;