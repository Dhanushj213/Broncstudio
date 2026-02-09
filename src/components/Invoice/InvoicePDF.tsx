
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Fonts (Optional - using standard Helvetica for now to ensure compatibility)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 8,
        color: '#1a1a1a',
        lineHeight: 1.4,
        position: 'relative',
    },
    watermark: {
        position: 'absolute',
        top: 250,
        left: 100,
        width: 400,
        height: 400,
        opacity: 0.1,
        transform: 'rotate(-45deg)',
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        borderBottomStyle: 'solid',
        paddingBottom: 15,
    },
    companyDetails: {
        flexDirection: 'column',
        textAlign: 'right',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#111827',
        letterSpacing: 1,
        marginBottom: 8, // Added margin to prevent overlap
    },
    subTitle: {
        fontSize: 9,
        color: '#6b7280',
        marginTop: 2,
    },
    invoiceMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
    },
    metaColumn: {
        flexDirection: 'column',
        width: '48%',
    },
    label: {
        fontSize: 7,
        textTransform: 'uppercase',
        color: '#6b7280',
        marginBottom: 2,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 9,
        color: '#111827',
        marginBottom: 4,
    },
    // Table Styles
    table: {
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'solid',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingVertical: 6,
        alignItems: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingVertical: 8,
        alignItems: 'flex-start',
    },
    colHeader: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#374151',
        paddingHorizontal: 4,
    },
    colText: {
        fontSize: 8,
        paddingHorizontal: 4,
    },
    productName: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#111827',
    },
    productMeta: {
        fontSize: 7,
        color: '#6b7280',
        marginTop: 1,
    },
    totals: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
        width: '50%',
    },
    totalLabel: {
        fontSize: 9,
        color: '#4b5563',
        marginRight: 10,
        textAlign: 'right',
        flex: 1,
    },
    totalValue: {
        fontSize: 9,
        color: '#111827',
        fontWeight: 'bold',
        width: 80,
        textAlign: 'right',
    },
    grandTotal: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 8,
        marginTop: 4,
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        width: 'auto',
        textAlign: 'right',
        flex: 1,
        marginRight: 20,
    },
    grandTotalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        width: 80,
        textAlign: 'right',
    },
    footer: {
        marginTop: 'auto', // Push to bottom if content is short, or just margin
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        textAlign: 'center',
        fontSize: 7,
        color: '#9ca3af',
        width: '100%',
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
    },
});

export interface OrderItem {
    id?: string;
    product_id?: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    image_url?: string;
    metadata?: any;
}

export interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    user_id: string;
    payment_status: string;
    payment_method: string;
    items?: OrderItem[];
    coupon_discount?: number;
    discount_amount?: number;
    wallet_amount_used?: number;
}

interface InvoicePDFProps {
    order: Order;
    logoPath?: string;
}

