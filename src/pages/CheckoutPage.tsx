import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { processTestPayment } from '../services/payment';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Lock,
  ArrowRight,
  FileText,
  Upload,
} from 'lucide-react';
import { DeliveryAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, createBooking, settings } = useMarketplace();
  const { user, addresses, selectedCity, submitKyc } = useAuth();
  const { showToast } = useToast();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('demo.renter@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rentalNotes, setRentalNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Quick KYC prompt states if not approved
  const [showKycUpload, setShowKycUpload] = useState(user?.kycStatus === 'Not Submitted');
  const [docType, setDocType] = useState<'Aadhaar' | 'PAN' | 'Passport' | 'Driving License'>('Aadhaar');
  const [docNumber, setDocNumber] = useState('5412-8891-9920');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const primaryItem = cart[0];
  const totalMonthlyRent = cart.reduce((sum, item) => sum + item.calculatedMonthlyRent, 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.securityDeposit, 0);
  const deliveryFee = totalMonthlyRent >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
  const platformFee = settings.platformFee;
  const taxable = totalMonthlyRent + platformFee;
  const gst = Math.round(taxable * (settings.gstPercent / 100));
  const totalPayable = totalMonthlyRent + totalDeposit + deliveryFee + platformFee + gst;

  const currentAddress: DeliveryAddress = addresses[selectedAddressIndex] || {
    id: 'temp-addr',
    fullName: user?.name || 'Rahul Sharma',
    phone: user?.phone || '+91 98765 43210',
    street: 'Flat 402, Sai Residency',
    area: 'Jubilee Hills',
    city: selectedCity,
    pincode: '500033',
    isDefault: true,
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      showToast('Agreement Required', 'warning', 'Please accept the rental agreement & cancellation policy.');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Simulate payment in TEST MODE
      const payResult = await processTestPayment(
        {
          amount: totalPayable,
          currency: 'INR',
          bookingId: `BK-TMP-${Date.now()}`,
          customerName: currentAddress.fullName,
          customerEmail: user?.email || 'customer@rentandshare.com',
          customerPhone: currentAddress.phone,
        },
        paymentMode
      );

      if (!payResult.success) {
        showToast('Payment Failed', 'error', payResult.errorMessage);
        setIsProcessing(false);
        return;
      }

      // Step 2: Create Booking record in Storage with overlapping date check
      const result = await createBooking({
        productId: primaryItem.productId,
        startDate: primaryItem.startDate,
        endDate: primaryItem.endDate,
        tenureMonths: primaryItem.tenureMonths,
        tenureDays: primaryItem.tenureDays,
        deliveryAddress: currentAddress,
        paymentMethod: `${paymentMode} (Test Simulation)`,
        notes: rentalNotes,
      });

      if (!result.success) {
        showToast('Booking Error', 'error', result.error);
        setIsProcessing(false);
        return;
      }

      // Step 3: Navigate to confirmation screen
      navigate(`/booking-success/${result.bookingId}`);
    } catch (err: any) {
      showToast('Order Processing Error', 'error', err?.message || 'Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* High-Visibility TEST MODE Payment Screen Banner */}
      <div className="bg-amber-500 text-neutral-900 rounded-2xl p-4 mb-6 shadow-md border-2 border-amber-600 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-neutral-900" />
        <div className="text-xs">
          <p className="font-extrabold uppercase tracking-wider text-sm">
            TEST MODE SIMULATED CHECKOUT (NO REAL MONEY CHARGED)
          </p>
          <p className="mt-0.5 font-medium leading-relaxed">
            This checkout simulates the Indian payment flow (UPI / Cards / Net Banking) for testing. Real payment gateways like <strong>Razorpay</strong> can be activated with your API Keys in <code>payment.ts</code>. All test transactions are stored with <code>isTestPayment: true</code>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address, KYC & Payment Mode */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F26B21]" /> Step 1: Delivery & Setup Address
              </h2>
              <span className="text-xs text-[#1FA463] font-bold">City: {selectedCity}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr, idx) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressIndex(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedAddressIndex === idx
                      ? 'border-[#F26B21] bg-[#FFF3EA]/50 ring-2 ring-[#F26B21]/15'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-xs text-[#1F1F1F]">{addr.fullName}</p>
                    {selectedAddressIndex === idx && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F26B21]" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-1">{addr.street}, {addr.area}</p>
                  <p className="text-xs font-semibold text-[#1F1F1F] mt-0.5">{addr.city} - {addr.pincode}</p>
                  <p className="text-[11px] text-[#6B6B6B] mt-1">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: KYC Verification Status */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F26B21]" /> Step 2: KYC ID Verification
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                user?.kycStatus === 'Approved'
                  ? 'bg-emerald-100 text-[#1FA463]'
                  : user?.kycStatus === 'Pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-neutral-100 text-neutral-600'
              }`}>
                {user?.kycStatus === 'Approved' ? '✓ Verified' : user?.kycStatus || 'Not Submitted'}
              </span>
            </div>

            {user?.kycStatus === 'Approved' ? (
              <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1FA463] shrink-0" />
                <span>Your government ID proof is verified! Fast 24-hr doorstep handover enabled.</span>
              </div>
            ) : (
              <div className="p-3.5 bg-neutral-50 rounded-2xl text-xs space-y-2 border border-neutral-200">
                <p className="text-[#1F1F1F]">
                  First time renter? Upload your ID proof now or do it within 24 hours of delivery.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="p-2 rounded-xl border border-neutral-300 text-xs bg-white font-medium"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Document Number"
                    className="p-2 rounded-xl border border-neutral-300 text-xs bg-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      submitKyc(
                        docType,
                        docNumber,
                        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
                      );
                      showToast('KYC Submitted', 'success', 'Admin will approve your verification shortly.');
                    }}
                    className="px-3.5 py-2 bg-[#F26B21] text-white text-xs font-semibold rounded-xl"
                  >
                    Submit ID
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Cancellation & Tenure Policy Preview */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-3">
            <h2 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2 pb-3 border-b border-neutral-100">
              <ShieldCheck className="w-5 h-5 text-[#1FA463]" /> Step 3: Free Cancellation & Return Policy
            </h2>
            <div className="text-xs text-[#6B6B6B] space-y-2">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1FA463] shrink-0 mt-0.5" />
                <span>
                  <strong>100% Free Cancellation:</strong> Cancel any time before delivery dispatch for an immediate 100% refund of both rental fees and security deposit.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1FA463] shrink-0 mt-0.5" />
                <span>
                  <strong>Free Relocation Once a Year:</strong> Moving homes within {selectedCity}? Rent and Share moves your equipment with free transport.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1FA463] shrink-0 mt-0.5" />
                <span>
                  <strong>Deposit Refund:</strong> Fully refunded within 2-4 working days of pickup once physical check is verified.
                </span>
              </p>
            </div>
          </div>

          {/* Step 4: Payment Simulation */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#F26B21]" /> Step 4: Test Mode Payment Screen
              </h2>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Simulated Gateway
              </span>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'UPI', label: 'UPI / QR', desc: 'GPay, PhonePe, Paytm' },
                { id: 'Card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay' },
                { id: 'NetBanking', label: 'Net Banking', desc: 'HDFC, ICICI, SBI' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPaymentMode(mode.id as any)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    paymentMode === mode.id
                      ? 'border-[#F26B21] bg-[#FFF3EA] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className={`font-bold text-xs ${paymentMode === mode.id ? 'text-[#F26B21]' : 'text-[#1F1F1F]'}`}>
                    {mode.label}
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] mt-0.5">{mode.desc}</p>
                </button>
              ))}
            </div>

            {/* Mode Specific Inputs */}
            {paymentMode === 'UPI' && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <label className="block text-xs font-bold text-[#1F1F1F]">Simulated Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium"
                />
                <p className="text-[11px] text-[#6B6B6B]">Auto-approved UPI transaction in Test Mode.</p>
              </div>
            )}

            {paymentMode === 'Card' && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Simulated Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F1F1F] mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMode === 'NetBanking' && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <label className="block text-xs font-bold text-[#1F1F1F]">Select Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Delivery Instructions */}
            <div>
              <label className="block text-xs font-bold text-[#1F1F1F] mb-1">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={rentalNotes}
                onChange={(e) => setRentalNotes(e.target.value)}
                placeholder="E.g. Call before arrival, lift available, 3rd floor"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-[#1F1F1F]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Final Pay Button */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-5 sticky top-24">
          <h3 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Booking Items ({cart.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1F1F1F] truncate">{item.product.name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    Tenure: {item.tenureMonths ? `${item.tenureMonths} Months` : `${item.tenureDays} Days`}
                  </p>
                </div>
                <span className="font-bold text-[#1F1F1F]">₹{item.calculatedMonthlyRent}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-[#6B6B6B]">
            <div className="flex justify-between">
              <span>Rental Charges</span>
              <span className="font-bold text-[#1F1F1F]">₹{totalMonthlyRent}</span>
            </div>
            <div className="flex justify-between">
              <span>Refundable Deposit</span>
              <span className="font-bold text-emerald-700">₹{totalDeposit}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery & Setup</span>
              <span className={deliveryFee === 0 ? 'text-[#1FA463] font-bold' : 'text-[#1F1F1F]'}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span className="text-[#1F1F1F]">₹{platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="text-[#1F1F1F]">₹{gst}</span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline font-extrabold text-base text-[#1F1F1F]">
              <span>Total Payable Now</span>
              <span className="text-[#F26B21] text-xl">₹{totalPayable}</span>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-[#6B6B6B] cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 accent-[#F26B21] rounded"
            />
            <span>
              I agree to the <strong>Rent and Share Rental Agreement</strong> and confirm understanding of the 100% refundable deposit and free cancellation policy.
            </span>
          </label>

          {/* Pay Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-black text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authorizing Test Payment...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Confirm & Pay ₹{totalPayable} (Test Mode)</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
