const formatCurrency = (amount) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return '₹0.00';
    return `₹${value.toFixed(2)}`;
};

const formatOrderDate = (order) => {
    const date = order?.createdAt ? new Date(order.createdAt) : new Date();
    if (isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatInvoiceNumber = (orderId) => {
    const id = orderId?.toString?.() ?? String(orderId || '');
    return `INV-${id.slice(-8).toUpperCase()}`;
};

const getProductName = (item) => {
    if (item?.name) return item.name;
    if (item?.productId?.name) return item.productId.name;
    return 'Product';
};

const getTransactionDetails = (paymentId) => {
    if (!paymentId) {
        return { status: 'Pending', method: 'Not paid', reference: '—' };
    }
    if (paymentId.startsWith('bypass_txn_')) {
        return { status: 'Completed', method: 'Test order', reference: paymentId };
    }
    return { status: 'Completed', method: 'Razorpay', reference: paymentId };
};

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const buildOrderConfirmationEmail = ({ user, order }) => {
    const invoiceNo = formatInvoiceNumber(order._id);
    const orderDate = formatOrderDate(order);
    const transaction = getTransactionDetails(order.paymentId);
    const itemCount = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0)
        : 0;

    const itemsText = (order.items || [])
        .map((item, index) => {
            const lineTotal = (item.price || 0) * (item.qty || 0);
            return `${index + 1}. ${getProductName(item)} | Qty: ${item.qty} | Unit: ${formatCurrency(item.price)} | Subtotal: ${formatCurrency(lineTotal)}`;
        })
        .join('\n');

    const address = order.address || {};
    const shippingLine = [
        address.fullName,
        address.street,
        `${address.city || ''} ${address.postalCode || ''}`.trim(),
        address.country,
    ].filter(Boolean).join(', ');

    const text = [
        `Dear ${user.name},`,
        '',
        'Thank you for your order at Swap Ecommerce Store. Your payment has been received and your order is being processed.',
        '',
        'INVOICE DETAILS',
        `Invoice No.: ${invoiceNo}`,
        `Invoice Date: ${orderDate}`,
        `Billed To: ${user.name}`,
        `Email: ${user.email}`,
        '',
        'TRANSACTION DETAILS',
        `Payment Status: ${transaction.status}`,
        `Payment Method: ${transaction.method}`,
        `Transaction ID: ${transaction.reference}`,
        `Amount Paid: ${formatCurrency(order.totalAmount)}`,
        '',
        'ORDER ITEMS',
        itemsText || 'No items',
        '',
        `Items: ${itemCount}`,
        `Order Total: ${formatCurrency(order.totalAmount)}`,
        '',
        'SHIPPING ADDRESS',
        shippingLine,
        '',
        'If you have any questions, reply to this email or contact our support team.',
        '',
        'Thank you for shopping with us.',
        'Swap Ecommerce Store',
    ].join('\n');

    const itemRowsHtml = (order.items || [])
        .map((item, index) => {
            const lineTotal = (item.price || 0) * (item.qty || 0);
            return `
              <tr>
                <td data-label="#" style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;">${index + 1}</td>
                <td data-label="Product" style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:13px;font-weight:600;">${escapeHtml(getProductName(item))}</td>
                <td data-label="Qty" style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px;text-align:center;">${item.qty}</td>
                <td data-label="Unit Price" style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px;text-align:right;">${formatCurrency(item.price)}</td>
                <td data-label="Subtotal" style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#0d9488;font-size:13px;font-weight:700;text-align:right;">${formatCurrency(lineTotal)}</td>
              </tr>`;
        })
        .join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Order Confirmation</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .items-table thead { display: none !important; }
      .items-table tr { display: block !important; margin-bottom: 12px !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; }
      .items-table td { display: block !important; width: 100% !important; text-align: left !important; border-bottom: none !important; }
      .items-table td::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e 0%,#0d9488 100%);padding:28px 32px;" class="mobile-padding">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Swap Ecommerce Store</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">Order Confirmed</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.92);">Thank you, ${escapeHtml(user.name)}. We have received your order.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;" class="mobile-padding">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="stack-column" width="50%" valign="top" style="padding:0 8px 16px 0;">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                      <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#0f766e;">Invoice Details</p>
                      <p style="margin:0 0 6px;font-size:13px;"><strong style="color:#0f172a;">Invoice No.</strong><br/>${invoiceNo}</p>
                      <p style="margin:0 0 6px;font-size:13px;"><strong style="color:#0f172a;">Invoice Date</strong><br/>${orderDate}</p>
                      <p style="margin:0 0 6px;font-size:13px;"><strong style="color:#0f172a;">Billed To</strong><br/>${escapeHtml(user.name)}</p>
                      <p style="margin:0;font-size:13px;"><strong style="color:#0f172a;">Email</strong><br/>${escapeHtml(user.email)}</p>
                    </div>
                  </td>
                  <td class="stack-column" width="50%" valign="top" style="padding:0 0 16px 8px;">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                      <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#0f766e;">Transaction Details</p>
                      <p style="margin:0 0 6px;font-size:13px;"><strong style="color:#0f172a;">Payment Status</strong><br/><span style="display:inline-block;margin-top:4px;padding:3px 10px;border-radius:999px;background:#ecfdf5;color:#047857;font-size:11px;font-weight:700;">${escapeHtml(transaction.status)}</span></p>
                      <p style="margin:0 0 6px;font-size:13px;"><strong style="color:#0f172a;">Payment Method</strong><br/>${escapeHtml(transaction.method)}</p>
                      <p style="margin:0 0 6px;font-size:13px;"><strong style="color:#0f172a;">Transaction ID</strong><br/><span style="word-break:break-all;">${escapeHtml(transaction.reference)}</span></p>
                      <p style="margin:0;font-size:13px;"><strong style="color:#0f172a;">Amount Paid</strong><br/><span style="color:#047857;font-weight:700;">${formatCurrency(order.totalAmount)}</span></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 20px;" class="mobile-padding">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#0f766e;">Order Items</p>
              <div style="overflow-x:auto;border:1px solid #e2e8f0;border-radius:12px;">
                <table role="presentation" class="items-table" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;min-width:100%;">
                  <thead>
                    <tr style="background:#0f172a;">
                      <th style="padding:10px;color:#ffffff;font-size:11px;text-align:left;">#</th>
                      <th style="padding:10px;color:#ffffff;font-size:11px;text-align:left;">Product</th>
                      <th style="padding:10px;color:#ffffff;font-size:11px;text-align:center;">Qty</th>
                      <th style="padding:10px;color:#ffffff;font-size:11px;text-align:right;">Unit Price</th>
                      <th style="padding:10px;color:#ffffff;font-size:11px;text-align:right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemRowsHtml || `<tr><td colspan="5" style="padding:16px;text-align:center;color:#64748b;">No items found</td></tr>`}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 20px;" class="mobile-padding">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#0f766e;">Shipping Address</p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">${escapeHtml(shippingLine)}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 28px;" class="mobile-padding">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font-size:14px;color:#334155;">${itemCount} item${itemCount === 1 ? '' : 's'}</td>
                  <td style="padding:16px 18px;font-size:16px;font-weight:700;color:#047857;text-align:right;">Total: ${formatCurrency(order.totalAmount)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;" class="mobile-padding">
              <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#64748b;">If you have any questions about your order, reply to this email and our support team will assist you.</p>
              <p style="margin:0;font-size:13px;color:#0f172a;font-weight:600;">Swap Ecommerce Store</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return {
        subject: `Order Confirmation — ${invoiceNo}`,
        text,
        html,
    };
};

module.exports = {
    buildOrderConfirmationEmail,
    formatInvoiceNumber,
};
