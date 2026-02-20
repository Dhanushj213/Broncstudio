import React from 'react';
import styles from './ShopByCategory.module.css';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
    { id: 'kids-books', label: 'Kids Books', img: 'https://childhood101.com/wp-content/uploads/2016/05/Beautiful-childrens-books.jpg' },
    { id: 'toys', label: 'Toys & Games', img: 'https://m.media-amazon.com/images/I/818SkNlPIxL.jpg' },
    { id: 'fashion', label: 'Fashion', img: 'https://s.tmimgcdn.com/scr/1200x627/328100/fashion-website-hero-section-01_328179-original.jpg' },
    { id: 'lifestyle', label: 'Lifestyle', img: 'https://yourgiftstudio.com/cdn/shop/products/Frame85_17dd8461-99ff-45d7-ab28-23455d471c5c.webp?v=1696647437' },
    { id: 'pets', label: 'Pet Store', img: 'https://i.pinimg.com/736x/5c/d4/08/5cd4089dcc7e5f07ca14826b3114990a.jpg' },
    { id: 'decor', label: 'Home & Decor', img: 'https://cdn.dribbble.com/userupload/43814834/file/original-c7749d8018843c1dc564b6c7813e319d.jpg?format=webp&resize=400x300&vertical=center' },
];

const ShopByCategory = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Shop by Category</h2>
                <div className={styles.grid}>
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/category/${cat.id}`} className={styles.categoryCard}>
                            <div className={styles.imageWrapper}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden shadow-sm">
                                    <Image src={cat.img} alt={cat.label} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <span className={styles.label}>{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByCategory;
