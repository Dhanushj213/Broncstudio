'use client';

import React, { useEffect, useState } from 'react';
import { getCategoryTree, createCategory, updateCategory, deleteCategory } from '@/actions/categoryActions';
import { Plus, Edit, Trash2, FolderTree, ChevronRight, ChevronDown, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    children?: Category[];
}

export default function AdminCategoriesPage() {
    const [tree, setTree] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNode, setEditingNode] = useState<Category | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [parentIdForCreate, setParentIdForCreate] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getCategoryTree();
            setTree(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure? This will delete all subcategories and items under it.')) {
            const res = await deleteCategory(id);
            if (res.success) loadData();
            else alert(res.error);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">Categories</h1>
                    <p className="text-gray-500">Manage your product taxonomy hierarchy.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingNode(null);
                        setParentIdForCreate(null);
                        setIsCreating(true);
                    }}
                    className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-coral-500 transition-colors"
                >
                    <Plus size={18} /> New Root Category
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tree View */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                    {loading ? (
                        <p>Loading tree...</p>
                    ) : (
                        <div className="space-y-2">
                            {tree.map(node => (
                                <CategoryNode
                                    key={node.id}
                                    node={node}
                                    onEdit={(n: Category) => { setIsCreating(false); setEditingNode(n); }}
                                    onAddChild={(pid: string) => { setEditingNode(null); setParentIdForCreate(pid); setIsCreating(true); }}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Editor Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-8">
                    <h2 className="text-xl font-bold mb-4">
                        {isCreating ? 'Create Category' : editingNode ? 'Edit Category' : 'Select a Category'}
                    </h2>

                    {(isCreating || editingNode) ? (
                        <CategoryForm
                            initialData={isCreating ? { parent_id: parentIdForCreate } : editingNode}
                            isCreating={isCreating}
                            onCancel={() => { setIsCreating(false); setEditingNode(null); }}
                            onSuccess={() => { setIsCreating(false); setEditingNode(null); loadData(); }}
                        />
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <FolderTree size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Select a category to edit or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Recursive Node Component
function CategoryNode({ node, level = 0, onEdit, onAddChild, onDelete }: any) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="select-none">
            <div
                className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group transition-colors ${level === 0 ? 'bg-gray-50/50 mb-1' : ''}`}
                style={{ marginLeft: level * 20 }}
            >
                <div className="flex items-center gap-2 flex-1">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`p-1 rounded hover:bg-gray-200 text-gray-400 ${!hasChildren && 'invisible'}`}
                    >
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <span className={`font-medium ${level === 0 ? 'text-navy-900 text-base' : 'text-gray-700 text-sm'}`}>
                        {node.name}
                    </span>
                    <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{node.slug}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {level < 2 && ( // Limit depth to 3 levels (0, 1, 2)
                        <button onClick={() => onAddChild(node.id)} title="Add Subcategory" className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                            <Plus size={14} />
                        </button>
                    )}
                    <button onClick={() => onEdit(node)} title="Edit" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={14} />
                    </button>
                    <button onClick={() => onDelete(node.id)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {hasChildren && expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child: any) => (
                            <CategoryNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onEdit={onEdit}
                                onAddChild={onAddChild}
                                onDelete={onDelete}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Form Component
function CategoryForm({ initialData, isCreating, onCancel, onSuccess }: any) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        parent_id: null,
        ...initialData
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
            name: '',
            slug: '',
            description: '',
            image_url: '',
            parent_id: null,
            ...initialData
        });
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({
            ...prev,
            [name]: value,
            // Auto-generate slug from name if creating and slug is empty
            slug: (name === 'name' && isCreating && !prev.slug)
                ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                : (name === 'slug' ? value : prev.slug)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: form.name,
            slug: form.slug,
            description: form.description,
            image_url: form.image_url,
            parent_id: form.parent_id
        };

        let res;
        if (isCreating) {
            res = await createCategory(payload);
        } else {
            res = await updateCategory(initialData.id, payload);
        }

        setLoading(false);
        if (res.success) onSuccess();
        else alert(res.error);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy-900 outline-none"
                    placeholder="e.g. Mens Wear"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Slug (URL)</label>
                <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy-900 outline-none font-mono bg-gray-50"
                    placeholder="e.g. mens-wear"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy-900 outline-none"
                    rows={3}
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
                <input
                    name="image_url"
                    value={form.image_url || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy-900 outline-none"
                    placeholder="https://..."
                />
            </div>

            <div className="flex gap-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-bold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-coral-500 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                    {loading ? 'Saving...' : <><Save size={16} /> Save</>}
                </button>
            </div>
        </form>
    );
}
