'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Eye, FileText, Filter, MoreHorizontal, Printer, X } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    shipping_address: any;
    user_id: string;
    items?: any[];
}

interface OrderTableProps {
    orders: Order[];
    loading: boolean;
    onStatusChange?: (orderId: string, newStatus: string) => Promise<void>;
}

type SortField = 'created_at' | 'total_amount' | 'status';
type SortOrder = 'asc' | 'desc';

export default function OrderTable({ orders, loading, onStatusChange }: OrderTableProps) {
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Filters State
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Sorting Handler
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc'); // Default to desc for new field
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            order.id.toLowerCase().includes(searchLower) ||
            order.shipping_address?.firstName?.toLowerCase().includes(searchLower) ||
            order.shipping_address?.email?.toLowerCase().includes(searchLower);

        return matchesStatus && matchesPayment && matchesSearch;
    });

    // Sort Logic
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'total_amount') {
            valA = Number(valA);
            valB = Number(valB);
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-amber-100 text-amber-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search Order ID, Name..."
                            className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {/* Status Filter */}
                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Payment Filter */}
                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="all">All Payment</option>
                        <option value="pending">Unpaid</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                                <div className="flex items-center gap-1">
                                    Date
                                    {sortField === 'created_at' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                                </div>
                            </th>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_amount')}>
                                <div className="flex items-center gap-1">
                                    Total
                                    {sortField === 'total_amount' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                                </div>
                            </th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                                <div className="flex items-center gap-1">
                                    Status
                                    {sortField === 'status' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center">Loading orders...</td></tr>
                        ) : sortedOrders.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No orders found matching filters.</td></tr>
                        ) : (
                            sortedOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                                        <div className="text-xs text-gray-400">{format(new Date(order.created_at), 'HH:mm')}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        <Link href={`/admin/orders/${order.id}`} className="hover:text-blue-600 hover:underline">
                                            #{order.id.slice(0, 8)}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="font-medium text-gray-900">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</div>
                                        {/* <div className="text-xs">{order.shipping_address?.city}</div> */}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold uppercase text-gray-500">{order.payment_method}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded w-fit ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg hover:text-navy-900 transition-colors" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                            {/* Future: Print/Invoice Actions */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple for now) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing {sortedOrders.length} orders</span>
                {/* Pagination controls can go here */}
            </div>
        </div>
    );
}
