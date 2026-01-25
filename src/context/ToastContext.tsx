'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Mail } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'subscribe';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 999999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`${toast.type === 'subscribe' ? 'bg-[#800000]' : 'bg-navy-900'} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] pointer-events-auto border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-300`}
                    >
                        {toast.type === 'success' && <CheckCircle2 className="text-green-400" size={20} />}
                        {toast.type === 'error' && <AlertCircle className="text-red-400" size={20} />}
                        {toast.type === 'info' && <Info className="text-blue-400" size={20} />}
                        {toast.type === 'subscribe' && <Mail className="text-white" size={20} />}

                        <span className="flex-1 font-bold text-sm tracking-wide">{toast.message}</span>

                        <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
