import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';
import { addToCart } from '../store/cartSlice';

// Demo data for listings
const DEMO_LISTINGS = [
  {
    id: 'list1',
    title: 'Mountain Bike - Great Condition',
    description: 'Trek mountain bike, barely used, perfect for trails.',
    price: 250,
    condition: 'Like New',
    category: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1575585269294-7d28dd912db8?auto=format&fit=crop&q=80&w=500',
    location: 'Downtown',
    distance: '1.2',
    listingType: 'Sell',
    datePosted: '2023-04-15',
    seller: {
      name: 'Alex K.',
      rating: 4.8,
      memberSince: '2022'
    }
  },
  {
    id: 'list2',
    title: 'Vintage Record Player',
    description: 'Beautiful vintage record player from the 70s. Works perfectly.',
    price: 175,
    condition: 'Good',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1551047757-e62f658c9366?auto=format&fit=crop&q=80&w=500',
    location: 'Westside',
    distance: '3.5',
    listingType: 'Sell',
    datePosted: '2023-04-10',
    seller: {
      name: 'Maria T.',
      rating: 4.9,
      memberSince: '2021'
    }
  },
  {
    id: 'list3',
    title: 'Designer Coffee Table',
    description: 'Modern glass coffee table in excellent condition.',
    price: 120,
    condition: 'Good',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&q=80&w=500',
    location: 'Northside',
    distance: '2.7',
    listingType: 'Sell',
    datePosted: '2023-04-05',
    seller: {
      name: 'Jordan L.',
      rating: 4.6,
      memberSince: '2021'
    }
  },
  {
    id: 'list4',
    title: 'Handmade Ceramic Plant Pots',
    description: 'Set of 3 handmade ceramic pots, perfect for indoor plants.',
    price: 45,
    condition: 'New',
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=500',
    location: 'Eastside',
    distance: '4.1',
    listingType: 'Sell',
    datePosted: '2023-04-01',
    seller: {
      name: 'Sam P.',
      rating: 5.0,
      memberSince: '2022'
    }
  }
];

// Categories for filters
const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Furniture',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Books & Media',
  'Vehicles',
  'Collectibles'
];

export default function Home() {
  const [listings, setListings] = useState(DEMO_LISTINGS);
  const [filteredListings, setFilteredListings] = useState(DEMO_LISTINGS);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Define icon components
  const MapPinIcon = getIcon('MapPin');
  const TagIcon = getIcon('Tag');
  const StarIcon = getIcon('Star');
  const CalendarIcon = getIcon('Calendar');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('SlidersHorizontal');
  const RefreshIcon = getIcon('RefreshCw');
  const ShoppingCartIcon = getIcon('ShoppingCart');
  
  const dispatch = useDispatch();
  
  const handleAddToCart = (listing) => {
    dispatch(addToCart(listing));
    toast.success(`${listing.title} added to cart!`);
  };
  
  // Filter listings when search or category changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate network delay
    const timer = setTimeout(() => {
      let results = listings;
      
      // Apply category filter
      if (selectedCategory !== 'All Categories') {
        results = results.filter(item => item.category === selectedCategory);
      }
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(item => 
          item.title.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term)
        );
      }
      
      setFilteredListings(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, listings]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    toast.info("Refreshing listings...");
    
    // Simulate network delay
    setTimeout(() => {
      // Randomize order of listings to simulate refresh
      setListings([...listings].sort(() => Math.random() - 0.5));
      setIsLoading(false);
      toast.success("Listings updated!");
    }, 1000);
  };
  
  const handleContact = (listing) => {
    toast.success(`Contact request sent to ${listing.seller.name} about "${listing.title}"`);
  };

  return (
    <div className="pb-16 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <MainFeature />
      </motion.div>
      
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-surface-400" size={20} />
          <input
            type="text"
            placeholder="Search items, descriptions, locations..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Browse Listings</h2>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
          >
            <RefreshIcon size={20} className={isLoading ? "animate-spin" : ""} />
          </motion.button>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 py-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Listings grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="card overflow-hidden flex flex-col"
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-surface-200 dark:bg-surface-700">
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2">
                  <span className={`tag ${
                    listing.listingType === 'Sell' ? 'bg-primary text-white' : 
                    listing.listingType === 'Swap' ? 'bg-secondary text-white' : 
                    'bg-accent text-white'
                  }`}>
                    {listing.listingType}
                  </span>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                <div className="flex items-center mb-2">
                  <TagIcon size={16} className="text-primary mr-1" />
                  <span className="text-xl font-bold text-primary">${listing.price}</span>
                </div>
                
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">
                  {listing.description}
                </p>
                
                <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 space-x-3 mb-3">
                  <div className="flex items-center">
                    <MapPinIcon size={14} className="mr-1" />
                    <span>{listing.location} ({listing.distance} mi)</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1" />
                    <span>{listing.datePosted}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-surface-300 dark:bg-surface-600 mr-2"></div>
                    <div>
                      <p className="text-sm font-medium">{listing.seller.name}</p>
                      <div className="flex items-center">
                        <StarIcon size={12} className="text-yellow-400 mr-1" />
                        <span className="text-xs">{listing.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(listing)}
                      className="btn-primary py-1.5 px-3 text-sm rounded-lg flex items-center"
                    >
                      <ShoppingCartIcon size={16} className="mr-1" />
                      Add to Cart
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleContact(listing)}
                      className="py-1.5 px-3 text-sm rounded-lg border border-surface-300 dark:border-surface-600"
                    >
                      Contact
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-surface-500 dark:text-surface-400">No listings found matching your search criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
            }}
            className="mt-4 btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}