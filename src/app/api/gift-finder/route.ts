import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getMomentById } from '@/data/giftMoments';

interface GiftFinderRequest {
    moment: string;
    audience?: string;
    budget?: number;
}

interface ProductWithScore {
    product: any;
    score: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: GiftFinderRequest = await request.json();
        const { moment, audience, budget } = body;

        if (!moment) {
            return NextResponse.json({ error: 'Moment is required' }, { status: 400 });
        }

        const momentConfig = getMomentById(moment);
        if (!momentConfig) {
            return NextResponse.json({ error: 'Invalid moment' }, { status: 400 });
        }

        const supabase = await createClient();

        // Base query - fetch giftable products
        let query = supabase
            .from('products')
            .select('*')
            .contains('metadata', { is_giftable: true });

        // Budget filter (hard constraint)
        if (budget) {
            if (budget === 499) {
                query = query.lte('price', 499);
            } else if (budget === 999) {
                query = query.gt('price', 499).lte('price', 999);
            } else if (budget === 10000) {
                query = query.gt('price', 999);
            }
        }

        const { data: products, error } = await query.limit(100);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (!products || products.length === 0) {
            return NextResponse.json({ products: [], message: 'No products found' });
        }

        // Filter by audience (if provided)
        let filtered = products;
        if (audience) {
            filtered = products.filter((p: any) => {
                const productAudience = p.metadata?.audience || [];
                return productAudience.includes(audience) || productAudience.includes('unisex');
            });
        }

        // Filter by moment (gift_moments or gift_types)
        filtered = filtered.filter((p: any) => {
            const productMoments = p.metadata?.gift_moments || [];
            const productGiftTypes = p.metadata?.gift_types || [];

            // Check if product explicitly matches moment
            if (productMoments.includes(moment)) return true;

            // Check if product gift types overlap with moment's preferred types
            const hasMatchingType = momentConfig.giftTypes.some(type =>
                productGiftTypes.includes(type)
            );

            return hasMatchingType;
        });

        // Score products
        const scored: ProductWithScore[] = filtered.map((product: any) => {
            let score = 0;

            // Category match bonus
            const productCategories = product.metadata?.categories || [];
            const categoryMatch = momentConfig.preferredCategories.length === 0 ||
                momentConfig.preferredCategories.some(cat => productCategories.includes(cat));
            if (categoryMatch) score += 30;

            // Price efficiency bonus (if budget provided)
            if (budget && product.price < budget * 0.8) {
                score += 20;
            }

            // Gift type match bonus
            const productGiftTypes = product.metadata?.gift_types || [];
            if (productGiftTypes.includes('impulse')) score += 15;
            if (productGiftTypes.includes('quick')) score += 10;

            // Popularity/Featured bonus
            if (product.metadata?.is_featured) score += 10;
            if (product.metadata?.is_new_arrival) score += 5;

            return { product, score };
        });

        // Sort by score and take top 8
        scored.sort((a, b) => b.score - a.score);
        const topProducts = scored.slice(0, 8).map(s => s.product);

        // Fallback: If less than 4 results, relax moment constraint
        if (topProducts.length < 4 && filtered.length < 4) {
            // Re-query without moment filter, keep audience + budget
            let fallbackFiltered = products;
            if (audience) {
                fallbackFiltered = products.filter((p: any) => {
                    const productAudience = p.metadata?.audience || [];
                    return productAudience.includes(audience) || productAudience.includes('unisex');
                });
            }
            return NextResponse.json({
                products: fallbackFiltered.slice(0, 8),
                fallback: true
            });
        }

        return NextResponse.json({ products: topProducts });

    } catch (err) {
        console.error('Gift Finder API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
