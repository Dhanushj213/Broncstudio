import { Cake, Home, Shirt, Brain, Coffee, Dog, Sparkles } from 'lucide-react';

export interface GiftMoment {
    id: string;
    label: string;
    icon: any;
    tagline: string;
    preferredCategories: string[];
    giftTypes: string[];
    excludeCategories?: string[];
}

export const GIFT_MOMENTS: GiftMoment[] = [
    {
        id: 'forgot_birthday',
        label: 'Forgot the Birthday',
        icon: Cake,
        tagline: 'Easy gifts that always work',
        preferredCategories: ['accessories', 'drinkware', 'tech_desk', 'gifts_stationery'],
        giftTypes: ['quick', 'safe', 'impulse'],
    },
    {
        id: 'new_home',
        label: 'New Home, New Beginnings',
        icon: Home,
        tagline: 'Thoughtful pieces for a fresh start',
        preferredCategories: ['home_decor', 'drinkware'],
        giftTypes: ['safe', 'premium'],
    },
    {
        id: 'everyday_upgrade',
        label: 'Everyday Upgrade',
        icon: Shirt,
        tagline: 'Useful, stylish gifts they\'ll use daily',
        preferredCategories: ['clothing', 'accessories', 'bags'],
        giftTypes: ['safe'],
    },
    {
        id: 'learning_play',
        label: 'Learning & Play Time',
        icon: Brain,
        tagline: 'Fun gifts that spark curiosity',
        preferredCategories: ['toys', 'gifts_stationery'],
        giftTypes: ['quick', 'safe'],
    },
    {
        id: 'desk_glowup',
        label: 'Desk Glow-Up',
        icon: Coffee,
        tagline: 'Small upgrades for work & study',
        preferredCategories: ['tech_desk', 'drinkware', 'gifts_stationery'],
        giftTypes: ['quick', 'impulse'],
    },
    {
        id: 'for_pet',
        label: 'For My Pet',
        icon: Dog,
        tagline: 'Something special for furry friends',
        preferredCategories: ['pets'],
        giftTypes: ['safe'],
    },
    {
        id: 'just_because',
        label: 'Just Because',
        icon: Sparkles,
        tagline: 'No reason needed — just joy',
        preferredCategories: [], // All categories allowed
        giftTypes: ['quick', 'impulse'],
    },
];

export const AUDIENCE_OPTIONS = [
    { id: 'men', label: 'For Him' },
    { id: 'women', label: 'For Her' },
    { id: 'kids', label: 'For Kids' },
    { id: 'pets', label: 'For Pets' },
];

export const BUDGET_OPTIONS = [
    { id: 499, label: 'Under ₹499' },
    { id: 999, label: '₹500–₹999' },
    { id: 10000, label: '₹1000+' },
];

export function getMomentById(id: string): GiftMoment | undefined {
    return GIFT_MOMENTS.find(m => m.id === id);
}
