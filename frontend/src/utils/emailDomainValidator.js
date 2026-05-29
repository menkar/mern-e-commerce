const ALLOWED_EMAIL_DOMAINS = new Set([
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yahoo.co.in',
    'yahoo.co.uk',
    'yahoo.in',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    'icloud.com',
    'me.com',
    'mac.com',
    'aol.com',
    'protonmail.com',
    'proton.me',
    'zoho.com',
    'mail.com',
    'gmx.com',
    'gmx.net',
    'rediffmail.com',
]);

export const INVALID_EMAIL_DOMAIN_MESSAGE =
    'Please register with a supported email provider (Gmail, Yahoo, Outlook, Hotmail, iCloud, AOL, Proton, Zoho, etc.).';

const getEmailDomain = (email) => {
    const trimmed = String(email ?? '').trim().toLowerCase();
    const atIndex = trimmed.lastIndexOf('@');

    if (atIndex <= 0 || atIndex === trimmed.length - 1) {
        return null;
    }

    return trimmed.slice(atIndex + 1);
};

export const isAllowedEmailDomain = (email) => {
    const domain = getEmailDomain(email);
    return Boolean(domain && ALLOWED_EMAIL_DOMAINS.has(domain));
};
