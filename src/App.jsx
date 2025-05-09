import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved dark mode preference, or use system preference
    if (localStorage.getItem('darkMode') !== null) {
      return localStorage.getItem('darkMode') === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Update body class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(
      !darkMode ? "Dark mode activated" : "Light mode activated", 
      { icon: !darkMode ? "🌙" : "☀️" }
    );
  };

  // Define icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const HomeIcon = getIcon('Home');
  const SearchIcon = getIcon('Search');
  const PlusCircleIcon = getIcon('PlusCircle');
  const MessageCircleIcon = getIcon('MessageCircle');
  const UserIcon = getIcon('User');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header navigation */}
      <header className="bg-white dark:bg-surface-800 shadow-sm z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-primary text-2xl font-bold">SwapSpot</span>
              <span className="bg-primary-light text-white text-xs px-2 py-0.5 rounded-full">Beta</span>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)] z-10">
        <div className="flex justify-around px-2 py-3">
          <motion.a 
            href="/" 
            className="flex flex-col items-center p-1 text-primary"
            whileTap={{ scale: 0.9 }}
          >
            <HomeIcon size={22} />
            <span className="text-xs mt-1">Home</span>
          </motion.a>
          
          <motion.a 
            href="/search" 
            className="flex flex-col items-center p-1 text-surface-500 dark:text-surface-400"
            whileTap={{ scale: 0.9 }}
          >
            <SearchIcon size={22} />
            <span className="text-xs mt-1">Search</span>
          </motion.a>
          
          <motion.a 
            href="/new" 
            className="flex flex-col items-center p-1 text-surface-500 dark:text-surface-400"
            whileTap={{ scale: 0.9 }}
          >
            <PlusCircleIcon size={22} />
            <span className="text-xs mt-1">Post</span>
          </motion.a>
          
          <motion.a 
            href="/messages" 
            className="flex flex-col items-center p-1 text-surface-500 dark:text-surface-400"
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircleIcon size={22} />
            <span className="text-xs mt-1">Chat</span>
          </motion.a>
          
          <motion.a 
            href="/profile" 
            className="flex flex-col items-center p-1 text-surface-500 dark:text-surface-400"
            whileTap={{ scale: 0.9 }}
          >
            <UserIcon size={22} />
            <span className="text-xs mt-1">Profile</span>
          </motion.a>
        </div>
      </nav>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
}

export default App;