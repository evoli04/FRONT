// src/pages/SettingsDrawerWrapper.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Settings from './Settings';

const SettingsDrawerWrapper = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // URL değiştiğinde drawer'ı açmak için bu useEffect'e ihtiyacınız olmayabilir.
  // Çoğu durumda, doğrudan /settings sayfasına yönlendirme yeterli olur.
  useEffect(() => {
    if (location.pathname === '/settings') {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [location.pathname]);

  const handleClose = () => {
    setIsDrawerOpen(false);
    // Drawer kapandığında bir önceki sayfaya yönlendir
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
    } else {
      navigate('/workspace', { replace: true });
    }
  };

  return (
    // Settings bileşenini open ve onClose prop'ları ile çağırıyoruz.
    <Settings open={isDrawerOpen} onClose={handleClose} />
  );
};

export default SettingsDrawerWrapper;