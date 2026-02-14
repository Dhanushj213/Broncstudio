import { CATEGORY_TAXONOMY } from './categories';
import { TaxonomyCategory, TaxonomySubcategory, TaxonomyItem } from '@/types/shop';

export interface FlatNode {
    type: 'world' | 'category' | 'item' | 'curated';
    data: TaxonomyCategory | TaxonomySubcategory | TaxonomyItem | Record<string, unknown>;
    // Parent info for breadcrumbs
    parent?: { name: string; slug: string };
}

// Generate the flat map
const generateFlatTaxonomy = () => {
    const map: Record<string, FlatNode> = {};

    (Object.values(CATEGORY_TAXONOMY) as TaxonomyCategory[]).forEach((world) => {
        // 1. World Level
        map[world.slug] = { type: 'world', data: world };

        // 2. Category Level
        world.subcategories?.forEach((sub: TaxonomySubcategory) => {
            map[sub.slug] = {
                type: 'category',
                data: sub,
                parent: { name: world.name, slug: world.slug }
            };

            // 3. Item Level
            sub.items?.forEach((item: TaxonomyItem) => {
                map[item.slug] = {
                    type: 'item',
                    data: item,
                    parent: { name: sub.name, slug: sub.slug } // Deeper breadcrumb handled in component logic if needed, or we chain parents
                };
            });
        });
    });

    return map;
};

export const FLAT_TAXONOMY = generateFlatTaxonomy();
