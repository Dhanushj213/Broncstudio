import { createBrowserClient } from '@supabase/ssr';

export interface ProductAttribute {
    id: string;
    name: string;
    price: number;
    image: string;
    gender: 'men' | 'women' | 'kids' | 'unisex';
    product_type: 'tshirt' | 'hoodie' | 'jacket' | 'bottom' | 'dress' | 'footwear' | 'headwear' | 'bag' | 'accessory';
    primary_color: 'white' | 'black' | 'blue' | 'olive' | 'beige' | 'brown' | 'grey' | 'red' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange' | 'other';
    style: 'minimal' | 'graphic' | 'sporty' | 'classic' | 'streetwear';
    fit?: 'oversized' | 'regular' | 'slim' | 'skinny';
}

// --- CONFIGURATION MAPS ---

const OUTFIT_GRAPH: Record<string, string[]> = {
    tshirt: ['bottom', 'headwear', 'bag', 'footwear', 'accessory'],
    hoodie: ['bottom', 'bag', 'headwear', 'footwear'],
    jacket: ['tshirt', 'bottom', 'footwear'],
    bottom: ['tshirt', 'hoodie', 'jacket', 'footwear'],
    dress: ['bag', 'accessory', 'footwear'],
    footwear: ['accessory', 'bag'], // Usually footwear is the last add, but can suggest socks/laces/care
    headwear: ['tshirt', 'hoodie', 'jacket'],
    bag: ['tshirt', 'hoodie', 'dress'],
    accessory: ['tshirt', 'dress']
};

const COLOR_HARMONY: Record<string, string[]> = {
    white: ['black', 'blue', 'olive', 'beige', 'grey', 'red'],
    black: ['white', 'grey', 'blue', 'olive', 'red', 'beige'],
    blue: ['white', 'black', 'beige', 'grey'],
    olive: ['white', 'black', 'brown', 'beige'],
    beige: ['white', 'black', 'olive', 'brown', 'blue'],
    grey: ['white', 'black', 'blue', 'red'],
    brown: ['beige', 'olive', 'white'],
    red: ['white', 'black', 'grey', 'blue'],
    // Fallbacks
    green: ['white', 'black', 'beige'],
    yellow: ['black', 'white', 'blue'],
    pink: ['white', 'grey', 'blue'],
    purple: ['white', 'black', 'grey'],
    orange: ['white', 'black', 'blue'],
    other: ['black', 'white']
};

const STYLE_COMPATIBILITY: Record<string, string[]> = {
    minimal: ['minimal', 'classic', 'streetwear'],
    graphic: ['solid', 'minimal', 'streetwear'],
    sporty: ['sporty', 'casual', 'streetwear'],
    classic: ['minimal', 'classic', 'premium'],
    streetwear: ['minimal', 'graphic', 'sporty', 'oversized']
};

// --- SCORING SYSTEM ---

const SCORE_WEIGHTS = {
    GENDER_MATCH: 100, // Hard filter really
    TYPE_MATCH: 50,    // Essential
    COLOR_MATCH: 30,
    STYLE_MATCH: 20
};

export async function getRecommendations(currentProduct: any) {
    if (!currentProduct || !currentProduct.metadata) return [];

    const meta = currentProduct.metadata;
    const current: ProductAttribute = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.images?.[0] || '',
        gender: meta.gender || 'unisex',
        product_type: meta.product_type || 'other',
        primary_color: meta.primary_color || 'other',
        style: meta.style || 'minimal',
        fit: meta.fit || 'regular'
    };

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. HARD FILTER: Gender & Exclude Self
    let query = supabase
        .from('products')
        .select('*')
        .neq('id', current.id);

    // Gender Logic: If Men -> Men/Unisex. If Women -> Women/Unisex.
    if (current.gender !== 'unisex') {
        // This is a bit complex in pure SQL with JSONB, verifying capabilities.
        // For MVP, fetch broader set and filter in JS if JSONB filtering is tricky without exact indexes.
        // Ideally: .or(`metadata->>gender.eq.${current.gender},metadata->>gender.eq.unisex`)
        // Let's filter in memory for max flexibility unless dataset is huge.
    }

    const { data: candidates, error } = await query;
    if (error || !candidates) {
        console.error('RecEngine Error:', error);
        return [];
    }

    // 2. SCORING LOOP
    const scoredCandidates = candidates.map(candidate => {
        const cMeta = candidate.metadata || {};
        const candidateAttr: ProductAttribute = {
            id: candidate.id,
            name: candidate.name,
            price: candidate.price,
            image: candidate.images?.[0] || '',
            gender: cMeta.gender || 'unisex',
            product_type: cMeta.product_type || 'other',
            primary_color: cMeta.primary_color || 'other',
            style: cMeta.style || 'minimal',
            fit: cMeta.fit || 'regular'
        };

        let score = 0;

        // RULE 1: GENDER LOCK (Hard Fail)
        if (candidateAttr.gender !== 'unisex' && candidateAttr.gender !== current.gender) {
            return { ...candidate, score: -1 };
        }

        // RULE 2: PRODUCT TYPE (Outfit Graph)
        const allowedTypes = OUTFIT_GRAPH[current.product_type] || [];
        if (allowedTypes.includes(candidateAttr.product_type)) {
            score += SCORE_WEIGHTS.TYPE_MATCH;
        } else {
            // If strictly enforcing outfit structure, maybe penalize or hard fail?
            // User said "Works per product page" -> "Maps top -> bottom".
            // Let's penalize significantly but not hide if inventory is low.
            score -= 10;
        }

        // RULE 3: COLOR HARMONY
        const compatibleColors = COLOR_HARMONY[current.primary_color] || [];
        if (compatibleColors.includes(candidateAttr.primary_color)) {
            score += SCORE_WEIGHTS.COLOR_MATCH;
        }

        // RULE 4: STYLE MATCH
        const compatibleStyles = STYLE_COMPATIBILITY[current.style] || [];
        if (compatibleStyles.includes(candidateAttr.style) || candidateAttr.style === current.style) {
            score += SCORE_WEIGHTS.STYLE_MATCH;
        }

        return { ...candidate, score, image: candidateAttr.image }; // Attach main image for UI
    });

    // 3. SORT & FILTER
    // Filter out bad matches (score <= 0) and sort descending
    // Limit to 3 distinct types if possible (Top, Bottom, Access) - advanced logic

    let recommendations = scoredCandidates
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score);

    // Deduplicate Types (Optional: Ensure variety)
    const uniqueTypes = new Set();
    const diverseRecommendations = [];

    for (const rec of recommendations) {
        const type = rec.metadata?.product_type || 'other';
        if (!uniqueTypes.has(type)) {
            uniqueTypes.add(type);
            diverseRecommendations.push(rec);
        }
        if (diverseRecommendations.length >= 3) break;
    }

    // Fallback: If not enough diverse types, just fill with top scores
    if (diverseRecommendations.length < 3) {
        const remaining = recommendations
            .filter(r => !diverseRecommendations.find(d => d.id === r.id))
            .slice(0, 3 - diverseRecommendations.length);
        diverseRecommendations.push(...remaining);
    }

    return diverseRecommendations;
}
