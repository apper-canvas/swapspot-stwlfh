import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature() {
  const [listingType, setListingType] = useState('sell');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Define icon components
  const CameraIcon = getIcon('Camera');
  const PenIcon = getIcon('Pen');
  const DollarSignIcon = getIcon('DollarSign');
  const TagIcon = getIcon('Tag');
  const MapPinIcon = getIcon('MapPin');
  const InfoIcon = getIcon('Info');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const ChevronRightIcon = getIcon('ChevronRight');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const ArrowUpIcon = getIcon('ArrowUp');
  const PlusIcon = getIcon('Plus');
  const RefreshCwIcon = getIcon('RefreshCw');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  const RepeatIcon = getIcon('Repeat');
  
  // Categories and conditions lists
  const categories = [
    'Electronics', 'Furniture', 'Clothing', 'Home & Garden', 
    'Sports & Outdoors', 'Toys & Games', 'Books & Media', 
    'Vehicles', 'Collectibles', 'Other'
  ];
  
  const conditions = [
    'New', 'Like New', 'Good', 'Fair', 'Poor'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    } else if (step === 2) {
      if (!formData.price && listingType !== 'swap') newErrors.price = 'Price is required';
      if (!formData.condition) newErrors.condition = 'Condition is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Listing created successfully!');
        setFormData({
          title: '',
          description: '',
          price: '',
          condition: '',
          category: '',
          location: '',
        });
        setStep(1);
        setShowForm(false);
      }, 1500);
    }
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form when opening
    if (!showForm) {
      setFormData({
        title: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        location: '',
      });
      setStep(1);
      setErrors({});
    }
  };

  return (
    <div className="mb-8">
      {!showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Welcome to SwapSpot</h1>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl">
              Your local marketplace to buy, sell, and swap items within your community.
              Turn your unused items into cash or find great deals nearby.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-white/20 rounded-full mb-3">
                  <ShoppingBagIcon size={24} />
                </div>
                <h3 className="font-semibold mb-1">Sell Items</h3>
                <p className="text-sm text-white/80">List your unused items and turn them into cash quickly</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-white/20 rounded-full mb-3">
                  <DollarSignIcon size={24} />
                </div>
                <h3 className="font-semibold mb-1">Buy Locally</h3>
                <p className="text-sm text-white/80">Find great deals on items from people in your neighborhood</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-white/20 rounded-full mb-3">
                  <RepeatIcon size={24} />
                </div>
                <h3 className="font-semibold mb-1">Swap Items</h3>
                <p className="text-sm text-white/80">Exchange items without money changing hands</p>
              </motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleForm}
              className="btn bg-white text-primary font-semibold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center"
            >
              <PlusIcon size={20} className="mr-2" />
              Create a Listing
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-none p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create a New Listing</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleForm}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700"
            >
              <XIcon size={20} />
            </motion.button>
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center mb-6">
            <div className="w-full flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step > 1 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step > 2 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
                3
              </div>
            </div>
          </div>
          
          {/* Listing type selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">What would you like to do?</label>
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setListingType('sell')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center ${
                  listingType === 'sell'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700'
                }`}
              >
                <ShoppingBagIcon size={24} className={listingType === 'sell' ? 'text-primary' : ''} />
                <span className="mt-2 font-medium">Sell</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setListingType('buy')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center ${
                  listingType === 'buy'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700'
                }`}
              >
                <DollarSignIcon size={24} className={listingType === 'buy' ? 'text-primary' : ''} />
                <span className="mt-2 font-medium">Buy</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setListingType('swap')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center ${
                  listingType === 'swap'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700'
                }`}
              >
                <RepeatIcon size={24} className={listingType === 'swap' ? 'text-primary' : ''} />
                <span className="mt-2 font-medium">Swap</span>
              </motion.button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <PenIcon size={16} className="mr-2" />
                        Title
                      </span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={`${listingType === 'buy' ? 'What are you looking for?' : 'What are you offering?'}`}
                      className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <InfoIcon size={16} className="mr-2" />
                        Description
                      </span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide details about the item..."
                      className={`input-field resize-none ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <CameraIcon size={16} className="mr-2" />
                        Photos
                      </span>
                    </label>
                    <div className="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl p-6 text-center">
                      <CameraIcon size={24} className="mx-auto mb-2 text-surface-400" />
                      <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">Drag and drop photos here</p>
                      <button 
                        type="button"
                        className="px-4 py-2 bg-surface-100 dark:bg-surface-700 rounded-lg text-sm font-medium"
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {listingType !== 'swap' && (
                    <div className="mb-4">
                      <label htmlFor="price" className="block text-sm font-medium mb-2">
                        <span className="flex items-center">
                          <DollarSignIcon size={16} className="mr-2" />
                          Price
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-surface-500">$</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className={`input-field pl-8 ${errors.price ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <TagIcon size={16} className="mr-2" />
                        Category
                      </span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`input-field ${errors.category ? 'border-red-500 dark:border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="condition" className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <InfoIcon size={16} className="mr-2" />
                        Condition
                      </span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {conditions.map(condition => (
                        <motion.button
                          key={condition}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData({...formData, condition})}
                          className={`py-2 px-3 text-center rounded-lg text-sm ${
                            formData.condition === condition
                              ? 'bg-primary text-white'
                              : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                          }`}
                        >
                          {condition}
                        </motion.button>
                      ))}
                    </div>
                    {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <label htmlFor="location" className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <MapPinIcon size={16} className="mr-2" />
                        Your Location
                      </span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your neighborhood or area"
                      className="input-field"
                    />
                    <div className="flex items-center mt-2">
                      <button
                        type="button"
                        className="text-primary text-sm flex items-center"
                      >
                        <MapPinIcon size={16} className="mr-1" />
                        Use my current location
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-surface-100 dark:bg-surface-700 p-4 rounded-xl mb-6">
                    <h3 className="font-medium mb-2">Listing Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-surface-500 dark:text-surface-400">Type:</span>
                        <span className="font-medium capitalize">{listingType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-500 dark:text-surface-400">Title:</span>
                        <span className="font-medium">{formData.title}</span>
                      </div>
                      {listingType !== 'swap' && (
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Price:</span>
                          <span className="font-medium">${formData.price || '0'}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-surface-500 dark:text-surface-400">Category:</span>
                        <span className="font-medium">{formData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-500 dark:text-surface-400">Condition:</span>
                        <span className="font-medium">{formData.condition}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="btn-outline py-2"
                >
                  <ChevronLeftIcon size={20} className="mr-1" />
                  Back
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={toggleForm}
                  className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 py-2"
                >
                  Cancel
                </motion.button>
              )}
              
              {step < 3 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={nextStep}
                  className="btn-primary py-2"
                >
                  Next
                  <ChevronRightIcon size={20} className="ml-1" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2 min-w-[100px]"
                >
                  {isSubmitting ? (
                    <RefreshCwIcon size={20} className="animate-spin mx-auto" />
                  ) : (
                    <>
                      <CheckIcon size={20} className="mr-1" />
                      Submit
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}