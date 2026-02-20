import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'relative inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-500/20 border border-primary-400/20',
        secondary: 'bg-white text-dark-950 hover:bg-white/90 shadow-xl shadow-white/5',
        outline: 'border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/20',
        ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
        danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white',
    };

    const sizes = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3.5',
        lg: 'px-10 py-5 text-xs',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <div className="mr-3">
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : null}
            <span className="relative z-10 flex items-center justify-center gap-2 w-full">{children}</span>
        </motion.button>
    );
};
