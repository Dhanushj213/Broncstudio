import React from 'react';
import styles from './MegaMenu.module.css';
import Link from 'next/link';
import { CATEGORY_TAXONOMY, MAIN_NAV_LINKS } from '@/data/categories';

const MegaMenu = () => {
    return (
        <nav className={styles.nav}>
            <ul className={styles.menuList}>
                {MAIN_NAV_LINKS.map((link) => {
                    const category = Object.values(CATEGORY_TAXONOMY).find(c => c.id === link.categoryId);
                    if (!category) return null;

                    return (
                        <li key={link.categoryId} className={styles.menuItem}>
                            <Link href={link.href} className={styles.menuLink}>
                                {link.label}
                            </Link>

                            <div className={styles.megaMenuOverlay}>
                                <div className={styles.megaMenuContent}>
                                    <div className={styles.introColumn}>
                                        <h4>{category.name}</h4>
                                        <p>{category.description || `Explore our ${category.name} collection`}</p>
                                        <Link href={link.href} className={styles.shopAllBtn}>Shop All</Link>
                                    </div>

                                    {/* Render Subcategories or Groups */}
                                    {'subcategories' in category && category.subcategories?.map(sub => (
                                        <div key={sub.id} className={styles.column}>
                                            <h4>{sub.name}</h4>
                                            <ul className={styles.linkList}>
                                                {sub.items.map((item: any) => (
                                                    <li key={item.slug}>
                                                        <Link href={`/shop/${category.slug}/${sub.slug}/${item.slug}`}>
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}

                                    {'groups' in category && category.groups?.map(group => (
                                        <div key={group.id} className={styles.column}>
                                            <h4>{group.name}</h4>
                                            {group.subcategories.map(sub => (
                                                <div key={sub.id} className="mb-4">
                                                    <h5 className={styles.subHeading}>{sub.name}</h5>
                                                    <ul className={styles.linkList}>
                                                        {sub.items.map((item: any) => (
                                                            <li key={item.slug}>
                                                                <Link href={`/shop/${category.slug}/${group.slug}/${sub.slug}/${item.slug}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default MegaMenu;
