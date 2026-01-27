export const ADMIN_EMAILS = [

    'jdhanush213@gmail.com', // User confirmed email
    'admin@broncstudio.com',
    'demo@broncstudio.com' // For testing if needed
];

export const isAdmin = (email?: string | null) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
};
