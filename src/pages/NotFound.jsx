import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  // Define icon components
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-surface-100 dark:bg-surface-800 p-6 rounded-full mb-6"
      >
        <AlertTriangleIcon size={64} className="text-secondary" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-surface-500 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved to another location.
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="btn-primary flex items-center py-2.5">
          <HomeIcon size={20} className="mr-2" />
          Back to Home
        </Link>
      </motion.div>
      
      <div className="mt-12 p-6 bg-surface-50 dark:bg-surface-800 rounded-xl max-w-md">
        <h3 className="font-semibold mb-2">Looking for something?</h3>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
          You might find what you need in these popular sections:
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Link to="/" className="p-3 bg-white dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
            Browse Listings
          </Link>
          <Link to="/" className="p-3 bg-white dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
            Create Listing
          </Link>
          <Link to="/" className="p-3 bg-white dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
            Search Items
          </Link>
          <Link to="/" className="p-3 bg-white dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
            Categories
          </Link>
        </div>
      </div>
    </motion.div>
  );
}