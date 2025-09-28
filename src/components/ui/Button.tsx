import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'figma-primary' | 'figma-outline';
  size?:
    | 'default'
    | 'sm'
    | 'lg'
    | 'figma'
    | 'figma-full'
    | 'figma-mobile'
    | 'figma-compact';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
    'figma-primary':
      'bg-[#1C65DA] text-[#FDFDFD] hover:bg-[#1557c7] focus:ring-[#1C65DA]',
    'figma-outline':
      'border border-[#D5D7DA] bg-white text-[#0A0D12] hover:bg-gray-50 focus:ring-[#1C65DA]',
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm rounded-md',
    sm: 'h-8 px-3 py-1 text-xs rounded-md',
    lg: 'h-12 px-6 py-3 text-base rounded-md',
    figma:
      'h-12 w-[163px] px-2 py-2 text-base font-bold leading-[30px] tracking-[-0.02em] rounded-full',
    'figma-full':
      'h-12 w-[400px] px-2 py-2 text-base font-bold leading-[30px] tracking-[-0.02em] rounded-full',
    'figma-mobile':
      'h-12 w-full px-2 py-2 text-base font-bold leading-[30px] tracking-[-0.02em] rounded-full',
    'figma-compact':
      'h-10 w-full px-3 py-1.5 text-xs font-bold leading-[20px] tracking-[-0.02em] rounded-full',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
