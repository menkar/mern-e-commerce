export const isAdmin = (user) => user?.role?.toLowerCase() === 'admin';

export const loadStoredUser = () => {
  try {
    const stored = localStorage.getItem('userInfo');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};
