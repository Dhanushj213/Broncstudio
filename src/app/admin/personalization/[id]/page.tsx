'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
}

export default function EditPersonalizedProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        images: [] as string[],

        // Metadata
        is_pet: false,
        gender: 'unisex',
        gender_visibility: [] as string[],
        product_type: '',
        tags: '',

        // Personalization (Key for this page)
        personalization: {
            enabled: true,
            colors: [] as string[],
            sizes: [] as string[],
            placements: [] as string[],
            print_type: 'DTG',
            print_price: 199,
            image_requirements: {
                min_dpi: 300,
                max_size_mb: 20
            }
        }
    });

    const [imageInput, setImageInput] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        Promise.all([fetchProduct(), fetchCategories()]);
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    };

    const fetchProduct = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error:', error);
            alert('Product not found');
            router.push('/admin/personalization');
            return;
        }

        const meta = data.metadata || {};

        setFormData({
            name: data.name,
            description: data.description || '',
            price: data.price.toString(),
            category_id: data.category_id,
            images: data.images || [],
            tags: data.tags?.join(', ') || '',

            is_pet: meta.is_pet || false,
            gender: meta.gender || 'unisex',
            gender_visibility: meta.gender_visibility || ['unisex'],
            product_type: meta.product_type || '',

            personalization: meta.personalization || {
                enabled: true,
                placements: [],
                print_type: 'DTG',
                print_price: 199
            }
        });
        setLoading(false);
    };

    const handleAddImage = () => {
        if (!imageInput.trim()) return;
        setFormData({
            ...formData,
            images: [...formData.images, imageInput.trim()]
        });
        setImageInput('');
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('products')
            .update({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                images: formData.images,

                metadata: {
                    is_pet: formData.is_pet,
                    gender: formData.gender,
                    gender_visibility: formData.gender_visibility,
                    product_type: formData.product_type,
                    personalization: formData.personalization
                }
            })
            .eq('id', id);

        if (error) {
            console.error('Update error:', error);
            alert('Failed to update product');
        } else {
            router.push('/admin/personalization');
            router.refresh();
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-6">
                <Link href="/admin/personalization" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4">
                    <ArrowLeft size={18} /> Back to Personalization
                </Link>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-navy-900">Edit Personalization Base</h1>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {id.slice(0, 8)}...</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">General Information</h2>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Personalization Configuration (Always Visible here) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-900">Personalization Configuration 🎨</h2>
                        <div className="bg-purple-100 px-3 py-1 rounded-full text-xs font-bold text-purple-700">
                            Active
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Print Type</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        value={formData.personalization.print_type}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            personalization: { ...formData.personalization, print_type: e.target.value }
                                        })}
                                    >
                                        <option value="DTG">DTG Printing</option>
                                        <option value="Embroidery">Embroidery</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Print Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                        value={formData.personalization.print_price}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            personalization: { ...formData.personalization, print_price: Number(e.target.value) }
                                        })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Allowed Placements</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve'].map(placement => (
                                        <label key={placement} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.personalization.placements?.includes(placement)}
                                                onChange={(e) => {
                                                    const current = formData.personalization.placements || [];
                                                    const updated = e.target.checked
                                                        ? [...current, placement]
                                                        : current.filter(p => p !== placement);
                                                    setFormData({
                                                        ...formData,
                                                        personalization: { ...formData.personalization, placements: updated }
                                                    });
                                                }}
                                                className="rounded border-gray-300 text-navy-900"
                                            />
                                            <span className="text-sm">{placement}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link href="/admin/personalization">
                        <button type="button" className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-3 px-8 rounded-xl flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
}
