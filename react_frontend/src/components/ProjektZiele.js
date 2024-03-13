import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Ziele = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  };

  const textContainerStyle = {
    textAlign: 'center',
    maxWidth: '800px',
  };

  const textParagraphStyle = {
    textAlign: 'left',
    maxWidth: '800px',
  };

  const buttonStyle = {
    marginTop: '20px',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <motion.div
      style={containerStyle}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div style={textContainerStyle}>
        <motion.h1 variants={textVariants} className="title text-dark">
        Die Ziele
        </motion.h1>
        <motion.p variants={textVariants} style={textParagraphStyle} className="lead description p-5 text-dark">
        Mithilfe der Messungen der Bodenfeuchte kann sichergestellt werden, dass die Obstbäume auch im Sommer
  mit ausreichend Wasser versorgt sind und zu großen, fruchttragenden Schattenspendern heranwachsen.
  <br /><br />
  Doch nicht nur für uns Menschen kann die Experimentierfläche ein gemütlicher Ruheort werden,
  auch für die heimischen Tiere und Pflanzen bietet sie einen vielfältigen Lebensraum.
  <br /><br />
  Gleichzeitig bietet die Experimentierfläche ihren Gästen neue und bisher unbekannte Einblicke in unsere Natur 
  und lädt dazu ein, diese zu erforschen.   
        </motion.p>
        <Link to="/Maps" style={buttonStyle}>
          Zurück
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Ziele;
