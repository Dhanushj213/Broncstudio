import React from 'react';
import styles from './page.module.css';

export const metadata = {
    title: 'Privacy Policy | Broncstudio',
    description: 'Privacy Policy for Broncstudio - How we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Privacy Policy</h1>

            <section className={styles.section}>
                <h2 className={styles.heading}>1. Introduction</h2>
                <p className={styles.text}>
                    Welcome to Broncstudio. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                    (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.heading}>2. Information We Collect</h2>
                <p className={styles.text}>
                    We collect several types of information from and about users of our Website, including information:
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <strong>Identity Data:</strong> includes first name, last name, username or similar identifier.
                    </li>
                    <li className={styles.listItem}>
                        <strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.
                    </li>
                    <li className={styles.listItem}>
                        <strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.
                    </li>
                    <li className={styles.listItem}>
                        <strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.
                    </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.heading}>3. How We Use Your Data</h2>
                <p className={styles.text}>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li className={styles.listItem}>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li className={styles.listItem}>Where we need to comply with a legal obligation.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.heading}>4. Data Security</h2>
                <p className={styles.text}>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.heading}>5. Your Legal Rights</h2>
                <p className={styles.text}>
                    Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.heading}>6. Contact Us</h2>
                <p className={styles.text}>
                    If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:support@broncstudio.com" className={styles.link}>support@broncstudio.com</a>.
                </p>
            </section>

            <section className={styles.section}>
                <p className={styles.text}>
                    <em>Last updated: January 2024</em>
                </p>
            </section>
        </main>
    );
}
