
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Fonts (Optional - using standard Helvetica for now to ensure compatibility)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1a1a1a',
        lineHeight: 1.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        borderBottomStyle: 'solid',
        paddingBottom: 20,
    },
    companyDetails: {
        textAlign: 'right',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#111827',
        letterSpacing: 1,
    },
    subTitle: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 4,
    },
    invoiceMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
    },
    metaColumn: {
        flexDirection: 'column',
        width: '48%',
    },
    label: {
        fontSize: 8,
        textTransform: 'uppercase',
        color: '#6b7280',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
        color: '#111827',
        marginBottom: 12,
    },
    table: {
        width: '100%',
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        backgroundColor: '#f9fafb',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        borderBottomStyle: 'solid',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    col1: { width: '45%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },

    productName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
    },
    productMeta: {
        fontSize: 9,
        color: '#6b7280',
        marginTop: 2,
    },
    // Flex row for size/color replacing gap
    metaRow: {
        flexDirection: 'row',
        marginTop: 2,
    },
    metaItem: {
        marginRight: 8,
    },
    customDetail: {
        fontSize: 8,
        color: '#4b5563',
        marginTop: 2,
        paddingLeft: 4,
        borderLeftWidth: 1,
        borderLeftColor: '#d1d5db',
        borderLeftStyle: 'solid',
    },
    totals: {
        marginTop: 30,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8,
        width: '50%',
    },
    totalLabel: {
        fontSize: 10,
        color: '#4b5563',
        marginRight: 20,
        textAlign: 'right',
        flex: 1,
    },
    totalValue: {
        fontSize: 10,
        color: '#111827',
        fontWeight: 'bold',
        width: 80,
        textAlign: 'right',
    },
    grandTotal: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderTopStyle: 'solid',
        paddingTop: 12,
        marginTop: 4,
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        marginRight: 20,
        flex: 1,
        textAlign: 'right',
    },
    grandTotalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        width: 80,
        textAlign: 'right',
    },
    footer: {
        marginTop: 50,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        borderTopStyle: 'solid',
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
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
}

interface InvoicePDFProps {
    order: Order;
    logoPath?: string; // Optional logo path override
}

// Helper to format currency
const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

