export interface TaxonomyItem {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

export interface TaxonomySubcategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    items?: TaxonomyItem[];
}

export interface TaxonomyCategory {
    id: string;
    name: string;
    slug: string;
    legacy_slug?: string;
    db_slug?: string;
    description: string;
    image: string;
    image_url?: string;
    subcategories?: TaxonomySubcategory[];
}

export interface DBProduct {
    id: string;
    name: string;
    brand?: string;
    price: number;
    compare_at_price?: number;
    images?: string[];
    image_url?: string;
    stock_status?: string;
    created_at: string;
    category_id: string;
    metadata?: {
        colors?: string[];
        sizes?: string[];
        curated_section_ids?: string[];
        [key: string]: unknown;
    };
}

export interface ShopProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    secondaryImage?: string;
    badge?: string;
}

export interface ShopCardData {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
}

export interface ShopView {
    type: 'root' | 'category' | 'subcategory' | 'item' | '404';
    data: TaxonomyCategory | TaxonomySubcategory | TaxonomyItem | Record<string, unknown> | null;
    children: ShopCardData[];
    breadcrumbs: { label: string; href: string }[];
    heroImage?: string;
}
