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
    metadata?: any; // For custom orders
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, size: string, quantity?: number) => void;
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
        }
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem('broncstudio_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any, size: string, quantity: number = 1) => {
        // If it's a custom order, we need a unique ID for every addition (allow multiple configs)
        // Otherwise, group by product+size+model
        const isCustom = size === 'Custom' || product.metadata?.is_custom;
        const itemId = isCustom
            ? `${product.id}-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            : `${product.id}-${size}`;

        setItems(prev => {
            const existing = prev.find(i => i.id === itemId);
            if (existing && !isCustom) {
                // Increment qty by the requested quantity
                return prev.map(i => i.id === itemId ? { ...i, qty: i.qty + quantity } : i);
            } else {
                // Add new with the requested quantity
                return [...prev, {
                    id: itemId,
                    productId: product.id,
                    name: product.name,
                    image: product.image || (product.images ? product.images[0] : ''),
                    price: Number(product.price),
                    size: size,
                    color: product.color || 'Standard',
                    qty: quantity,
                    metadata: product.metadata || {}
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
    const cartTotal = parseFloat(items.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2));

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
