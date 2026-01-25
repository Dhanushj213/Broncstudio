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
                        <Link href="/" style={{ display: 'block', marginBottom: '16px' }}>
                            <Image
                                src="/BroncStudio-Light.png"
                                alt="Broncstudio"
                                width={180}
                                height={50}
                                style={{ objectFit: 'contain' }}
                            />
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
