'use client';

import React, {
  forwardRef,
  useState,
  ReactNode,
  InputHTMLAttributes,
} from 'react';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'default' | 'filled' | 'error';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  inputSize?: Size;
  variant?: Variant;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      inputSize = 'md',
      variant = 'default',
      icon,
      rightIcon,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const baseClasses =
      'w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

    const variants: Record<Variant, string> = {
      default:
        'border-gray-300 bg-white text-gray-900 placeholder-gray-500',
      filled:
        'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white',
      error:
        'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500',
    };

    const sizes: Record<Size, string> = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-4 py-4 text-base',
    };

    const inputVariant: Variant = error ? 'error' : variant;

    const classes = [
      baseClasses,
      variants[inputVariant],
      sizes[inputSize],
      icon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClassName}>
        {label && (
          <label
            className={`block text-sm font-medium mb-2 transition-colors ${
              focused
                ? 'text-blue-600'
                : error
                ? 'text-red-600'
                : 'text-gray-700'
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span
                className={`text-sm ${
                  error
                    ? 'text-red-400'
                    : focused
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }`}
              >
                {icon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={classes}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span
                className={`text-sm ${
                  error
                    ? 'text-red-400'
                    : focused
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }`}
              >
                {rightIcon}
              </span>
            </div>
          )}

          {/* Animated underline */}
          <div
            className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
              focused ? 'w-full' : 'w-0'
            }`}
          ></div>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
