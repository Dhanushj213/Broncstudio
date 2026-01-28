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
}

// Full Taxonomy from User Request
export const PERSONALIZATION_TAXONOMY = {
    'Clothing': {
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
                // Girls (Note: Same names, usually handled by gender_supported filtering or distinct base products if needed. For now assuming shared names.)
            ],
            'Unisex': [
                // T-Shirts
                'Oversized Classic T-Shirt', 'Oversized Standard T-Shirt', 'Tie Dye Oversized T-Shirt',
                'Acid Wash Oversized Tee', 'Terry Oversized Tee', 'Supima T-Shirt', 'Basic T-Shirt PC',
                'Cotton Stretch T-Shirt', 'Oversized Shirt',
                // Outerwear
                'Hoodie', 'Oversized Hoodie', 'Sweatshirt', 'Oversized Sweatshirt', 'Zip Hoodie', 'Acid Wash Hoodie',
                // Bottomwear
                'Sweatpants', 'Joggers', 'Terry Shorts', 'Tie Dye Shorts'
            ]
        }
    },
    'Accessories': {
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
        types: [
            'Keychain', 'Badge', 'Black Badge', 'Dog Tag', 'Luggage Tag', 'Embroidery Patches',
            'Bookmark', 'Stickers', 'Postcards', 'Greeting Cards', 'Sketchbook', 'Notebook', 'Notepad', 'Daily Planner'
        ]
    },
    'Home & Decor': {
        types: [
            'Poster', 'Framed Poster', 'Canvas', 'Acrylic Poster', 'Metal Poster', 'Tapestry',
            'Table Runner', 'Placemat', 'Cloth Napkin', 'Acrylic Coaster', 'Coasters',
            'Fridge Magnet', 'Acrylic Display Stand', 'Christmas Ornaments'
        ]
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

export const SUPPORTED_GENDERS: Gender[] = ['men', 'women', 'unisex', 'kids'];
