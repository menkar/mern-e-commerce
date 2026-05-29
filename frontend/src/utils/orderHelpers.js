/**
 * Shared order display helpers — consistent across profile & admin.
 */

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

export const normalizeOrderStatus = (status) => {
  const key = (status || 'pending').toLowerCase();
  if (key === 'shipped' || key === 'delivered') return key;
  return 'pending';
};

export const getOrderDate = (order) => {
  if (order?.createdAt) {
    const date = new Date(order.createdAt);
    if (!isNaN(date.getTime())) return date;
  }

  const id = order?._id?.toString?.() ?? order?._id;
  if (typeof id === 'string' && id.length === 24) {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) return date;
  }

  return null;
};

export const formatOrderDate = (order) => {
  const date = getOrderDate(order);
  if (!date) return 'Date unavailable';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCurrency = (amount) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return '₹0.00';
  return `₹${value.toFixed(2)}`;
};

export const formatOrderStatus = (status) => {
  const normalized = normalizeOrderStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const getOrderStatusClass = (status) => {
  const normalized = normalizeOrderStatus(status);
  if (normalized === 'delivered') return 'order-status-badge order-status-badge--delivered';
  if (normalized === 'shipped') return 'order-status-badge order-status-badge--shipped';
  return 'order-status-badge order-status-badge--pending';
};

export const getProductName = (item) => {
  if (item?.name) return item.name;
  if (item?.productId?.name) return item.productId.name;
  return 'Product';
};

export const formatDeliveryAddress = (address) => {
  if (!address) return '';
  return `${address.fullName}, ${address.street}, ${address.city} ${address.postalCode}, ${address.country}`;
};

export const getAccountRoleClass = (role) =>
  role === 'admin' ? 'role-badge role-badge--admin' : 'role-badge role-badge--user';

export const formatAccountRole = (role) => (role || 'user').toUpperCase();
