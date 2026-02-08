'use client';

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, Banknote, ShieldCheck, Mail, MapPin, Phone, User, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import GlassCard from '@/components/UI/GlassCard';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/actions/orderActions'; // Server Action

import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'rejected'>('idle');
    const { userName } = useUI();
    const { items, clearCart, cartTotal } = useCart();
    const { settings } = useStoreSettings();

    const isProcessing = orderStatus === 'processing';

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        name: '',
        address: '',
        city: '',
        pincode: '',
        state: '',
        country: 'India'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const subtotal = cartTotal;
    const shipping = subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_charge;
    const tax = Math.round(subtotal * (settings.tax_rate / 100));
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        // Basic Validation
        if (!formData.name || !formData.address || !formData.phone || !formData.email) {
            alert("Please fill in all shipping details.");
            return;
        }

        setOrderStatus('processing');

        try {
            // Map Cart Items to fit Server Action interface
            const orderItems = items.map(i => ({
                id: i.id,
                productId: i.productId,
                name: i.name,
                price: i.price,
                qty: i.qty,
                size: i.size,
                image: i.image,
                metadata: i.metadata
            }));

            // Call Server Action
            // Adapting formData to match expected structure if needed, or assuming Server Action handles it
            const result = await createOrder(orderItems, {
                firstName: formData.name.split(' ')[0],
                lastName: formData.name.split(' ').slice(1).join(' '),
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                // Passing email and state if the server action supports it, otherwise it might just ignore
            } as any, total, paymentMethod);

            if (result.success) {
                clearCart();
                setOrderStatus('success');
            } else {
                console.error(result.error);
                setOrderStatus('rejected');
                alert(result.error); // Simple feedback for now
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            setOrderStatus('rejected');
        }
    };

    if (orderStatus === 'success') {
        const name = userName ? userName.toUpperCase() : '';
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <AmbientBackground />
                <GlassCard className="max-w-md w-full p-8 text-center bg-card backdrop-blur-xl animate-scale-in border border-subtle">
                    <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4 leading-tight">
                        {name ? `${name} YOUR ORDER WAS PLACED SUCCESSFULLY` : 'YOUR ORDER WAS PLACED SUCCESSFULLY'}
                    </h1>
                    <p className="text-secondary font-medium mb-8">
                        Thank you for shopping with us! Your adventure awaits.
                    </p>
                    <Link href="/">
                        <button className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-coral-500 transition-colors shadow-lg">
                            Continue Shopping
                        </button>
                    </Link>
                </GlassCard>
            </main>
        );
    }

    if (orderStatus === 'rejected') {
        const name = userName ? userName.toUpperCase() : '';
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <AmbientBackground />
                <GlassCard className="max-w-md w-full p-8 text-center bg-card backdrop-blur-xl border-red-900/20 border">
                    <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4 leading-tight">
                        {name ? `${name} YOUR ORDER WAS REJECTED` : 'YOUR ORDER WAS REJECTED'}
                    </h1>
                    <p className="text-secondary font-medium mb-8">
                        There was an issue processing your payment. Please try again.
                    </p>
                    <button
                        onClick={() => setOrderStatus('idle')}
                        className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-coral-500 transition-colors shadow-lg"
                    >
                        Try Again
                    </button>
                </GlassCard>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-[var(--header-height)] pb-20">
            <AmbientBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Link href="/cart" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 group font-bold">
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform border border-subtle">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Bag
                </Link>

                <h1 className="text-3xl font-heading font-bold text-primary mb-8 text-center md:text-left">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Form */}
                    <div className="space-y-8">

                        {/* 1. Contact Info */}
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm border border-subtle">1</span>
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. Shipping Address */}
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm border border-subtle">2</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-secondary mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Street, Apartment, Suite, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-3 text-secondary focus:outline-none cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isProcessing
                                ? 'bg-surface-3 text-secondary cursor-not-allowed'
                                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-coral-500 dark:hover:bg-coral-400 hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {isProcessing ? (
                                <>Processing <Loader2 className="animate-spin" size={20} /></>
                            ) : (
                                <>Place Order <ArrowRight size={20} /></>
                            )}
                        </button>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-subtle">
                            <h2 className="text-xl font-bold text-primary mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-surface-2 rounded-lg overflow-hidden flex-shrink-0 border border-subtle">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-primary truncate">{item.name}</h4>
                                            <p className="text-xs text-secondary">{item.size} / {item.metadata?.color || 'N/A'}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-secondary">Qty: {item.qty}</span>
                                                <span className="text-sm font-bold text-primary">{formatPrice(item.price * item.qty)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-subtle my-4"></div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-secondary">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-primary">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-secondary">
                                    <span>Shipping</span>
                                    <span className={`font-medium ${shipping === 0 ? 'text-green-500' : 'text-primary'}`}>
                                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-secondary">
                                    <span>Tax ({settings.tax_rate}%)</span>
                                    <span className="font-medium text-primary">{formatPrice(tax)}</span>
                                </div>
                            </div>

                            <div className="border-t border-subtle my-4"></div>

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-primary">Total</span>
                                <span className="text-2xl font-heading font-bold text-primary">{formatPrice(total)}</span>
                            </div>

                            <div className="mt-6 text-xs text-secondary text-center flex items-center justify-center gap-2">
                                <ShieldCheck size={14} />
                                Secure SSL Encrypted Transaction
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
