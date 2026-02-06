'use client';

import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';

type Variant = 'default' | 'gradient' | 'dark';
type Padding = 'none' | 'sm' | 'default' | 'lg';
type Shadow = 'none' | 'sm' | 'default' | 'lg' | 'xl';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  padding?: Padding;
  shadow?: Shadow;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      padding = 'default',
      shadow = 'default',
      hover = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'bg-white rounded-xl border border-gray-200 transition-all duration-200';

    const variants: Record<Variant, string> = {
      default: '',
      gradient: 'bg-gradient-to-br from-white to-gray-50',
      dark: 'bg-gray-900 border-gray-700 text-white',
    };

    const paddings: Record<Padding, string> = {
      none: '',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    };

    const shadows: Record<Shadow, string> = {
      none: '',
      sm: 'shadow-sm',
      default: 'shadow-lg',
      lg: 'shadow-xl',
      xl: 'shadow-2xl',
    };

    const hoverEffect = hover
      ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      : '';

    const classes = [
      baseClasses,
      variants[variant],
      paddings[padding],
      shadows[shadow],
      hoverEffect,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
interface SubComponentProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '' }: SubComponentProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: SubComponentProps) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }: SubComponentProps) => (
  <div className={className}>{children}</div>
);

const CardFooter = ({ children, className = '' }: SubComponentProps) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

// Extend Card with subcomponents using type assertion
type CardComponent = typeof Card & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

const CardWithSubcomponents = Card as CardComponent;
CardWithSubcomponents.Header = CardHeader;
CardWithSubcomponents.Title = CardTitle;
CardWithSubcomponents.Content = CardContent;
CardWithSubcomponents.Footer = CardFooter;

export default CardWithSubcomponents;
