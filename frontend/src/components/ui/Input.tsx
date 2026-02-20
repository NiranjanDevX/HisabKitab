import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "block w-full px-5 py-3.5 bg-white/[0.03] border rounded-2xl",
                        "text-white placeholder-gray-600 font-bold text-sm",
                        "transition-all duration-300 outline-none",
                        error
                            ? 'border-rose-500/50 focus:border-rose-500 focus:bg-rose-500/[0.02]'
                            : 'border-white/[0.05] focus:border-primary-500/50 focus:bg-white/[0.05]',
                        "backdrop-blur-xl",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