// Helper to format date in Indian format
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-IN', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ order, logoPath = '/blacklogo.png' }) => {

    // Recalculate Totals based on logic described in prompts
    const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    // Tax Calculation Logic (Replicated from Checkout)
    let totalTax = 0;
    order.items?.forEach(item => {
        const itemQty = item.quantity;
        if (item.metadata?.is_custom) {
            const basePrice = item.metadata.base_price_unit || 0;
            const customCost = item.metadata.customization_cost_unit || 0;
            const productGst = item.metadata.gst_percent || 12;
            const printGst = item.metadata.print_gst_percent || 18;

            const baseTax = (basePrice * itemQty * productGst) / 100;
            const customTax = (customCost * itemQty * printGst) / 100;
            totalTax += (baseTax + customTax);
        } else {
            const gst = item.metadata?.gst_percent || 18; // Default to 18 if not found
            const itemTax = (item.price * itemQty * gst) / 100;
            totalTax += itemTax;
        }
    });

    // Calculate estimated shipping
    const estimatedShipping = Math.max(0, order.total_amount - subtotal - Math.round(totalTax));

    // Safety check: ensure no negative values
    const finalShipping = estimatedShipping > 0 ? estimatedShipping : 0;

    // Split GST into CGST and SGST (assuming intrastate - Karnataka to Karnataka)
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Image
                            src={logoPath}
                            style={{ width: 150, height: 'auto', marginBottom: 10 }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>BRONCSTUDIO</Text>
                        <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>Bangalore, India</Text>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>support@broncstudio.com</Text>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>GSTIN: 29AAAAA0000A1Z5</Text>
                    </View>
                    <View style={styles.companyDetails}>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={[styles.subTitle, { fontSize: 11, fontWeight: 'bold', color: '#374151' }]}>Tax Invoice</Text>
                        <Text style={styles.subTitle}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                    </View>
                </View>

                {/* Bill To & Ship To */}
                <View style={styles.invoiceMeta}>
                    <View style={styles.metaColumn}>
                        <Text style={styles.label}>Billed To</Text>
                        <Text style={styles.value}>{order.shipping_address?.firstName} {order.shipping_address?.lastName}</Text>
                        <Text style={styles.value}>{order.shipping_address?.address}</Text>
                        <Text style={styles.value}>{order.shipping_address?.city} - {order.shipping_address?.pincode}</Text>
                        <Text style={styles.value}>Phone: {order.shipping_address?.phone}</Text>
                    </View>
                    <View style={styles.metaColumn}>
                        <Text style={styles.label}>Invoice Details</Text>
                        <Text style={styles.value}>Invoice Date: {formatDate(order.created_at)}</Text>
                        <Text style={styles.value}>Order ID: #{order.id.slice(0, 8)}</Text>
                        <Text style={styles.value}>Place of Supply: Karnataka (29)</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.productName, styles.col1]}>ITEM DESCRIPTION</Text>
                        <Text style={[styles.productName, styles.col2]}>QTY</Text>
                        <Text style={[styles.productName, styles.col3]}>UNIT PRICE</Text>
                        <Text style={[styles.productName, styles.col4]}>TOTAL</Text>
                    </View>

                    {order.items?.map((item, index) => {
                        const meta = item.metadata || {};
                        const isCustom = meta.is_custom;

                        return (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.col1}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={styles.metaRow}>
                                        {item.size && <Text style={[styles.productMeta, styles.metaItem]}>Size: {item.size}</Text>}
                                        {meta.color && <Text style={styles.productMeta}>Color: {meta.color}</Text>}
                                    </View>

                                    {/* Customization Details */}
                                    {isCustom && meta.placements && (
                                        <View style={{ marginTop: 4 }}>
                                            {Object.entries(meta.placements).map(([key, val]: any) => (
                                                <Text key={key} style={styles.customDetail}>
                                                    • {key}: {val.print_type?.name || 'Custom Print'}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <Text style={[styles.value, styles.col2]}>{item.quantity}</Text>
                                <Text style={[styles.value, styles.col3]}>{formatCurrency(item.price)}</Text>
                                <Text style={[styles.value, styles.col4]}>{formatCurrency(item.price * item.quantity)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>CGST @9%</Text>
                        <Text style={styles.totalValue}>{formatCurrency(cgst)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>SGST @9%</Text>
                        <Text style={styles.totalValue}>{formatCurrency(sgst)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Shipping</Text>
                        <Text style={styles.totalValue}>{estimatedShipping > 0 ? formatCurrency(estimatedShipping) : 'Free'}</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotal]}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>{formatCurrency(order.total_amount)}</Text>
                    </View>
                </View>

                {/* Payment Info */}
                <View style={{ marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#e5e7eb', borderTopStyle: 'solid' }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 8 }}>Payment Details</Text>
                    <Text style={{ fontSize: 9, color: '#4b5563' }}>
                        Payment Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                    </Text>
                    <Text style={{ fontSize: 9, color: '#4b5563', marginTop: 2 }}>
                        Payment Status: {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </Text>
                    {order.payment_method !== 'cod' && order.payment_status === 'paid' && (
                        <Text style={{ fontSize: 9, color: '#4b5563', marginTop: 2 }}>
                            Payment Gateway: Online
                        </Text>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Note:</Text>
                    <Text style={{ marginBottom: 8 }}>All sales are final. No returns or exchanges are applicable.</Text>
                    <Text style={{ marginTop: 4 }}>Thank you for shopping with Broncstudio!</Text>
                    <Text>This is a computer-generated invoice and does not require a signature.</Text>
                    <Text style={{ marginTop: 8, fontSize: 9, color: '#6b7280' }}>www.broncstudio.com</Text>
                </View>
            </Page>
        </Document>
    );
};
