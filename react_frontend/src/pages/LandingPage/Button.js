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
          className="btn btn-light btn-lg rounded-5 p-2"
          style={{
            width: "8em",
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '0',
            borderWidth:"0.1rem",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
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
