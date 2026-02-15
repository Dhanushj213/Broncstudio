'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Wallet, Banknote, ShieldCheck, Mail, MapPin, Phone, User, CheckCircle2, Loader2, ArrowRight, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AmbientBackground from '@/components/UI/AmbientBackground';
import GlassCard from '@/components/UI/GlassCard';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/actions/orderActions'; // Server Action
import { createBrowserClient } from '@supabase/ssr'; // Import Supabase Client

import { useStoreSettings } from '@/context/StoreSettingsContext';
import { validateCoupon } from '@/actions/couponActions';


const INDIAN_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function CheckoutPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'rejected'>('idle');
    const { userName } = useUI();
    const { items, clearCart, cartTotal } = useCart();
    const { settings } = useStoreSettings();
    const [loadingUser, setLoadingUser] = useState(true);
    const [pincodeLoading, setPincodeLoading] = useState(false);

    // Wallet State
    const [walletBalance, setWalletBalance] = useState(0);
    const [isWalletApplied, setIsWalletApplied] = useState(false);
    const [walletLoading, setWalletLoading] = useState(true);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type?: 'percentage' | 'fixed_amount' | 'free_shipping' } | null>(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const [lastOrderCashback, setLastOrderCashback] = useState(0);

    const isProcessing = orderStatus === 'processing';

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        secondaryPhone: '',
        name: '',
        address: '',
        landmark: '',
        city: '',
        pincode: '',
        state: '',
        country: 'India'
    });

    // OTP Auth State
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isGuest, setIsGuest] = useState(true);

    const handleSendOtp = async () => {
        if (formData.phone.length !== 10) {
            toast.error("Invalid Phone", { description: "Please enter a valid 10-digit phone number." });
            return;
        }

        setIsVerifyingOtp(true);
        const { error } = await supabase.auth.signInWithOtp({
            phone: '+91' + formData.phone,
        });

        setIsVerifyingOtp(false);

        if (error) {
            console.error("OTP Error:", error);
            toast.error("Failed to send OTP", { description: error.message });
        } else {
            setOtpSent(true);
            toast.success("OTP Sent!", { description: "Please check your mobile number." });
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error("Invalid OTP", { description: "Please enter a 6-digit OTP." });
            return;
        }

        setIsVerifyingOtp(true);
        const { data, error } = await supabase.auth.verifyOtp({
            phone: '+91' + formData.phone,
            token: otp,
            type: 'sms',
        });

        if (error) {
            setIsVerifyingOtp(false);
            console.error("Verify Error:", error);
            toast.error("Verification Failed", { description: error.message });
        } else {
            // Successful Login/Signup
            setIsOtpVerified(true);
            setIsGuest(false); // User is now logged in
            setOtpSent(false); // Hide OTP field
            toast.success("Verified!", { description: "Mobile number verified successfully." });

            // Update User Profile with Name/Email if provided
            if (data.user) {
                const updates: any = {};
                if (formData.name) updates.data = { ...updates.data, full_name: formData.name };
                if (formData.email) updates.email = formData.email; // This might trigger email change confirmation flow

                // Generally better to just update metadata for name
                if (formData.name) {
                    await supabase.auth.updateUser({
                        data: { full_name: formData.name }
                    });
                }

                // If we want to capture email, we might just store it in the order or profile table, 
                // changing auth email usually requires re-verification.
            }
            setIsVerifyingOtp(false);
        }
    };

    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Fetch User Data, Saved Addresses, and Wallet Balance on Mount
    useEffect(() => {
        const fetchUserAndAddresses = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsGuest(false); // User is logged in
                setIsOtpVerified(true); // Implicitly verified if logged in
                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    phone: (user.phone ? user.phone.replace(/\D/g, '').slice(-10) : user.user_metadata?.phone?.replace(/\D/g, '').slice(-10)) || '',
                }));

                // Fetch past orders for addresses
                const { data: orders } = await supabase
                    .from('orders')
                    .select('shipping_address')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (orders && orders.length > 0) {
                    const unique = new Map();
                    orders.forEach((o: any) => {
                        const addr = o.shipping_address;
                        // Key by pincode + address first 10 chars to avoid duplicates
                        const key = `${addr.pincode}-${addr.address.slice(0, 10)}`;
                        if (!unique.has(key)) {
                            unique.set(key, addr);
                        }
                    });
                    setSavedAddresses(Array.from(unique.values()));
                }

                // Fetch Wallet Balance
                try {
                    const { getWalletBalance } = await import('@/actions/walletActions');
                    const { balance } = await getWalletBalance();
                    setWalletBalance(balance);
                } catch (e) {
                    console.error("Failed to fetch wallet", e);
                }
            }
            setLoadingUser(false);
            setWalletLoading(false);
        };
        fetchUserAndAddresses();
    }, []);

    const handleSelectAddress = (index: number) => {
        if (index === -1) {
            // New Address - Reset fields but keep email/phone if they were pre-filled from user? 
            // Better to just clear address fields
            setSelectedAddressIndex(null);
            setFormData(prev => ({
                ...prev,
                name: '',
                address: '',
                landmark: '',
                city: '',
                state: '',
                pincode: '',
                // Keep email/phone as they are likely same for user
            }));
            return;
        }

        const addr = savedAddresses[index];
        setSelectedAddressIndex(index);
        setFormData(prev => ({
            ...prev,
            name: `${addr.firstName} ${addr.lastName}`,
            address: addr.address, // This might include landmark if it was appended previously
            landmark: addr.landmark || '', // If stored separately
            city: addr.city,
            state: addr.state || '', // If stored separately
            pincode: addr.pincode,
            phone: addr.phone || prev.phone, // Update phone if saved
            secondaryPhone: addr.secondaryPhone || '',
        }));
    };

    // 2. Pincode Lookup Logic
    useEffect(() => {
        if (formData.pincode.length === 6) {
            lookupPincode(formData.pincode);
        }
    }, [formData.pincode]);

    const lookupPincode = async (pincode: string) => {
        setPincodeLoading(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data && data[0] && data[0].Status === 'Success') {
                const details = data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    city: details.District,
                    state: details.State,
                    country: 'India' // Reset country just in case
                }));
            }
        } catch (error) {
            console.error("Failed to fetch pincode details:", error);
        } finally {
            setPincodeLoading(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Phone Validation (Numbers only, max 10)
        if (name === 'phone' || name === 'secondaryPhone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        // Pincode Validation (Numbers only, max 6)
        if (name === 'pincode') {
            const numericValue = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const subtotal = cartTotal;
    // Shipping Logic: Free if threshold met OR if free_shipping coupon is active
    const isFreeShippingCoupon = appliedCoupon?.type === 'free_shipping';
    const shipping = (subtotal >= settings.free_shipping_threshold || isFreeShippingCoupon) ? 0 : settings.shipping_charge;

    // Calculate Tax
    let totalTax = 0;

    // 1. Product Tax
    items.forEach(item => {
        const itemQty = item.qty;

        if (item.metadata?.is_custom) {
            // Split Tax Calculation for Custom Products
            const basePrice = item.metadata.base_price_unit || 0;
            const customCost = item.metadata.customization_cost_unit || 0;
            const productGst = item.metadata.gst_percent || 12;
            const printGst = item.metadata.print_gst_percent || 18;

            const baseTax = (basePrice * itemQty * productGst) / 100;
            const customTax = (customCost * itemQty * printGst) / 100;

            totalTax += (baseTax + customTax);
        } else {
            // Standard Product Tax
            // We assume standard products have gst_percent in metadata from admin
            // If not found, fallback to global setting or 18%
            const gst = item.metadata?.gst_percent || settings.tax_rate;
            const itemTax = (item.price * itemQty * gst) / 100;
            totalTax += itemTax;
        }
    });

    // 2. Shipping Tax (Standard 18% on Logistics)
    const shippingTax = shipping * 0.18;
    totalTax += shippingTax;

    const finalTax = parseFloat(totalTax.toFixed(2));
    const totalPreWallet = subtotal + shipping + finalTax;

    // Wallet Calculation
    let walletDiscount = 0;
    if (isWalletApplied && cartTotal >= 999) {
        const maxFromCart = cartTotal * 0.10; // 10% of cart value
        walletDiscount = parseFloat(Math.min(walletBalance, maxFromCart).toFixed(2));
    }

    // Auto-disable if cart drops below 999
    useEffect(() => {
        if (isWalletApplied && cartTotal < 999) {
            setIsWalletApplied(false);
        }
    }, [items, cartTotal, settings, walletBalance, loadingUser]);

    // Auto-Redirect on Success
    // Auto-Redirect on Success
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (orderStatus === 'success') {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [orderStatus]);

    // Handle Redirect Side Effect
    useEffect(() => {
        if (orderStatus === 'success' && countdown === 0) {
            router.push('/');
        }
    }, [orderStatus, countdown, router]);

    // Coupon Handler
    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponLoading(true);
        try {
            const res = await validateCoupon(couponCode, cartTotal);
            if (res.valid) {
                setAppliedCoupon({
                    code: res.couponCode!,
                    discount: res.discountAmount,
                    type: res.couponType
                });
                setCouponCode(''); // Clear input on success

                // Party Cheers Animation
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700']
                });

                toast.success("Coupon Applied Successfully!", {
                    description: `You saved ${formatPrice(res.discountAmount)} with ${res.couponCode}`,
                    icon: <PartyPopper className="text-orange-500" />,
                    duration: 4000
                });

            } else {
                setCouponError(res.message || 'Invalid coupon');
                setAppliedCoupon(null);
                toast.error("Invalid Coupon", { description: res.message });
            }
        } catch (error) {
            setCouponError('Failed to apply coupon');
            toast.error("Error", { description: "Failed to apply coupon. Please try again." });
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const finalTotal = totalPreWallet - walletDiscount - (appliedCoupon?.discount || 0);

    const handlePlaceOrder = async () => {
        // Validation
        if (!formData.name || !formData.address || !formData.email || !formData.city || !formData.state || !formData.pincode) {
            alert("Please fill in all shipping details.");
            return;
        }

        if (formData.phone.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (isGuest && !isOtpVerified) {
            alert("Please verify your phone number using OTP to proceed.");
            // Scroll to phone field
            document.querySelector("input[name='phone']")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (formData.pincode.length !== 6) {
            alert("Please enter a valid 6-digit pincode.");
            return;
        }

        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        if (isWalletApplied && paymentMethod === 'cod') {
            alert("Wallet cannot be used with COD.");
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
                address: formData.address + (formData.landmark ? `, Landmark: ${formData.landmark}` : ''),
                city: formData.city,
                state: formData.state, // Pass State
                pincode: formData.pincode,
                email: formData.email,
                secondaryPhone: formData.secondaryPhone
            } as any, finalTotal, paymentMethod, walletDiscount, appliedCoupon?.code, appliedCoupon?.discount);

            if (result.success) {
                // Calculate Cashback (5% of Cart Total)
                const cashback = parseFloat((cartTotal * 0.05).toFixed(2));
                setLastOrderCashback(cashback);

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
            <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden pt-24">
                <AmbientBackground />
                <GlassCard disableTilt className="max-w-md w-full p-8 text-center bg-card backdrop-blur-xl animate-scale-in border border-subtle">
                    <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4 leading-tight">
                        {name ? `${name} YOUR ORDER WAS PLACED SUCCESSFULLY` : 'YOUR ORDER WAS PLACED SUCCESSFULLY'}
                    </h1>
                    <p className="text-secondary font-medium mb-8">
                        Thank you for shopping with us! Your adventure awaits.
                    </p>

                    {/* Cashback Notification */}
                    {lastOrderCashback > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Cashback Earned!</p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-bold text-amber-700">{formatPrice(lastOrderCashback)}</span> has been earned and will be added to your wallet once this order is delivered.
                                </p>
                            </div>
                        </div>
                    )}
                    <p className="text-sm text-secondary mb-4">
                        You will be redirected to the home page in <span className="font-bold text-primary">{countdown}</span> seconds...
                    </p>
                    <Link href="/">
                        <button className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-coral-500 transition-colors shadow-lg">
                            Continue Shopping Now
                        </button>
                    </Link>
                </GlassCard>
            </main >
        );
    }

    if (orderStatus === 'rejected') {
        const name = userName ? userName.toUpperCase() : '';
        return (
            <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden pt-24">
                <AmbientBackground />
                <GlassCard disableTilt className="max-w-md w-full p-8 text-center bg-card backdrop-blur-xl border-red-900/20 border">
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
                                    <label className="block text-sm font-medium text-secondary mb-1">Phone Number (10 digits)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            maxLength={10}
                                            disabled={isOtpVerified || otpSent} // Disable if verified or OTP sent (waiting for code)
                                            className={`w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors ${isOtpVerified ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            placeholder="9876543210"
                                        />
                                        {isGuest && !isOtpVerified && !otpSent && (
                                            <button
                                                onClick={handleSendOtp}
                                                disabled={formData.phone.length !== 10 || isVerifyingOtp}
                                                className="px-4 py-3 bg-primary text-background font-bold rounded-xl hover:bg-coral-500 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isVerifyingOtp ? <Loader2 className="animate-spin" size={20} /> : 'Verify'}
                                            </button>
                                        )}
                                        {isOtpVerified && (
                                            <div className="flex items-center justify-center px-4 text-green-500 bg-green-100 rounded-xl shrink-0">
                                                <CheckCircle2 size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* OTP Input Section */}
                                    {otpSent && !isOtpVerified && (
                                        <div className="mt-4 animate-scale-in">
                                            <label className="block text-sm font-medium text-secondary mb-1">Enter OTP</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    maxLength={6}
                                                    className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors font-mono text-lg tracking-widest text-center"
                                                    placeholder="000000"
                                                />
                                                <button
                                                    onClick={handleVerifyOtp}
                                                    disabled={otp.length !== 6 || isVerifyingOtp}
                                                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isVerifyingOtp ? <Loader2 className="animate-spin" size={20} /> : 'Submit'}
                                                </button>
                                                <button
                                                    onClick={() => setOtpSent(false)}
                                                    className="px-3 py-3 text-secondary hover:text-primary transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <p className="text-xs text-secondary mt-2">
                                                By verifying, you agree to create an account with us.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Secondary Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        name="secondaryPhone"
                                        value={formData.secondaryPhone}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Alternate Number"
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

                            {/* Saved Address Selection */}
                            {savedAddresses.length > 0 && (
                                <div className="mb-6 p-4 bg-surface-2 rounded-xl border border-subtle">
                                    <label className="block text-sm font-bold text-primary mb-2">Saved Addresses</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {savedAddresses.map((addr, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelectAddress(idx)}
                                                className={`text-left text-sm p-3 rounded-lg border transition-all ${selectedAddressIndex === idx
                                                    ? 'bg-primary text-background border-primary shadow-md'
                                                    : 'bg-background text-secondary border-subtle hover:border-primary'
                                                    }`}
                                            >
                                                <p className="font-bold">{addr.firstName} {addr.lastName}</p>
                                                <p className="text-xs opacity-80 truncate max-w-[150px]">{addr.address}</p>
                                                <p className="text-xs opacity-80">{addr.city}, {addr.pincode}</p>
                                            </button>
                                        ))}

                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="John Doe"
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
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-secondary mb-1">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Near..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1 flex justify-between">
                                        Pincode
                                        {pincodeLoading && <Loader2 size={14} className="animate-spin text-primary" />}
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        maxLength={6}
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary transition-colors"
                                        placeholder="560001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1 flex justify-between">City (Auto-detected)</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-3 text-secondary focus:outline-none cursor-not-allowed"
                                        placeholder="Enter Pincode first"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-secondary mb-1">State (Auto-detected)</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border border-subtle bg-surface-3 text-secondary focus:outline-none cursor-not-allowed appearance-none"
                                    >
                                        <option value="" disabled>Select State</option>
                                        {INDIAN_STATES.map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
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

                        {/* 3. Payment Method */}
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm border border-subtle">3</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'upi'
                                        ? 'border-primary bg-surface-2'
                                        : 'border-subtle hover:border-primary/50'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">UPI / Online</p>
                                        <p className="text-xs text-secondary">Pay securely</p>
                                    </div>
                                    {paymentMethod === 'upi' && <CheckCircle2 className="ml-auto text-primary" size={20} />}
                                </div>

                                <div
                                    onClick={() => {
                                        if (isWalletApplied) {
                                            alert("Wallet cannot be used with Cash on Delivery.");
                                            return;
                                        }
                                        setPaymentMethod('cod');
                                    }}
                                    className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'cod'
                                        ? 'border-primary bg-surface-2'
                                        : isWalletApplied ? 'opacity-50 cursor-not-allowed border-subtle' : 'border-subtle hover:border-primary/50'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                        <Banknote size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">Cash on Delivery</p>
                                        <p className="text-xs text-secondary">Pay when it arrives</p>
                                        {isWalletApplied && <p className="text-[10px] text-red-500 font-bold">Not available with Wallet</p>}
                                    </div>
                                    {paymentMethod === 'cod' && <CheckCircle2 className="ml-auto text-primary" size={20} />}
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
                                        {shipping === 0 ? (
                                            <>Free {isFreeShippingCoupon && <span className="text-[10px] ml-1 opacity-80">(Coupon)</span>}</>
                                        ) : formatPrice(shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-secondary">
                                    <span>GST (Calculated)</span>
                                    <span className="font-medium text-primary">{formatPrice(finalTax)}</span>
                                </div>

                                {isWalletApplied && (
                                    <div className="flex justify-between text-sm text-green-500 animate-pulse">
                                        <span className="font-bold flex items-center gap-1"><Wallet size={14} /> Wallet Credit</span>
                                        <span className="font-bold">-{formatPrice(walletDiscount)}</span>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-green-500">
                                        <span className="font-bold flex items-center gap-1"><Banknote size={14} /> Coupon Discount</span>
                                        <span className="font-bold">-{formatPrice(appliedCoupon.discount)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-subtle my-4"></div>

                            {/* Coupon Section */}
                            <div className="mb-6">
                                {appliedCoupon ? (
                                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 p-4 rounded-xl flex justify-between items-center animate-scale-in relative overflow-hidden">
                                        {/* Subtle background shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />

                                        <div className="relative z-10">
                                            <p className="text-sm font-bold text-green-600 flex items-center gap-2">
                                                <PartyPopper size={16} className="text-green-500 animate-bounce" />
                                                {appliedCoupon.type === 'free_shipping' ? 'Free Shipping Active!' : 'Coupon Applied!'}
                                            </p>
                                            <p className="text-xs text-green-700/80 font-medium mt-0.5">
                                                <span className="font-mono bg-green-200/50 px-1 rounded text-green-800">{appliedCoupon.code}</span>
                                                &nbsp;saved you&nbsp;
                                                <span className="font-bold underline">{appliedCoupon.type === 'free_shipping' ? 'Shipping Charges' : formatPrice(appliedCoupon.discount)}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="relative z-10 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-all"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="flex-1 bg-surface-2 border border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading || !couponCode}
                                            className="bg-primary text-background px-4 py-2 rounded-xl text-sm font-bold hover:bg-coral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {couponLoading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-xs text-red-500 mt-2 ml-1">{couponError}</p>}
                            </div>

                            <div className="border-t border-subtle my-4"></div>

                            {/* Wallet Toggle */}
                            {walletBalance > 0 && cartTotal >= 999 && (
                                <div className="bg-surface-2 p-4 rounded-xl border border-subtle mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                <Wallet size={16} className="text-coral-500" />
                                                Use Wallet Balance
                                            </p>
                                            <p className="text-xs text-secondary">Available: {formatPrice(walletBalance)}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isWalletApplied}
                                                onChange={(e) => {
                                                    if (paymentMethod === 'cod' && e.target.checked) {
                                                        alert("Wallet credits cannot be used with Cash on Delivery. Please switch to Online Payment.");
                                                        setPaymentMethod('upi'); // Auto switch
                                                    }
                                                    setIsWalletApplied(e.target.checked);
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-coral-500"></div>
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-secondary mt-2">
                                        Max used: 10% of cart.
                                        {walletDiscount > 0 && ` (Saving ${formatPrice(walletDiscount)})`}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-primary">Total</span>
                                <span className="text-2xl font-heading font-bold text-primary">{formatPrice(finalTotal)}</span>
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
