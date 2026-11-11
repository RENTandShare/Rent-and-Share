/**
 * Payment Service Interface
 * Clearly demarcates TEST MODE simulation from live gateways like Razorpay/PayU.
 */

export interface PaymentOrderParams {
  amount: number; // in INR
  currency: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  isTestMode: true;
  method: 'UPI' | 'Card' | 'NetBanking';
  transactionTime: string;
  errorMessage?: string;
}

/**
 * Simulates a payment in TEST MODE.
 * Delay provides realistic UX with clear mock receipt output.
 */
export async function processTestPayment(
  params: PaymentOrderParams,
  method: 'UPI' | 'Card' | 'NetBanking' = 'UPI',
  forceFail: boolean = false
): Promise<PaymentResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (forceFail) {
    return {
      success: false,
      paymentId: '',
      orderId: `ord_test_${Date.now()}`,
      isTestMode: true,
      method,
      transactionTime: new Date().toISOString(),
      errorMessage: 'Test payment simulation rejected by user.',
    };
  }

  const randomRef = Math.random().toString(36).substring(2, 9).toUpperCase();
  const paymentId = `pay_test_${method.toLowerCase()}_${randomRef}`;

  return {
    success: true,
    paymentId,
    orderId: `ord_test_${params.bookingId}`,
    isTestMode: true,
    method,
    transactionTime: new Date().toISOString(),
  };
}

/**
 * Placeholder for Live Razorpay integration.
 * In production with real keys, load https://checkout.razorpay.com/v1/checkout.js
 */
export async function initializeLiveRazorpay(
  keyId: string,
  params: PaymentOrderParams
): Promise<never> {
  throw new Error(
    `Live Razorpay payment requires backend order generation and a valid Razorpay Key. Received key ${keyId.slice(0, 4)}... Current environment is running in Test Mode.`
  );
}
