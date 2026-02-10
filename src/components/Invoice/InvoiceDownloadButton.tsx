
'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF, Order } from './InvoicePDF';
import { FileText, Loader2 } from 'lucide-react';

interface InvoiceDownloadButtonProps {
    order: Order;
    variant?: 'primary' | 'outline' | 'ghost'; // For different UI contexts
}

export default function InvoiceDownloadButton({ order, variant = 'outline' }: InvoiceDownloadButtonProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Avoid SSR issues with react-pdf
    }

    const buttonClasses = {
        primary: "flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-navy-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-colors",
        outline: "flex items-center gap-2 border border-subtle text-primary px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
        ghost: "flex items-center gap-2 text-coral-500 hover:text-coral-600 text-sm font-bold"
    };

    return (
        <PDFDownloadLink
            document={<InvoicePDF order={order} logoPath={window.location.origin + '/blacklogo.png'} />}
            fileName={`invoice_${order.id.slice(0, 8)}.pdf`}
            className="inline-block"
        >
            {({ blob, url, loading, error }) => (
                <button className={buttonClasses[variant]} disabled={loading}>
                    {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <FileText size={16} />
                    )}
                    {loading ? 'Generating...' : 'Invoice'}
                    {error && <span className="text-red-500 text-xs ml-2">Error: {error.toString()}</span>}
                </button>
            )}
        </PDFDownloadLink>
    );
}
