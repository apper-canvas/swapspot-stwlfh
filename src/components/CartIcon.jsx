import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemCount, toggleCart } from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

const CartIcon = () => {
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => dispatch(toggleCart())}
      className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 relative"
      aria-label="Open cart"
    >
      <ShoppingCartIcon size={20} />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartItemCount > 9 ? '9+' : cartItemCount}
        </span>
      )}
    </motion.button>
  );
};

export default CartIcon;