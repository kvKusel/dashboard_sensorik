import React, { useState, useEffect } from 'react';

const OrientationLock = ({ children }) => {
  const getOrientation = () => window.matchMedia("(orientation: portrait)").matches;

  const [isPortrait, setIsPortrait] = useState(getOrientation());
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 950);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(getOrientation());
      setIsSmallDevice(window.innerWidth <= 950);
      console.log("Resize detected:", window.innerWidth, window.innerHeight, getOrientation());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check    
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <div>
      {isSmallDevice && !isPortrait ? (
        <div className='landscapeWarning'>
          Die Anwendung wurde für die Hochformatansicht optimiert. Bitte drehen Sie Ihr Gerät.
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export default OrientationLock;
