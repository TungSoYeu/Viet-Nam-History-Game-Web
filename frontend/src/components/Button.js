import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled = false,
  type = 'button',
  fullWidth = false
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase transition-all rounded-xl border-2 tracking-wide focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-amber-400/50 shadow-lg shadow-amber-900/20',
    gold: 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-amber-900 border-yellow-300 shadow-lg shadow-yellow-900/20',
    ghost: 'theme-outline-button',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-lg shadow-red-900/20',
    success: 'bg-green-600 hover:bg-green-500 text-white border-green-500 shadow-lg shadow-green-900/20'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
