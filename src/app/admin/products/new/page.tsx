'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    parent_id?: string | null;
}

export default function NewProductPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    // UI Helper for Taxonomy
    const [selectedParentId, setSelectedParentId] = useState('');

    const [imageInput, setImageInput] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_at_price: '',
        category_id: '',
        images: [] as string[],
        is_featured: false,
        gst_percent: '18', // Default
        tags: '',

        // Dynamic Fields
        stock_status: 'in_stock',
        colors: [] as { name: string; code: string }[],
        sizes: '',
        highlights: '',
        material_care: '',
        shipping_returns: '',
        size_guide: '',

        // Recommendation Engine Meta
        is_pet: false,
        gender: 'unisex',
        gender_visibility: [] as string[],
        product_type: '',
        fit: 'regular',
        style: 'minimal',
        primary_color: ''
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name, parent_id');
        if (data) setAllCategories(data);
    };

    const handleAddColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: 'New Color', code: '#000000' }]
        });
    };

    const handleColorChange = (index: number, field: 'name' | 'code', value: string) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData({ ...formData, colors: newColors });
    };

    const handleRemoveColor = (index: number) => {
        const newColors = [...formData.colors];
        newColors.splice(index, 1);
        setFormData({ ...formData, colors: newColors });
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
        setLoading(true);

        // Validation
        if (!formData.name || !formData.price || !formData.category_id) {
            alert('Please fill in all required fields');
            setLoading(false);
            return;
        }

        const metadata = {
            is_featured: formData.is_featured,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            // Save Dynamic Fields
            gst_percent: parseFloat(formData.gst_percent),
            stock_status: formData.stock_status,
            colors: formData.colors,
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            highlights: formData.highlights.split('\n').filter(Boolean),
            material_care: formData.material_care,
            shipping_returns: formData.shipping_returns,
            size_guide: formData.size_guide,

            // Save Engine Meta
            is_pet: formData.is_pet,
            gender: formData.is_pet ? 'unisex' : formData.gender, // Keep legacy gender for safety
            gender_visibility: formData.gender_visibility, // New visibility array
            product_type: formData.is_pet ? (formData.product_type || 'pet_accessory') : formData.product_type,
            fit: formData.is_pet ? 'regular' : formData.fit,
            style: formData.is_pet ? 'recreational' : formData.style,
            primary_color: formData.primary_color
        };

        // Generate Slug
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const { error } = await supabase
            .from('products')
            .insert({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                category_id: formData.category_id,
                images: formData.images,
                slug: slug,
                metadata: metadata
            });

        if (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product: ' + error.message);
        } else {
            router.push('/admin/products');
            router.refresh();
        }
        setLoading(false);
    };

    const styles = {
        toggleWrapper: "relative inline-flex items-center cursor-pointer",
        toggleInput: "sr-only peer",
        toggleSlider: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900"
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/admin/products" className="text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1 mb-4">
                        <ArrowLeft size={18} /> Back to Products
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-900">General Information</h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                            />
                            <span className="text-sm font-bold text-gray-900">Featured Product</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="e.g. Vintage Leather Jacket"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="Product description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Variants (Colors & Sizes) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Variants</h2>

                    {/* Colors */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-gray-700">Colors</label>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="text-xs bg-navy-50 text-navy-900 px-3 py-1 rounded-full font-bold hover:bg-navy-100"
                            >
                                + Add Color
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.colors.map((color, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                                        value={color.code}
                                        onChange={(e) => handleColorChange(idx, 'code', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm"
                                        placeholder="Color Name (e.g. Navy Blue)"
                                        value={color.name}
                                        onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveColor(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {formData.colors.length === 0 && <p className="text-sm text-gray-400 italic">No colors added.</p>}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Sizes (Comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="e.g. S, M, L, XL or 2-3Y, 3-4Y"
                            value={formData.sizes}
                            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Product Details</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Highlights (One per line)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors font-mono text-sm"
                            placeholder="100% Cotton&#10;Breathable&#10;Machine Wash"
                            value={formData.highlights}
                            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Material & Care</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="Details about material and care instructions..."
                            value={formData.material_care}
                            onChange={(e) => setFormData({ ...formData, material_care: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Shipping & Returns</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                            placeholder="Shipping policy details..."
                            value={formData.shipping_returns}
                            onChange={(e) => setFormData({ ...formData, shipping_returns: e.target.value })}
                        />
                    </div>
                </div>

                {/* Pricing & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Pricing & Organization</h2>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Compare at Price (₹)</label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="0.00"
                                value={formData.compare_at_price}
                                onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                            />
                            <p className="text-xs text-green-600 mt-1">
                                Tip: Set this higher than Price to show as "On Sale".
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">GST Rate (%)</label>
                            <select
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                value={formData.gst_percent}
                                onChange={(e) => setFormData({ ...formData, gst_percent: e.target.value })}
                            >
                                <option value="0">0% (Exempt)</option>
                                <option value="3">3%</option>
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                                <option value="28">28%</option>
                            </select>
                        </div>

                        {/* Category Selection Logic */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Department (Parent)</label>
                            <select
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                value={selectedParentId}
                                onChange={(e) => {
                                    setSelectedParentId(e.target.value);
                                    setFormData({ ...formData, category_id: '' }); // Reset Subcat
                                }}
                            >
                                <option value="">Select Department</option>
                                {allCategories.filter(c => !c.parent_id).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Subcategory *</label>
                            <select
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                disabled={!selectedParentId}
                                required
                            >
                                <option value="">Select Subcategory</option>
                                {allCategories.filter(c => c.parent_id === selectedParentId).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Status Field */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Availability</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                value={formData.stock_status}
                                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Only Few Left (Low Stock)</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Classification & Engine Metadata */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h2 className="text-lg font-bold text-gray-900">Engine Classification</h2>
                            <label className="flex items-center gap-2 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.is_pet as boolean}
                                    onChange={(e) => setFormData({ ...formData, is_pet: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                                />
                                <span className="text-sm font-bold text-gray-900">It's a Pet Product 🐾</span>
                            </label>
                        </div>

                        {!formData.is_pet && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                {/* Gender Visibility (Unisex Logic) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender Visibility</label>
                                    <div className="flex gap-4 flex-wrap">
                                        {['men', 'women', 'unisex', 'kids'].map(g => (
                                            <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.gender_visibility?.includes(g)}
                                                    onChange={(e) => {
                                                        const current = formData.gender_visibility || [];
                                                        const updated = e.target.checked
                                                            ? [...current, g]
                                                            : current.filter(x => x !== g);
                                                        setFormData({ ...formData, gender_visibility: updated });
                                                    }}
                                                    className="rounded border-gray-300 text-gray-900"
                                                />
                                                <span className="capitalize">{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Select all categories where this product should appear.</p>
                                </div>

                                {/* Product Type */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Type</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                        value={formData.product_type}
                                        onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="tshirt">T-Shirt / Top</option>
                                        <option value="hoodie">Hoodie / Sweatshirt</option>
                                        <option value="jacket">Jacket / Outerwear</option>
                                        <option value="bottom">Bottom / Pants / Shorts</option>
                                        <option value="dress">Dress</option>
                                        <option value="footwear">Footwear</option>
                                        <option value="headwear">Headwear / Cap</option>
                                        <option value="bag">Bag</option>
                                        <option value="accessory">Accessory</option>
                                    </select>
                                </div>

                                {/* Fit */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Fit</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                        value={formData.fit}
                                        onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="oversized">Oversized</option>
                                        <option value="slim">Slim</option>
                                        <option value="skinny">Skinny</option>
                                        <option value="relaxed">Relaxed</option>
                                    </select>
                                </div>

                                {/* Style */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Style Vibe</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                        value={formData.style}
                                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                    >
                                        <option value="minimal">Minimal</option>
                                        <option value="graphic">Graphic / Bold</option>
                                        <option value="sporty">Sporty</option>
                                        <option value="classic">Classic</option>
                                        <option value="streetwear">Streetwear</option>
                                    </select>
                                </div>

                                {/* Primary Color */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Primary Color (for Matching)</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors bg-white"
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                    >
                                        <option value="">Select Color</option>
                                        <option value="white">White</option>
                                        <option value="black">Black</option>
                                        <option value="blue">Blue</option>
                                        <option value="olive">Olive / Green</option>
                                        <option value="beige">Beige / Cream</option>
                                        <option value="grey">Grey</option>
                                        <option value="red">Red</option>
                                        <option value="brown">Brown</option>
                                        <option value="yellow">Yellow</option>
                                        <option value="pink">Pink</option>
                                        <option value="purple">Purple</option>
                                        <option value="orange">Orange</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {formData.is_pet && (
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-center text-sm text-navy-800">
                                🐾 You are creating a Pet Product. Standard sizing and gender rules are relaxed.
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Media & Tags</h2>
                        {/* Image Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Add Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                    placeholder="https://..."
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddImage();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-4 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Image Grid */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <Image
                                            src={img}
                                            alt={`Image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">MAIN</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                                placeholder="e.g. new-arrival, summer, curated"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>

                </div>
                <div className="flex items-center justify-end gap-4 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md p-4 border-t border-gray-100 -mx-4 md:mx-0">
                    <Link href="/admin/products">
                        <button type="button" className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Product
                    </button>
                </div>
            </form >
        </div >
    );
}
