import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
    };

    const handleMouseLeave = () => {
      setIsMoving(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isMoving) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 mix-blend-screen"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer glow ring */}
      <div className="absolute w-8 h-8 border-2 border-cosmic-blue rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-60" />
      
      {/* Inner dot */}
      <div className="absolute w-2 h-2 bg-cosmic-blue rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      {/* Extra glow effect */}
      <div className="absolute w-6 h-6 bg-cosmic-blue rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl opacity-20" />
    </div>
  );
};

export default CustomCursor;
