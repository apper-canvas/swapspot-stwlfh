import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature() {
  const [listingType, setListingType] = useState('sell');
  const [formData, setFormData] = useState({
    title: '',
    lookingFor: '',
    description: '',
    offerDescription: '',
    price: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    preferredCondition: '',
    category: '',
    preferredCategory: '',
    location: '',
    files: [],
    urgency: 'Not Urgent',
    preferredBrands: '',
    swapPreferences: ''
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
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
  const TrashIcon = getIcon('Trash2');
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
  
  // Urgency options for Buy form
  const urgencyOptions = [
    'Not Urgent', 'Somewhat Urgent', 'Very Urgent'
  ];
  
  
  // File upload configuration
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 5;
  const ACCEPTED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif'
  ];
  
  // Form change handler
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
  
  // File change handler
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    processFiles(selectedFiles);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Process files (validation and preview)
  const processFiles = (selectedFiles) => {
    if (formData.files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }
    
    const validFiles = [];
    const invalidFiles = [];
    
    selectedFiles.forEach(file => {
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push({ file, reason: 'type' });
        return;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push({ file, reason: 'size' });
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      validFiles.push({ file, previewUrl });
    });
    
    // Show toast messages for invalid files
    if (invalidFiles.length > 0) {
      const typeErrors = invalidFiles.filter(f => f.reason === 'type').length;
      const sizeErrors = invalidFiles.filter(f => f.reason === 'size').length;
      
      if (typeErrors > 0) {
        toast.error(`${typeErrors} file(s) were rejected. Only images are allowed.`);
      }
      
      if (sizeErrors > 0) {
        toast.error(`${sizeErrors} file(s) exceeded the 5MB size limit.`);
      }
    }
    
    // Add valid files to form state
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles]
      }));
      
      toast.success(`${validFiles.length} file(s) added successfully.`);
    }
  };
  
  // Remove file handler
  const removeFile = (index) => {
    setFormData(prev => {
      const updatedFiles = [...prev.files];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(updatedFiles[index].previewUrl);
      updatedFiles.splice(index, 1);
      return { ...prev, files: updatedFiles };
    });
    toast.info('File removed.');
  };
  
  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    // Shared fields for all listing types
    if (step === 1 && listingType === 'sell') {
      // Validation for Step 1 Sell form
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    } else if (step === 1 && listingType === 'buy') {
      // Validation for Step 1 Buy form
      if (!formData.lookingFor.trim()) newErrors.lookingFor = 'Please describe what you\'re looking for';
      if (!formData.description.trim()) newErrors.description = 'Additional details are required';
    } else if (step === 1 && listingType === 'swap') {
      // Validation for Step 1 Swap form
      if (!formData.title.trim()) newErrors.title = 'Title for your item is required';
      if (!formData.offerDescription.trim()) newErrors.offerDescription = 'Please describe what you\'re offering';
      if (!formData.lookingFor.trim()) newErrors.lookingFor = 'Please describe what you want in return';
    } else if (step === 2 && listingType === 'sell') {
      // Validation for Step 2 Sell form
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.condition) newErrors.condition = 'Condition is required';
      if (!formData.category) newErrors.category = 'Category is required';
    } else if (step === 2 && listingType === 'buy') {
      // Validation for Step 2 Buy form
      if (!formData.minPrice) newErrors.minPrice = 'Minimum price is required';
      if (!formData.maxPrice) newErrors.maxPrice = 'Maximum price is required';
      if (formData.minPrice && formData.maxPrice && Number(formData.minPrice) > Number(formData.maxPrice)) {
        newErrors.minPrice = 'Minimum price cannot be greater than maximum price';
      }
      if (!formData.preferredCategory) newErrors.preferredCategory = 'Category is required';
    } else if (step === 2 && listingType === 'swap') {
      // Validation for Step 2 Swap form
      if (!formData.condition) newErrors.condition = 'Condition of your item is required';
      if (!formData.preferredCondition) newErrors.preferredCondition = 'Preferred condition is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.preferredCategory) newErrors.preferredCategory = 'Preferred category is required';
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    // Prevent proceeding if validation fails
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info(`Step ${step} completed! Moving to step ${step + 1}`);
      }
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
          lookingFor: '',
          files: [],
          offerDescription: '',
          minPrice: '',
          maxPrice: '',
          preferredCategory: '',
          preferredCondition: '',
          urgency: 'Not Urgent',
          preferredBrands: '',
          swapPreferences: ''
        });
        setStep(1);
        setShowForm(false);
      }, 1500);
    }
  
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
        lookingFor: '',
        files: [],
        offerDescription: '',
        minPrice: '',
        maxPrice: '',
        preferredCondition: '',
        preferredCategory: '',
        files: [],
        urgency: 'Not Urgent',
        preferredBrands: '',
        swapPreferences: ''
      });
      setStep(1);
      setErrors({});
    }
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
                  key={`step1-${listingType}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Buy Form Fields - Step 1 */}
                  {listingType === 'buy' && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="lookingFor" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <PenIcon size={16} className="mr-2" />
                            What are you looking for?
                          </span>
                        </label>
                        <input
                          type="text"
                          id="lookingFor"
                          name="lookingFor"
                          value={formData.lookingFor}
                          onChange={handleChange}
                          placeholder="Describe the item you want to buy"
                          className={`input-field ${errors.lookingFor ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {errors.lookingFor && <p className="text-red-500 text-xs mt-1">{errors.lookingFor}</p>}
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <InfoIcon size={16} className="mr-2" />
                            Additional Details
                          </span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="4"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Specific features, brands, or other requirements..."
                          className={`input-field resize-none ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                      </div>
                    </>
                  )}
                  
                  {/* Swap Form Fields - Step 1 */}
                  {listingType === 'swap' && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <PenIcon size={16} className="mr-2" />
                            Item Title
                          </span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Title for the item you're offering"
                          className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="offerDescription" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <InfoIcon size={16} className="mr-2" />
                            What You're Offering
                          </span>
                        </label>
                        <textarea
                          id="offerDescription"
                          name="offerDescription"
                          rows="3"
                          value={formData.offerDescription}
                          onChange={handleChange}
                          placeholder="Describe the item you're offering to swap..."
                          className={`input-field resize-none ${errors.offerDescription ? 'border-red-500 dark:border-red-500' : ''}`}
                        ></textarea>
                        {errors.offerDescription && <p className="text-red-500 text-xs mt-1">{errors.offerDescription}</p>}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="lookingFor" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <RepeatIcon size={16} className="mr-2" />
                            What You Want in Return
                          </span>
                        </label>
                        <textarea
                          id="lookingFor"
                          name="lookingFor"
                          rows="3"
                          value={formData.lookingFor}
                          onChange={handleChange}
                          placeholder="Describe what you're looking to receive in exchange..."
                          className={`input-field resize-none ${errors.lookingFor ? 'border-red-500 dark:border-red-500' : ''}`}
                        ></textarea>
                        {errors.lookingFor && <p className="text-red-500 text-xs mt-1">{errors.lookingFor}</p>}
                      </div>
                    </>
                  )}

                  {listingType === 'sell' && (
                  <>
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
                      placeholder="What are you offering?"
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
                  </>
                  )}
                  
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      <span className="flex items-center">
                        <CameraIcon size={16} className="mr-2" />
                        Photos
                      </span>
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        isDragging 
                          ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                          : 'border-surface-200 dark:border-surface-700'
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {formData.files.length === 0 ? (
                        <>
                          <CameraIcon size={24} className="mx-auto mb-2 text-surface-400" />
                          <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                            Drag and drop photos here
                          </p>
                          <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-surface-100 dark:bg-surface-700 rounded-lg text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                          >
                            Browse Files
                          </button>
                          <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                          />
                          <p className="text-xs text-surface-400 mt-2">
                            Max {MAX_FILES} images, 5MB per file
                          </p>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                            {formData.files.map((file, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={file.previewUrl} 
                                  alt={`Preview ${index}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <TrashIcon size={16} />
                                </button>
                              </div>
                            ))}
                            {formData.files.length < MAX_FILES && (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-24 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg flex items-center justify-center"
                              >
                                <PlusIcon size={24} className="text-surface-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key={`step2-${listingType}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Buy Form Fields - Step 2 */}
                  {listingType === 'buy' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <DollarSignIcon size={16} className="mr-2" />
                            Price Range
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-surface-500">$</span>
                            <input
                              type="number"
                              id="minPrice"
                              name="minPrice"
                              value={formData.minPrice}
                              onChange={handleChange}
                              placeholder="Min"
                              className={`input-field pl-8 ${errors.minPrice ? 'border-red-500 dark:border-red-500' : ''}`}
                            />
                            {errors.minPrice && <p className="text-red-500 text-xs mt-1">{errors.minPrice}</p>}
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-surface-500">$</span>
                            <input
                              type="number"
                              id="maxPrice"
                              name="maxPrice"
                              value={formData.maxPrice}
                              onChange={handleChange}
                              placeholder="Max"
                              className={`input-field pl-8 ${errors.maxPrice ? 'border-red-500 dark:border-red-500' : ''}`}
                            />
                            {errors.maxPrice && <p className="text-red-500 text-xs mt-1">{errors.maxPrice}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="preferredCategory" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <TagIcon size={16} className="mr-2" />
                            Category
                          </span>
                        </label>
                        <select
                          id="preferredCategory"
                          name="preferredCategory"
                          value={formData.preferredCategory}
                          onChange={handleChange}
                          className={`input-field ${errors.preferredCategory ? 'border-red-500 dark:border-red-500' : ''}`}
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        {errors.preferredCategory && <p className="text-red-500 text-xs mt-1">{errors.preferredCategory}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="preferredBrands" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <TagIcon size={16} className="mr-2" />
                            Preferred Brands (Optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="preferredBrands"
                          name="preferredBrands"
                          value={formData.preferredBrands}
                          onChange={handleChange}
                          placeholder="e.g., Sony, Samsung, Apple"
                          className="input-field"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="urgency" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <InfoIcon size={16} className="mr-2" />
                            How Urgent Is Your Request?
                          </span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {urgencyOptions.map(option => (
                            <motion.button
                              key={option}
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFormData({
                                  ...formData,
                                  urgency: option
                                });
                              }}
                              className={`py-2 px-3 text-center rounded-lg text-sm ${
                                formData.urgency === option
                                  ? 'bg-primary text-white'
                                  : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                              }`}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Swap Form Fields - Step 2 */}
                  {listingType === 'swap' && (
                    <>
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium mb-2">
                            <span className="flex items-center">
                              <TagIcon size={16} className="mr-2" />
                              Your Item's Category
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
                        
                        <div>
                          <label htmlFor="preferredCategory" className="block text-sm font-medium mb-2">
                            <span className="flex items-center">
                              <TagIcon size={16} className="mr-2" />
                              Desired Item's Category
                            </span>
                          </label>
                          <select
                            id="preferredCategory"
                            name="preferredCategory"
                            value={formData.preferredCategory}
                            onChange={handleChange}
                            className={`input-field ${errors.preferredCategory ? 'border-red-500 dark:border-red-500' : ''}`}
                          >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                          {errors.preferredCategory && <p className="text-red-500 text-xs mt-1">{errors.preferredCategory}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="condition" className="block text-sm font-medium mb-2">
                            <span className="flex items-center">
                              <InfoIcon size={16} className="mr-2" />
                              Your Item's Condition
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {conditions.map(condition => (
                              <motion.button
                                key={condition}
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setFormData({
                                    ...formData,
                                    condition: condition
                                  });
                                }}
                                className={`py-2 px-3 text-center rounded-lg text-xs ${
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
                        
                        <div>
                          <label htmlFor="preferredCondition" className="block text-sm font-medium mb-2">
                            <span className="flex items-center">
                              <InfoIcon size={16} className="mr-2" />
                              Desired Item's Condition
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {conditions.map(condition => (
                              <motion.button
                                key={condition}
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setFormData({
                                    ...formData,
                                    preferredCondition: condition
                                  });
                                }}
                                className={`py-2 px-3 text-center rounded-lg text-xs ${
                                  formData.preferredCondition === condition
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                                }`}
                              >
                                {condition}
                              </motion.button>
                            ))}
                          </div>
                          {errors.preferredCondition && <p className="text-red-500 text-xs mt-1">{errors.preferredCondition}</p>}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="swapPreferences" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <InfoIcon size={16} className="mr-2" />
                            Swap Preferences (Optional)
                          </span>
                        </label>
                        <textarea
                          id="swapPreferences"
                          name="swapPreferences"
                          rows="3"
                          value={formData.swapPreferences}
                          onChange={handleChange}
                          placeholder="Any specific requirements for the swap? (e.g., local swap only, willing to ship, etc.)"
                          className="input-field resize-none"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* Sell Form Fields - Step 2 */}
                  {listingType === 'sell' && (
                    <>
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
                      
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <TagIcon size={16} className="mr-2" />
                            Item Category
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
                              onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                e.stopPropagation(); // Stop event propagation
                                // Update the formData with the selected condition
                                setFormData({
                                  ...formData,
                                  condition: condition
                                });
                              }}
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
                    </>
                  )}
              )}
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <MapPinIcon size={16} className="mr-1" />
                        Use my current location
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-surface-100 dark:bg-surface-700 p-4 rounded-xl mb-6">
                    
                    {listingType === 'sell' && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Type:</span>
                          <span className="font-medium capitalize">{listingType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Title:</span>
                          <span className="font-medium">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Price:</span>
                          <span className="font-medium">${formData.price || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Category:</span>
                          <span className="font-medium">{formData.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Condition:</span>
                          <span className="font-medium">{formData.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Photos:</span>
                          <span className="font-medium">{formData.files.length} uploaded</span>
                        </div>
                      </div>
                    )}
                    
                    {listingType === 'buy' && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Type:</span>
                          <span className="font-medium capitalize">{listingType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Looking For:</span>
                          <span className="font-medium">{formData.lookingFor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Price Range:</span>
                          <span className="font-medium">${formData.minPrice || '0'} - ${formData.maxPrice || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Category:</span>
                          <span className="font-medium">{formData.preferredCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Urgency:</span>
                          <span className="font-medium">{formData.urgency}</span>
                        </div>
                        {formData.preferredBrands && (
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Preferred Brands:</span>
                            <span className="font-medium">{formData.preferredBrands}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {listingType === 'swap' && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Type:</span>
                          <span className="font-medium capitalize">{listingType}</span>
                        </div>
                        <div className="border-b border-surface-200 dark:border-surface-600 pb-2 mb-2">
                          <div className="font-medium mb-1">Your Item:</div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Title:</span>
                            <span className="font-medium">{formData.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Category:</span>
                            <span className="font-medium">{formData.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Condition:</span>
                            <span className="font-medium">{formData.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Photos:</span>
                            <span className="font-medium">{formData.files.length} uploaded</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium mb-1">Looking For:</div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Description:</span>
                            <span className="font-medium line-clamp-1">{formData.lookingFor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Category:</span>
                            <span className="font-medium">{formData.preferredCategory}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500 dark:text-surface-400">Condition:</span>
                            <span className="font-medium">{formData.preferredCondition}</span>
                          </div>
                        </div>
                        
                        {formData.swapPreferences && (
                          <div className="flex justify-between mt-2 pt-2 border-t border-surface-200 dark:border-surface-600">
                            <span className="text-surface-500 dark:text-surface-400">Swap Preferences:</span>
                            <span className="font-medium text-right max-w-[60%] line-clamp-2">{formData.swapPreferences}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    </div>
                  </div>
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
                    e.preventDefault();
                    e.preventDefault(); // Prevent form submission
                    e.preventDefault(); // Prevent form submission
                    nextStep();
                  }}
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