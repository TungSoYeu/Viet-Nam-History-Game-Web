import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "100vw", 
  },
  in: {
    opacity: 1,
    x: 0, 
  },
  out: {
    opacity: 0,
    x: "-100vw", 
  },
};

const pageTransition = {
  type: "spring",
  stiffness: 70,
  damping: 15,    
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: "100%", minHeight: "100%", display: "flex", flexDirection: "column" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
