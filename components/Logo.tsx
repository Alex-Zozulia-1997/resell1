import React from 'react';

interface LogoProps {
  textSize?: string;
  roundness?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  textSize = 'text-xl', 
  roundness = 'rounded-lg',
  className = '' 
}) => {
  return (
    <div
      className={`flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 ${roundness} pl-2 pr-1 py-1 ${className}`}>
      <span
        className={`${textSize} font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest`}>
        IP
      </span>
      <span className={`${textSize} font-bold text-gray-800 dark:text-gray-200 pl-[2px]`}>
        den
      </span>
    </div>
  );
};

export default Logo;