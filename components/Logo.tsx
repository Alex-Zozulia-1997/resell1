import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  roundness?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md',
  roundness = 'rounded-lg',
  className = '' 
}) => {
  // Hardcoded sizes for different contexts
  const getSizeClasses = (size: string) => {
    const sizes = {
      'xs': 'w-16 h-6',     // Sidebar, mobile
      'sm': 'w-20 h-8',     // Small contexts
      'md': 'w-28 h-11',    // Default navbar
      'lg': 'w-36 h-14',    // Large contexts
      'xl': 'w-48 h-19',    // Footer, large sections
      'hero': 'w-64 h-24'   // Hero section
    };
    return sizes[size as keyof typeof sizes] || 'w-28 h-11';
  };

  return (
    <div className={`relative ${getSizeClasses(size)} ${className}`}>
      <Image
        src="/IPLogo.svg"
        alt="IPden Logo"
        fill
        className={`${roundness} hover:scale-105 transition-transform duration-200 object-contain`}
        priority
      />
    </div>
  );
};

export default Logo;