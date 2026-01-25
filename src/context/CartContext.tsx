'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Cart Item Interface
export interface CartItem {
    id: string; // Unique ID (e.g., productID + size)
    productId: string;
    name: string;
    image: string;
    price: number;
    size?: string;
    color?: string;
    qty: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, size: string) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, qty: number) => void;
    cartCount: number;
    cartTotal: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Initialize from LocalStorage (Client-side only)
    useEffect(() => {
        const storedCart = localStorage.getItem('broncstudio_cart');
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        } else {
            // Add some mock items for immediate delight (if empty)
            // Or leave empty. User wants "6 items", let's leave empty so they can build it.
            // Actually, for testing let's leave it empty.
        }
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem('broncstudio_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any, size: string) => {
        const itemId = `${product.id}-${size}`; // Unique key based on product + size

        setItems(prev => {
            const existing = prev.find(i => i.id === itemId);
            if (existing) {
                // Increment qty
                return prev.map(i => i.id === itemId ? { ...i, qty: i.qty + 1 } : i);
            } else {
                // Add new
                return [...prev, {
                    id: itemId,
                    productId: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price, // Ensure this is number
                    size: size,
                    color: product.color || 'Standard',
                    qty: 1
                }];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId: string, qty: number) => {
        if (qty < 1) {
            removeFromCart(itemId);
            return;
        }
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, qty } : i));
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartCount,
            cartTotal,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
