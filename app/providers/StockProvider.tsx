'use client'

import React, { createContext, useContext } from 'react';

interface StockContextProps {
    inStock: boolean;
}

const StockContext = createContext<StockContextProps | null>(null);

export default function StockProvider({ children }: { children: React.ReactNode }) {
    // Change this value to control stock status
    // true = in stock, false = out of stock
    const inStock = false; // <-- Change this to toggle stock status
    
    return (
        <StockContext.Provider value={{ inStock }}>
            {children}
        </StockContext.Provider>
    );
}

export function useStockContext() {
    const context = useContext(StockContext);
    if (!context) {
        throw new Error('useStockContext must be used within a StockProvider');
    }
    return context;
}

