import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import images from '../assets';
const SplashPage = () => {

    const navigate = useNavigate();
  const [fade, setFade] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => navigate('/home'), 3000); 
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url(${images.Background})` }}>
      <div className="flex items-center justify-center h-full ">
        <img src={images.Logo} alt="Logo" className="min-w-72 h-32"  />
      </div>
    </div>
  );
}

export default SplashPage;
