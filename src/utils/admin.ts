export const ADMIN_EMAILS = [
    'jdhanush213@gmail.com', // User confirmed email
    'monikacn15@gmail.com', // Added admin
    'mohanreddymr0201@gmail.com', // Added admin
    'admin@broncstudio.com',
    'demo@broncstudio.com' // For testing if needed
];

export const isAdmin = (email?: string | null) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
};

export const isSuperAdmin = (email?: string | null) => {
    return email === 'jdhanush213@gmail.com';
};

