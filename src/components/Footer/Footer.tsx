import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brandColumn}>
                        <Link href="/" className="flex flex-col items-center gap-2 mb-6 group w-fit mx-auto md:mx-0">
                            <div className="relative h-14 w-14 md:h-20 md:w-20 flex-shrink-0">
                                <Image
                                    src="/blacklogo.png"
                                    alt="Broncstudio"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative h-10 md:h-14 w-auto aspect-[4/1]">
                                <Image
                                    src="/broncname.png"
                                    alt="Broncstudio"
                                    fill
                                    className="object-contain dark:hidden"
                                />
                                <Image
                                    src="/broncnamey.png"
                                    alt="Broncstudio"
                                    fill
                                    className="object-contain hidden dark:block"
                                />
                            </div>
                        </Link>
                        <p className={styles.brandDescription}>
                            Making childhood magical with our curated collection of books, fashion, and gifts. Designed with love for parents and kids.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>Shop</h4>
                        <ul className={styles.links}>
                            <li><Link href="#">Kids</Link></li>
                            <li><Link href="#">Fashion</Link></li>
                            <li><Link href="#">Accessories</Link></li>
                            <li><Link href="#">Gifting</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Help</h4>
                        <ul className={styles.links}>
                            <li><Link href="#">Track Order</Link></li>
                            <li><Link href="#">Returns & Refunds</Link></li>
                            <li><Link href="#">Shipping Policy</Link></li>
                            <li><Link href="#">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>About</h4>
                        <ul className={styles.links}>
                            <li><Link href="#">Our Story</Link></li>
                            <li><Link href="#">Blog</Link></li>
                            <li><Link href="#">Careers</Link></li>
                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>© 2024 Broncstudio. All rights reserved.</p>
                    <p>Made with ❤️ for Kids</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
