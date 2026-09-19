import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-colors select-none focus-visible:outline-3 focus-visible:outline-sage-600 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    md: 'px-5 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[58px] touch-target-lg',
  };

  const variantStyles = {
    primary: 'bg-sage-600 hover:bg-sage-700 text-white shadow-subtle active:bg-sage-800',
    secondary: 'bg-cream-200 hover:bg-cream-300 text-ink-900 active:bg-cream-300 border border-borderBase',
    outline: 'bg-transparent hover:bg-cream-200 text-ink-900 border-2 border-borderBase active:bg-cream-300',
    danger: 'bg-red-700 hover:bg-red-800 text-white active:bg-red-900',
    success: 'bg-emerald-700 hover:bg-emerald-800 text-white active:bg-emerald-900',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
