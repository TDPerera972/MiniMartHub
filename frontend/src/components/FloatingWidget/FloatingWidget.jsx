import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, ArrowLeft, ArrowRight, Home, HelpCircle } from 'lucide-react';
import './FloatingWidget.css';

const FloatingWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const widgetRef = useRef(null);

  const widgetSize = 50;
  const navbarHeight = 100;
  const minTop = navbarHeight + 10;

  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - widgetSize - 10 : 20, 
    y: typeof window !== 'undefined' ? window.innerHeight - widgetSize - 10 : minTop 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Exclude specific authentication and admin routes
  const hiddenRoutes = ['/login', '/register', '/admin-login', '/auth'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;

    // Bounds checking with precise widget dimensions
    const widgetWidth = 50;
    const widgetHeight = 50;
    const navbarHeight = 100;
    const minTop = navbarHeight + 10;

    const maxX = window.innerWidth - widgetWidth - 10;
    const maxY = window.innerHeight - widgetHeight - 10;
    
    newX = Math.max(10, Math.min(newX, maxX));
    newY = Math.max(minTop, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    setMenuOpen(!menuOpen);
  };

  const isLowerHalf = typeof window !== 'undefined' ? position.y > (window.innerHeight / 2) : false;

  return (
    <div
      ref={widgetRef}
      className="floating-widget-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none' // Prevent scrolling while dragging on mobile
      }}
    >
      <div 
        className="floating-widget-icon"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        title="Double click for shortcuts"
      >
        <Compass size={28} color="#172b78" />
      </div>

      <div className={`floating-widget-menu ${menuOpen ? 'open' : ''} ${isLowerHalf ? 'open-up' : ''}`}>
        <button onClick={() => { navigate(-1); setMenuOpen(false); }}>
          <ArrowLeft size={16} /> Previous
        </button>
        <button onClick={() => { navigate(1); setMenuOpen(false); }}>
          <ArrowRight size={16} /> Next
        </button>
        <button onClick={() => { navigate('/'); setMenuOpen(false); }}>
          <Home size={16} /> Home
        </button>
        <button onClick={() => { navigate('/help'); setMenuOpen(false); }}>
          <HelpCircle size={16} /> Help
        </button>
      </div>
    </div>
  );
};

export default FloatingWidget;
