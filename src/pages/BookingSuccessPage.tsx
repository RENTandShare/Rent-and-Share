import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Download,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { bookings } = useMarketplace();

  const booking = bookings.find((b) => b.id === id) || bookings[0];

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F26B21', '#1FA463', '#FFB800', '#D9530F'],
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <Link to="/" className="text-xs text-[#F26B21] underline">Back to Home</Link>
      </div>
    );
  }

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xl space-y-8 text-center sm:text-left">
        {/* Top Celebratory Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-neutral-100">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#1FA463] flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#1FA463] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Booking Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F] mt-1">
              Thank You! Your Rental is Booked.
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
              Booking ID: <strong className="text-[#1F1F1F] font-mono">{booking.id}</strong> • Payment ID: {booking.paymentId}
            </p>
          </div>
        </div>

        {/* Status Lifecycle Indicator */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80">
          <p className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-4">
            Rental Status Tracking
          </p>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#1FA463] text-white flex items-center justify-center mx-auto text-xs font-bold">
                ✓
              </div>
              <p className="font-bold text-[#1FA463]">Confirmed</p>
              <p className="text-[10px] text-neutral-400">Order Placed</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#F26B21] text-white flex items-center justify-center mx-auto text-xs font-bold animate-pulse">
                2
              </div>
              <p className="font-bold text-[#F26B21]">Dispatched</p>
              <p className="text-[10px] text-neutral-400">In Packing</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mx-auto text-xs font-bold">
                3
              </div>
              <p className="font-semibold text-neutral-500">Delivered</p>
              <p className="text-[10px] text-neutral-400">Technician Setup</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mx-auto text-xs font-bold">
                4
              </div>
              <p className="font-semibold text-neutral-500">Active</p>
              <p className="text-[10px] text-neutral-400">Enjoy Rental</p>
            </div>
          </div>
        </div>

        {/* Item & Delivery Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#1F1F1F]">
          <div className="p-4 rounded-2xl border border-neutral-200 space-y-2">
            <p className="font-bold uppercase text-[11px] text-[#F26B21] tracking-wider">
              Equipment Details
            </p>
            <p className="font-bold text-sm text-[#1F1F1F]">{booking.productName}</p>
            <p className="text-[#6B6B6B]">Owner: {booking.ownerName}</p>
            <p className="text-[#6B6B6B]">
              Tenure: {booking.tenureMonths ? `${booking.tenureMonths} Months` : `${booking.tenureDays} Days`} ({booking.startDate} to {booking.endDate})
            </p>
            <p className="text-[#1FA463] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Repairs Covered
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-neutral-200 space-y-2">
            <p className="font-bold uppercase text-[11px] text-[#F26B21] tracking-wider">
              Delivery Address
            </p>
            <p className="font-bold text-sm text-[#1F1F1F]">{booking.deliveryAddress.fullName}</p>
            <p className="text-[#6B6B6B]">
              {booking.deliveryAddress.street}, {booking.deliveryAddress.area}
            </p>
            <p className="text-[#6B6B6B]">
              {booking.deliveryAddress.city} - {booking.deliveryAddress.pincode}
            </p>
            <p className="text-[#6B6B6B]">Phone: {booking.deliveryAddress.phone}</p>
          </div>
        </div>

        {/* Payment & Security Deposit Summary */}
        <div className="bg-[#FFF3EA]/50 rounded-2xl p-5 border border-orange-100 text-xs space-y-2 text-[#1F1F1F]">
          <div className="flex justify-between">
            <span>Payment Mode:</span>
            <span className="font-bold">{booking.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Rental Amount Paid:</span>
            <span className="font-bold">₹{booking.totalRent}</span>
          </div>
          <div className="flex justify-between text-emerald-800">
            <span>Refundable Security Deposit:</span>
            <span className="font-bold">₹{booking.securityDeposit}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-orange-200 font-extrabold text-sm text-[#F26B21]">
            <span>Total Paid (Test Mode):</span>
            <span>₹{booking.totalPaid}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/account?tab=rentals"
            className="flex-1 py-3 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm text-center shadow-lg transition flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" /> Track in My Rentals
          </Link>
          <button
            onClick={printInvoice}
            className="py-3 px-5 rounded-2xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download / Print Receipt
          </button>
          <Link
            to="/"
            className="py-3 px-5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm text-center transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
