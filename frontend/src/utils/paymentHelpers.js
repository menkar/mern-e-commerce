export const toPaise = (rupees) => {
  const value = Number(rupees);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round((value + Number.EPSILON) * 100);
};

export const isTestRazorpayKey = (keyId) =>
  typeof keyId === 'string' && keyId.startsWith('rzp_test_');

export const getTestPaymentHint = () =>
  'Razorpay test mode is active. UPI QR scan will not work. If card payment fails, try Netbanking or uncheck "Save card".';

export const TEST_PAYMENT_STEPS = [
  {
    title: 'Cards (domestic only)',
    detail: 'Use 4111 1111 1111 1111 or 5267 3181 8797 5449. For OTP, enter any 4–10 digits (e.g. 123456) and click Continue. Use fewer than 4 digits only to test failure.',
  },
  {
    title: 'Netbanking',
    detail: 'Pick any bank, then click Success on the mock page (most reliable in test mode).',
  },
  {
    title: 'UPI',
    detail: 'Enter success@razorpay and approve. Do not use UPI QR scan in test mode.',
  },
];

const INTERNATIONAL_CARD_PATTERN = /international card|international_transaction_not_allowed/i;

export const formatRazorpayError = (errorPayload) => {
  const error = errorPayload?.error ?? errorPayload;
  if (!error) return 'Payment failed. Please try again.';

  const parts = [
    error.description,
    error.reason,
    error.step ? `Step: ${error.step}` : null,
  ].filter(Boolean);

  return parts.join(' — ') || 'Payment failed. Please try again.';
};

export const getPaymentErrorMessage = (errorPayload, isTestMode = false) => {
  const error = errorPayload?.error ?? errorPayload;
  if (!error) return 'Payment failed. Please try again.';

  const reason = String(error.reason || '');
  const description = String(error.description || '');

  if (reason === 'international_transaction_not_allowed' || INTERNATIONAL_CARD_PATTERN.test(description)) {
    if (isTestMode) {
      return 'International cards are not supported. Use domestic card 4111 1111 1111 1111, Netbanking, or UPI ID success@razorpay.';
    }
    return 'International cards are not supported. Please use a domestic Indian card, UPI, or Netbanking.';
  }

  if (isTestMode && /qr/i.test(description)) {
    return 'UPI QR scan is not supported in test mode. Use UPI ID success@razorpay, Netbanking, or a domestic test card.';
  }

  if (isTestMode && /trouble|server_error|internal/i.test(description)) {
    return 'Payment could not be completed. Try Netbanking in test mode, or complete Activation in Razorpay Dashboard → Settings.';
  }

  return error.description || 'Payment failed. Please try again.';
};
