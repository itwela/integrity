import React from 'react';

interface IntegrityDividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export default function IntegrityDivider({ 
    orientation = 'horizontal',
    className = ''
}: IntegrityDividerProps) {
    const baseStyles = "bg-[#977B49]";
    const orientationStyles = orientation === 'horizontal' 
        ? "w-full h-[2px]" 
        : "h-full w-[2px]";

    return (
        <div className={`${baseStyles} ${orientationStyles} ${className}`} />
    );
} 