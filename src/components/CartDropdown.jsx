import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  selectCartItems,
  selectCartIsOpen,
  selectCartTotal,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  toggleCart
} from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

const CartDropdown = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isOpen = useSelector(selectCartIsOpen);
  const cartTotal = useSelector(selectCartTotal);

  // Icons
  const XIcon = getIcon('X');
  const MinusIcon = getIcon('Minus');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const ShoppingBagIcon = getIcon('ShoppingBag');

  const handleRemoveItem = (id, title) => {
    dispatch(removeFromCart(id));
    toast.info(`"${title}" removed from cart`);
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout!');
    dispatch(toggleCart());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => dispatch(toggleCart())}
          />

          {/* Cart panel */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-surface-800 shadow-lg z-30 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBagIcon size={48} className="text-surface-300 dark:text-surface-600 mb-3" />
                  <p className="text-surface-500 dark:text-surface-400">Your cart is empty</p>
                  <button 
                    onClick={() => dispatch(toggleCart())}
                    className="mt-4 btn-outline text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex border-b border-surface-200 dark:border-surface-700 pb-4">
                      <div className="w-20 h-20 rounded-lg bg-surface-200 dark:bg-surface-700 overflow-hidden mr-4">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-primary font-bold">${item.price}</p>
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() => dispatch(decrementQuantity(item.id))} 
                            className="p-1 rounded-full bg-surface-100 dark:bg-surface-700"
                          >
                            <MinusIcon size={16} />
                          </button>
                          <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(incrementQuantity(item.id))} 
                            className="p-1 rounded-full bg-surface-100 dark:bg-surface-700"
                          >
                            <PlusIcon size={16} />
                          </button>
                          <button 
                            onClick={() => handleRemoveItem(item.id, item.title)} 
                            className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex justify-between py-2 font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 mt-2"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;