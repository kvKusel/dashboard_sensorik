import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyButton = ({ to, buttonText, action }) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, staggerChildren: 1 } },
  };

  

  const buttonVariants = {
    hover: { backgroundColor: 'black', color: 'white' },
  };

  return (
    <motion.div variants={fadeIn}>
      <Link to={to} className="text-decoration-none">
        <motion.button
          type="button"
          className="btn btn-light btn-lg "
          style={{
            width: "8em",
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '0',
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
