export type Gender = 'men' | 'women' | 'kids' | 'unisex';

export interface PrintTypeConfig {
    enabled: boolean;
    price: number;
}

export interface PlacementConfig {
    enabled: boolean;
    price: number;
    max_width: number;
    max_height: number;
}

export interface PersonalizationConfig {
    enabled: boolean;
    colors: string[];
    sizes: string[];
    print_types: Record<string, PrintTypeConfig>;
    placements: Record<string, PlacementConfig>;
    gender_supported: Gender[]; // Explicit support
    image_requirements: {
        min_dpi: number;
        max_size_mb: number;
        allowed_formats: string[];
    };
    gst_percent?: number;
    print_gst_percent?: number;
}


// Constants
export const PREDEFINED_COLORS = ['White', 'Black', 'Navy', 'Olive', 'Grey', 'Red', 'Blue', 'Yellow', 'Pink', 'Beige', 'Maroon', 'Purple', 'Orange', 'Green', 'Charcoal', 'Heather Grey'];
export const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', 'Standard', 'OS'];
export const PLACEMENTS = ['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve', 'Wrap Around', 'Inside Label'];
export const PRINT_TYPES = ['DTG Printing', 'Embroidery', 'DTF Printing', 'Vinyl Printing'];

export const SUPPORTED_GENDERS: Gender[] = ['men', 'women', 'unisex', 'kids'];

// Full Taxonomy from User Request
export const PERSONALIZATION_TAXONOMY: Record<string, { subcategories?: string[], types: Record<string, string[]> | string[] }> = {
    'Apparel': {
        subcategories: ['Men', 'Women', 'Kids', 'Unisex'],
        types: {
            'Men': [
                // T-Shirts
                'Classic Crew T-Shirt', 'Standard Crew T-Shirt', 'Full Sleeve T-Shirt',
                'V-Neck T-Shirt', 'Polo T-Shirt', 'Sleeveless T-Shirt', 'Raglan T-Shirt',
                // Outerwear
                'Pullover Hoodie', 'Hoodie', 'Zip Hoodie', 'Varsity Jacket',
                // Bottomwear
                'Sweatpants', 'Joggers', 'Terry Shorts', 'Tie Dye Shorts'
            ],
            'Women': [
                // Tops
                'Classic Crew T-Shirt', 'Baby Tee', 'Crop Top', 'Crop Tank', 'Tank Top',
                // Dresses
                'T-Shirt Dress', 'Maternity Dress',
                // Outerwear
                'Cropped Hoodie'
            ],
            'Kids': [
                // Boys
                'Classic Crew T-Shirt', 'Hoodie',
                // Girls
                'Classic Crew T-Shirt'
            ],
            'Unisex': [
                // T-Shirts
                'Oversized Classic T-Shirt', 'Oversized Standard T-Shirt', 'Tie Dye Oversized T-Shirt',
                'Acid Wash Oversized Tee', 'Terry Oversized Tee', 'Supima T-Shirt', 'Basic T-Shirt',
                'PC Cotton Stretch T-Shirt',
                // Shirts
                'Oversized Shirt',
                // Outerwear
                'Oversized Hoodie', 'Sweatshirt', 'Oversized Sweatshirt', 'Zip Hoodie', 'Acid Wash Hoodie',
                // Bottomwear
                'Sweatpants', 'Joggers', 'Terry Shorts', 'Tie Dye Shorts'
            ]
        }
    },
    'Accessories': { // Renamed from Accessories (Headwear) to just Accessories to match Request key loosely or better keeps simple
        types: [
            'Classic Baseball Cap', 'Baseball Ottoman Cap', 'Sports Cap',
            'Classic Snapback Cap', 'Classic Trucker Cap', 'Classic Bucket Hat'
        ]
    },
    'Drinkware': {
        types: [
            'White Coffee Mug', 'Black Coffee Mug', 'Color Coffee Mug', 'Magic Coffee Mug',
            'White Enamel Mug', 'Tumbler Bottle', 'Sipper Bottle', 'Steel Water Bottle'
        ]
    },
    'Tech & Desk': {
        types: [
            'Mouse Pad', 'Gaming Pad',
            'iPhone Glass Case', 'Samsung Glass Case', 'OnePlus Glass Case',
            'iPhone Sublimation Case', 'Samsung Sublimation Case', 'OnePlus Sublimation Case', 'Redmi Sublimation Case'
        ]
    },
    'Gifts & Stationery': {
        subcategories: ['Everyday Gifts', 'Paper Goods'],
        types: {
            'Everyday Gifts': [
                'Keychain', 'Badge', 'Black Badge', 'Dog Tag', 'Luggage Tag', 'Embroidery Patches'
            ],
            'Paper Goods': [
                'Pen', 'Bookmark', 'Stickers', 'Postcards', 'Greeting Cards', 'Sketchbook', 'Notebook', 'Notepad', 'Daily Planner'
            ]
        }
    },
    'Home & Decor': {
        subcategories: ['Wall Decor', 'Table & Living', 'Decor Accessories'],
        types: {
            'Wall Decor': ['Poster', 'Framed Poster', 'Canvas', 'Acrylic Poster', 'Metal Poster', 'Tapestry'],
            'Table & Living': ['Table Runner', 'Placemat', 'Cloth Napkin', 'Acrylic Coaster', 'Coasters'],
            'Decor Accessories': ['Fridge Magnet', 'Acrylic Display Stand', 'Christmas Ornaments']
        }
    },
    'Toys & Activities': {
        types: ['MDF Wooden Puzzle', 'Jigsaw Puzzle']
    },
    'Bags': {
        types: ['Tote Bag (Zipper)', 'Tote Bag (Non-Zipper)', 'Everyday Large Tote Bag', 'Drawstring Bag']
    },
    'Pets': {
        types: ['Dog T-Shirts', 'Pet Tags']
    }
};

