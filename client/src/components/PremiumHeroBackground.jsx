import React, { useEffect, useState } from 'react';
import './PremiumHeroBackground.css';

const PremiumHeroBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="premium-hero-container">
      {/* Background base */}
      <div className="hero-bg-base" />

      {/* Mouse Follow Glow */}
      <div 
        className="mouse-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />

      {/* Aurora Gradients */}
      <div className="aurora aurora-purple" />
      <div className="aurora aurora-blue" />
      <div className="aurora aurora-orange" />

      {/* Light Beams */}
      <div className="light-beam beam-1" />
      <div className="light-beam beam-2" />

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle p-${i + 1}`} />
        ))}
      </div>

      {/* Floating Glass Cards */}
      <div className="glass-card card-left">
        <div className="card-header">
          <div className="ai-icon-mock" />
          <div className="card-title-mock" />
        </div>
        <div className="card-line-mock w-full" />
        <div className="card-line-mock w-3/4" />
        <div className="card-line-mock w-1/2" />
      </div>

      <div className="glass-card card-right">
        <div className="card-header">
          <div className="ai-icon-mock" />
          <div className="card-title-mock" />
        </div>
        <div className="card-line-mock w-full" />
        <div className="card-line-mock w-5/6" />
        <div className="card-line-mock w-4/6" />
      </div>

      {/* Main Content Layer (Foreground) */}
      <div className="hero-content-layer">
        {children}
      </div>
    </div>
  );
};

export default PremiumHeroBackground;