// Helpers
const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ order, logoPath = '/blacklogo.png' }) => {

    // 1. Determine State Logic
    const shippingState: string = (order.shipping_address?.state || '').toLowerCase().trim();
    // Assuming 'karnataka' or 'ka' is the home state. 
    const isInterState = !(shippingState === 'karnataka' || shippingState === 'ka');

    // 2. Calculate Taxes Per Item
    let runningSubtotal = 0;
    let runningTotalTax = 0;

    const enrichedItems = (order.items || []).map(item => {
        const meta = item.metadata || {};
        const qty = item.quantity;

        // Strategy: "Rate" is usually pre-tax basic price.
        // But if item.price is the selling price (inclusive or exclusive dependent on your DB), we need to clarify.
        // Assuming item.price is the taxable value (base price) logic from previous context:
        // "const itemTax = (item.price * itemQty * gst) / 100"
        // This implies item.price is EXCLUSIVE of tax.

        const unitPrice = item.price;
        const taxableValue = unitPrice * qty;

        let taxPercent = 18; // Default
        if (meta.is_custom) {
            taxPercent = meta.gst_percent || 12;
        } else {
            taxPercent = meta.gst_percent || 18;
        }

        const taxAmount = (taxableValue * taxPercent) / 100;

        runningSubtotal += taxableValue;
        runningTotalTax += taxAmount;

        const totalLineAmount = taxableValue + taxAmount;

        return {
            ...item,
            taxPercent,
            taxableValue,
            taxAmount,
            totalLineAmount
        };
    });

    // Shipping Calculation (Balancing figure)
    // Grand Total (Paid) = Subtotal + Tax + Shipping - Coupon - Wallet
    // Therefore: Shipping = Grand Total - (Subtotal + Tax) + Coupon + Wallet

    const calculatedGross = runningSubtotal + runningTotalTax;
    const couponDiscount = order.coupon_discount || order.discount_amount || 0;
    const walletUsed = order.wallet_amount_used || 0;

    // We used order.total_amount as the final paid amount
    // So Shipping = Paid - Gross + Coupon + Wallet
    // E.g. Gross 118. Coupon 10. Paid 108. Shipping 0.
    // 108 - 118 + 10 + 0 = 0. Correct.

    const shippingCost = Math.max(0, order.total_amount - calculatedGross + couponDiscount + walletUsed);

    // 3. Payment/Order Status Logic
    let displayStatus = 'PENDING';
    let statusColor = '#F59E0B'; // Amber/Warning by default

    // Priority 1: Order Cancellation
    if (order.status?.toLowerCase() === 'cancelled') {
        displayStatus = 'CANCELLED';
        statusColor = '#EF4444'; // Red
    }
    // Priority 2: Payment Status (Admin overrides)
    else if (order.payment_status === 'refunded') {
        displayStatus = 'REFUNDED';
        statusColor = '#6366F1'; // Indigo
    }
    else if (order.payment_status === 'paid') {
        displayStatus = 'PAID';
        statusColor = '#10B981'; // Green
    }
    else if (order.payment_status === 'failed') {
        displayStatus = 'PAYMENT FAILED';
        statusColor = '#EF4444'; // Red
    }
    else {
        // Fallback for pending/cod
        if (order.payment_method === 'cod') {
            displayStatus = 'PENDING (COD)';
        } else {
            displayStatus = 'PAYMENT PENDING';
        }
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark Logo */}
                <Image src={logoPath} style={styles.watermark} />

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Image src={logoPath} style={{ width: 100, height: 'auto', marginBottom: 10 }} />
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>BRONCSTUDIO</Text>
                        <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 4 }}>Bangalore, Karnataka, India</Text>
                        <Text style={{ fontSize: 8, color: '#6b7280' }}>support@broncstudio.com</Text>
                        <Text style={{ fontSize: 8, color: '#6b7280' }}>GSTIN: 29AAAAA0000A1Z5</Text>
                    </View>
                    <View style={styles.companyDetails}>
                        <Text style={styles.title}>TAX INVOICE</Text>
                        <Text style={styles.subTitle}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                        <Text style={{ fontSize: 9, marginTop: 4 }}>Date: {formatDate(order.created_at)}</Text>
                        <Text style={{ fontSize: 9, marginTop: 2, color: statusColor, fontWeight: 'bold' }}>
                            Status: {displayStatus}
                        </Text>
                    </View>
                </View>

                {/* Bill To / Ship To */}
                <View style={styles.invoiceMeta}>
                    <View style={styles.metaColumn}>
                        <Text style={styles.label}>Bill To / Ship To</Text>
                        <Text style={[styles.value, { fontWeight: 'bold' }]}>{order.shipping_address?.firstName} {order.shipping_address?.lastName}</Text>
                        <Text style={styles.value}>{order.shipping_address?.address}</Text>
                        <Text style={styles.value}>{order.shipping_address?.city}, {order.shipping_address?.state}</Text>
                        <Text style={styles.value}>{order.shipping_address?.pincode}</Text>
                        <Text style={styles.value}>Ph: {order.shipping_address?.phone}</Text>
                    </View>
                    <View style={[styles.metaColumn, { alignItems: 'flex-end' }]}>
                        <Text style={styles.label}>Invoice Details</Text>
                        <Text style={styles.value}>Order ID: {order.id}</Text>
                        <Text style={styles.value}>Place of Supply: {order.shipping_address?.state || 'Karnataka'}</Text>
                        <Text style={styles.value}>Payment Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</Text>
                        {/* If interstate showing IGST, else CGST/SGST implied */}
                        <Text style={[styles.value, { fontSize: 8, color: '#6b7280' }]}>{isInterState ? '(Inter-State Supply)' : '(Intra-State Supply)'}</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, { width: '25%' }]}>Description</Text>
                        <Text style={[styles.colHeader, { width: '8%', textAlign: 'center' }]}>Qty</Text>
                        <Text style={[styles.colHeader, { width: '12%', textAlign: 'right' }]}>Rate</Text>
                        <Text style={[styles.colHeader, { width: '12%', textAlign: 'right' }]}>Taxable Val</Text>

                        {!isInterState ? (
                            <>
                                <Text style={[styles.colHeader, { width: '11%', textAlign: 'right' }]}>CGST</Text>
                                <Text style={[styles.colHeader, { width: '11%', textAlign: 'right' }]}>SGST</Text>
                            </>
                        ) : (
                            <Text style={[styles.colHeader, { width: '22%', textAlign: 'right' }]}>IGST</Text>
                        )}

                        <Text style={[styles.colHeader, { width: '18%', textAlign: 'right' }]}>Total</Text>
                    </View>

                    {enrichedItems.map((item, index) => {
                        // Rate calc
                        const halfRate = item.taxPercent / 2;
                        const halfAmt = item.taxAmount / 2;

                        return (
                            <View key={index} style={styles.tableRow}>
                                <View style={{ width: '25%', paddingHorizontal: 4 }}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {item.size && <Text style={styles.productMeta}>Size: {item.size} </Text>}
                                        {item.metadata?.color && <Text style={styles.productMeta}>Color: {item.metadata.color} </Text>}
                                    </View>
                                </View>

                                <Text style={[styles.colText, { width: '8%', textAlign: 'center' }]}>{item.quantity}</Text>
                                <Text style={[styles.colText, { width: '12%', textAlign: 'right' }]}>{formatCurrency(item.price)}</Text>
                                <Text style={[styles.colText, { width: '12%', textAlign: 'right' }]}>{formatCurrency(item.taxableValue)}</Text>

                                {!isInterState ? (
                                    <>
                                        <View style={{ width: '11%', paddingHorizontal: 4, alignItems: 'flex-end' }}>
                                            <Text style={styles.colText}>{formatCurrency(halfAmt)}</Text>
                                            <Text style={{ fontSize: 6, color: '#6b7280' }}>@{halfRate}%</Text>
                                        </View>
                                        <View style={{ width: '11%', paddingHorizontal: 4, alignItems: 'flex-end' }}>
                                            <Text style={styles.colText}>{formatCurrency(halfAmt)}</Text>
                                            <Text style={{ fontSize: 6, color: '#6b7280' }}>@{halfRate}%</Text>
                                        </View>
                                    </>
                                ) : (
                                    <View style={{ width: '22%', paddingHorizontal: 4, alignItems: 'flex-end' }}>
                                        <Text style={styles.colText}>{formatCurrency(item.taxAmount)}</Text>
                                        <Text style={{ fontSize: 6, color: '#6b7280' }}>@{item.taxPercent}%</Text>
                                    </View>
                                )}

                                <Text style={[styles.colText, { width: '18%', textAlign: 'right', fontWeight: 'bold' }]}>
                                    {formatCurrency(item.totalLineAmount)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals Section */}
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Taxable Amount</Text>
                        <Text style={styles.totalValue}>{formatCurrency(runningSubtotal)}</Text>
                    </View>

                    {!isInterState ? (
                        <>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total CGST</Text>
                                <Text style={styles.totalValue}>{formatCurrency(runningTotalTax / 2)}</Text>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total SGST</Text>
                                <Text style={styles.totalValue}>{formatCurrency(runningTotalTax / 2)}</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total IGST</Text>
                            <Text style={styles.totalValue}>{formatCurrency(runningTotalTax)}</Text>
                        </View>
                    )}

                    {shippingCost > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Shipping</Text>
                            <Text style={styles.totalValue}>{formatCurrency(shippingCost)}</Text>
                        </View>
                    )}

                    {couponDiscount > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Coupon Discount</Text>
                            <Text style={styles.totalValue}>-{formatCurrency(couponDiscount)}</Text>
                        </View>
                    )}

                    {walletUsed > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Wallet Adjustment</Text>
                            <Text style={styles.totalValue}>-{formatCurrency(walletUsed)}</Text>
                        </View>
                    )}

                    <View style={[styles.totalRow, styles.grandTotal]}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>{formatCurrency(order.total_amount)}</Text>
                    </View>
                </View>

                {/* Note Area */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 8, fontStyle: 'italic', color: '#6b7280' }}>
                        Note: No returns or exchanges are accepted as per our policy.
                        This invoice shows a detailed breakdown of taxes applicable based on your shipping address.
                        For any discrepancies, please contact support.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Subject to Bangalore Jurisdiction. This is a computer generated invoice.</Text>

                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>For BRONCSTUDIO</Text>
                        <Image src={logoPath} style={{ width: 60, height: 'auto', opacity: 0.6, marginVertical: 4 }} />
                        <Text style={{ fontSize: 7, color: '#6b7280' }}>(Authorized Signatory)</Text>
                    </View>

                    <Text style={{ fontWeight: 'bold' }}>www.broncstudio.com</Text>
                    <Text style={{ marginTop: 2, fontSize: 6 }}>Regd: Bangalore, Karnataka. Contact: support@broncstudio.com</Text>
                </View>
            </Page>
        </Document>
    );
};
