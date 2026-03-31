import React from 'react';
import { motion } from 'framer-motion';

const BouncyButton = ({ children, onClick, className, style }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }} // Phóng to nhẹ khi di chuột qua
      whileTap={{ 
        scale: 0.9, // Thu nhỏ khi bấm xuống
        rotate: -2   // Xoay nhẹ 2 độ để tạo độ "quái"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, // Lò xo cứng, phản hồi cực nhanh
        damping: 10      // Độ nảy cao
      }}
      onClick={onClick}
      className={className}
      style={{ 
        border: 'none', 
        background: 'none', 
        padding: 0, 
        cursor: 'pointer',
        display: 'inline-block',
        ...style 
      }}
    >
      {children}
    </motion.button>
  );
};

export default BouncyButton;
