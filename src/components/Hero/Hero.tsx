import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
                <div className={styles.textContent}>
                    <h1 className={styles.headline}>
                        Stories, Style & Smiles — <span style={{ color: 'var(--color-primary-blue)' }}>All in One Place</span>
                    </h1>
                    <p className={styles.subheadline}>
                        Discover the best for your little ones: Kids Books, Trendy Fashion, Unique Gifts, and more.
                    </p>
                    <div className={styles.ctaGroup}>
                        <button className={styles.primaryBtn}>🛍️ Shop Kids</button>
                        <button className={styles.secondaryBtn}>🎁 Explore Gifts</button>
                    </div>
                </div>

                <div className={styles.imageContent}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://market-resized.envatousercontent.com/previews/files/338949132/Titoo.jpg?cf_fit=crop&crop=top&format=auto&h=300&q=85&w=590"
                        alt="Happy Kids"
                        className={styles.heroImage}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
