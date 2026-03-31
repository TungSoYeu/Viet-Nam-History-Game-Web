import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "100vw", // Trượt từ bên phải màn hình
  },
  in: {
    opacity: 1,
    x: 0, // Dừng tại chỗ
  },
  out: {
    opacity: 0,
    x: "-100vw", // Trượt sang trái khi biến mất
  },
};

const pageTransition = {
  type: "spring",
  stiffness: 70, // Độ cứng của lò xo (càng cao càng nhanh)
  damping: 15,    // Độ nảy (càng thấp càng nảy)
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
