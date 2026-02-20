'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our product data for Quick View
// (Should match ProductCard props mostly)
export interface QuickViewProductData {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    brand?: string;
    colors?: string[];
    stock_status?: string;
    badge?: string;
    sizes?: string[];
    metadata?: any;
    is_sold_out?: boolean;
}

interface UIContextType {
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;

    isWishlistOpen: boolean;
    toggleWishlist: () => void;
    closeWishlist: () => void;
    openWishlist: () => void;

    quickViewProduct: QuickViewProductData | null;
    openQuickView: (product: QuickViewProductData) => void;
    closeQuickView: () => void;

    currency: 'INR' | 'USD';
    setCurrency: (currency: 'INR' | 'USD') => void;
    formatPrice: (amountInInr: number) => string;

    cartCount: number;
    addToBag: (product: any) => void;

    userName: string | null;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [cartCount, setCartCount] = useState(2); // Mock initial count
    const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProductData | null>(null);
    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
    const [userName, setUserName] = useState<string | null>(null); // Default to no user logged in

    // Cart Actions
    const addToBag = (product: any) => {
        setCartCount(prev => prev + 1);
        alert(`Added ${product.name} to bag!`);
    };

    // Search Actions
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    // Wishlist Actions
    const toggleWishlist = () => setIsWishlistOpen(prev => !prev);
    const closeWishlist = () => setIsWishlistOpen(false);
    const openWishlist = () => setIsWishlistOpen(true);

    // Quick View Actions
    const openQuickView = (product: QuickViewProductData) => setQuickViewProduct(product);
    const closeQuickView = () => setQuickViewProduct(null);

    // Currency Formatter
    const formatPrice = (amountInInr: number) => {
        if (currency === 'INR') {
            return `₹${amountInInr}`;
        } else {
            // Simple conversion: 1 USD = 83 INR
            const inUsd = (amountInInr / 83).toFixed(2);
            return `$${inUsd}`;
        }
    };

    // Basic "Block Scroll" logic when overlays are open could go here via useEffect
    // For now keeping it simple.

    return (
        <UIContext.Provider value={{
            isSearchOpen,
            openSearch,
            closeSearch,
            isWishlistOpen,
            toggleWishlist,
            closeWishlist,
            openWishlist,
            quickViewProduct,
            openQuickView,
            closeQuickView,
            currency,
            setCurrency,
            formatPrice,
            cartCount,
            addToBag,
            userName
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
