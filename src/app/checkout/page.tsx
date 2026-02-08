'use client';

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, Banknote, ShieldCheck, Mail, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
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

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
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
        if (!formData.firstName || !formData.address || !formData.phone) {
            alert("Please fill in all shipping details.");
            return;
        }

        setOrderStatus('processing');

        try {
            // Map Cart Items to fit Server Action interface
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
            const result = await createOrder(orderItems, formData, total, paymentMethod);

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

    // ... (Render logic remains largely same, just binding inputs)

    if (orderStatus === 'success') {
        const name = userName ? userName.toUpperCase() : '';
        return (
            <main className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4 relative overflow-hidden">
                <AmbientBackground />
                <GlassCard className="max-w-md w-full p-8 text-center bg-white/90 backdrop-blur-xl animate-scale-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 mb-4 leading-tight">
                        {name ? `${name} YOUR ORDER WAS PLACED SUCCESSFULLY` : 'YOUR ORDER WAS PLACED SUCCESSFULLY'}
                    </h1>
                    <p className="text-gray-500 font-medium mb-8">
                        Thank you for shopping with us! Your adventure awaits.
                    </p>
                    <Link href="/">
                        <button className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-colors shadow-lg">
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
            <main className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4 relative overflow-hidden">
                <AmbientBackground />
                <GlassCard className="max-w-md w-full p-8 text-center bg-white/90 backdrop-blur-xl border-red-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 mb-4 leading-tight">
                        {name ? `${name} YOUR ORDER WAS REJECTED` : 'YOUR ORDER WAS REJECTED'}
                    </h1>
                    <p className="text-gray-500 font-medium mb-8">
                        There was an issue processing your payment. Please try again.
                    </p>
                    <button
                        onClick={() => setOrderStatus('idle')}
                        className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-colors shadow-lg"
                    >
                        Try Again
                    </button>
                </GlassCard>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF9F7] relative overflow-hidden pb-32 md:pb-20">
            <AmbientBackground className="opacity-60" />

            {/* Loading Overlay */}
            {orderStatus === 'processing' && (
                <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-navy-100 border-t-navy-900 rounded-full animate-spin mb-4"></div>
                    <p className="font-heading font-bold text-navy-900 text-xl animate-pulse">Processing your order...</p>
                </div>
            )}

            <div className="container-premium max-w-[1000px] mx-auto px-4 md:px-6 pt-8 md:pt-12 relative z-10">
                <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-navy-900 transition-colors mb-6 group font-bold">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Bag
                </Link>

                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-navy-900 mb-2">Checkout 🚀</h1>
                    <p className="text-gray-500 font-medium">Almost there! Where should we send your adventure?</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Forms */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <GlassCard className="p-6 md:p-8">
                            <h2 className="text-xl font-heading font-bold text-navy-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm">1</span>
                                Shipping Address
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-100 focus:border-navy-900 focus:bg-white transition-all font-bold text-navy-900 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-100 focus:border-navy-900 focus:bg-white transition-all font-bold text-navy-900 outline-none" />
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-100 focus:border-navy-900 focus:bg-white transition-all font-bold text-navy-900 outline-none" />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                        <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} placeholder="Address Line 1, Area, Landmark" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-100 focus:border-navy-900 focus:bg-white transition-all font-bold text-navy-900 outline-none resize-none" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-100 focus:border-navy-900 focus:bg-white transition-all font-bold text-navy-900 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Pincode</label>
                                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-100 focus:border-navy-900 focus:bg-white transition-all font-bold text-navy-900 outline-none" />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Payment Method */}
                        <GlassCard className="p-6 md:p-8">
                            <h2 className="text-xl font-heading font-bold text-navy-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-coral-100 text-coral-600 flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                {[
                                    { id: 'upi', label: 'UPI / Wallets', icon: Wallet, color: '#5BC0EB' },
                                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: '#FF6F61' },
                                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, color: '#222' }
                                ].map((option) => (
                                    <label key={option.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === option.id ? 'border-navy-900 bg-navy-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === option.id}
                                            onChange={() => setPaymentMethod(option.id)}
                                            className="w-5 h-5 accent-navy-900"
                                        />
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm text-[${option.color}]`}>
                                            <option.icon size={20} color={option.color} />
                                        </div>
                                        <span className="font-bold text-navy-900">{option.label}</span>
                                        {paymentMethod === option.id && <CheckCircle2 size={20} className="ml-auto text-navy-900" />}
                                    </label>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="md:sticky md:top-32">
                        <GlassCard className="p-6 bg-white/80 backdrop-blur-xl">
                            <h3 className="text-lg font-heading font-bold text-navy-900 mb-4">You're paying,</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-heading font-bold text-navy-900">{formatPrice(total)}</span>
                                <span className="text-sm text-gray-500 font-bold">Total</span>
                            </div>

                            {/* Items Preview */}
                            <div className="mb-6 space-y-3 max-h-48 overflow-y-auto pr-1 cart-scroll">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-navy-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty} {item.size && `• ${item.size}`}</p>
                                        </div>
                                        <p className="text-sm font-bold text-navy-900">{formatPrice(item.price * item.qty)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-navy-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={`${shipping === 0 ? 'text-green-500' : 'text-navy-900'} font-bold`}>
                                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-bold text-navy-900">{formatPrice(tax)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={20} /> Place Order
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                                Secure payments processed by Razorpay.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </main>
    );
}

