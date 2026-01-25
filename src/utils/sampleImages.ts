export const SAMPLE_IMAGES = [
    '/sample/1.jpg',
    '/sample/2.jpg',
    '/sample/3.jpg',
    '/sample/4.jpg',
    '/sample/5.jpg',
];

export const getProductImage = (index: number | string) => {
    const i = typeof index === 'number' ? index : parseInt(index.toString().replace(/\D/g, '') || '0', 10);
    return SAMPLE_IMAGES[i % SAMPLE_IMAGES.length];
};

export const getRandomProductImage = () => {
    return SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
};
