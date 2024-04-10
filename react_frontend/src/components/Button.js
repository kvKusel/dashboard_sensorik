import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyButton = ({ to, buttonText, action }) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, staggerChildren: 1 } },
  };

  

  const buttonVariants = {
    hover: { backgroundColor: 'white', color: 'black' },
  };

  return (
    <motion.div variants={fadeIn}>
      <Link to={to} className="text-decoration-none">
        <motion.button
          type="button"
          className="btn btn-light btn-lg "
          style={{
            width: "8em",
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '0',
            borderWidth:"0.1rem"
          }}
          variants={buttonVariants}
          whileHover="hover"
          onClick={action}
        >
          {buttonText}
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default MyButton;
