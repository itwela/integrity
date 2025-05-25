'use client'

import React from 'react';

interface IntegrityButtonProps {
    onClick?: () => void;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    id?: string;
}

const IntegrityButton: React.FC<IntegrityButtonProps> = ({
    onClick,
    backgroundColor = '#C4A962',
    borderColor = '#C4A962',
    textColor = '#FFFFFF',
    children,
    className = '',
    disabled = false,
    id
}) => {
    return (
        <button
            id={id}
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor,
                borderColor,
                borderWidth: '1px',
                fontFamily: 'boldMain',
                fontWeight: 'bold',
                color: textColor,
            }}
            className={`
                cursor-pointer
                px-6 py-2 min-w-[130px]   mx-2 rounded-full
                transition-all duration-200 ease-in-out
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.4)]
                bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-transparent
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_12px_rgba(0,0,0,0.45)]
                active:translate-y-[1px] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default IntegrityButton; 