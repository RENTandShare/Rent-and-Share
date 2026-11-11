import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/common/ProductCard';
import {
  User,
  Layers,
  Heart,
  MapPin,
  FileCheck,
  Bell,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Wrench,
  Clock,
  RotateCcw,
  Star,
  ExternalLink,
} from 'lucide-react';
import { DeliveryAddress } from '../types';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const {
    user,
    role,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    submitKyc,
    updateProfile,
    selectedCity,
  } = useAuth();

  const {
    bookings,
    cancelBooking,
    extendBookingTenure,
    requestReturnBooking,
    wishlist,
    products,
    notifications,
    markNotificationRead,
    submitReview,
  } = useMarketplace();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // New Address Form Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newPincode, setNewPincode] = useState('500033');
  const [newPhone, setNewPhone] = useState(user?.phone || '+91 98765 43210');

  // Review Modal state for completed rental
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewProductId, setReviewProductId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Filter rentals for this customer
  const myBookings = bookings.filter((b) =>
    user?.role === 'admin' ? true : b.userId === user?.id
  );

  // Filter wishlisted items
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newArea.trim()) return;

    addAddress({
      fullName: user?.name || 'Customer',
      phone: newPhone,
      street: newStreet.trim(),
      area: newArea.trim(),
      city: selectedCity,
      pincode: newPincode.trim(),
      isDefault: addresses.length === 0,
    });

    showToast('Address Saved', 'success', 'New delivery address added.');
    setIsAddressModalOpen(false);
    setNewStreet('');
    setNewArea('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProductId || !reviewBookingId || !reviewComment.trim()) return;
    submitReview(reviewProductId, reviewBookingId, reviewRating, reviewComment.trim());
    setReviewBookingId(null);
    setReviewProductId(null);
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F26B21] to-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F1F1F]">{user?.name}</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF3EA] text-[#F26B21] uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-0.5">{user?.email} • {user?.phone}</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Primary Hub: <strong className="text-[#1F1F1F]">{selectedCity}</strong></p>
          </div>
        </div>

        {/* KYC Badge & Status */}
        <div className="flex items-center gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            user?.kycStatus === 'Approved' ? 'bg-emerald-100 text-[#1FA463]' : 'bg-amber-100 text-amber-700'
          }`}>
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="text-left text-xs">
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">KYC Status</span>
            <span className={`font-bold ${user?.kycStatus === 'Approved' ? 'text-[#1FA463]' : 'text-amber-700'}`}>
              {user?.kycStatus === 'Approved' ? '✓ Verified (Aadhaar/PAN)' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto no-scrollbar gap-2 mb-8">
        {[
          { id: 'profile', label: 'My Profile & Addresses', icon: User },
          { id: 'rentals', label: `My Rentals (${myBookings.length})`, icon: Layers },
          { id: 'wishlist', label: `Wishlist (${wishlistedProducts.length})`, icon: Heart },
          { id: 'notifications', label: `Notifications (${notifications.filter((n) => !n.isRead).length})`, icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
              className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'border-[#F26B21] text-[#F26B21]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Rentals */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          {myBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
              <Layers className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-base text-[#1F1F1F]">No Active Rentals</h3>
              <p className="text-xs text-[#6B6B6B]">You have not booked any rental equipment yet.</p>
              <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-[#F26B21] text-white text-xs font-bold inline-block">
                Start Renting
              </Link>
            </div>
          ) : (
            myBookings.map((booking) => {
              const isActive = booking.status === 'Active' || booking.status === 'Confirmed' || booking.status === 'Delivered';

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.productImage}
                        alt={booking.productName}
                        className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-[#F26B21] uppercase tracking-wider">
                          {booking.category} • Booking ID: {booking.id}
                        </span>
                        <h3 className="font-bold text-sm text-[#1F1F1F] mt-0.5">{booking.productName}</h3>
                        <p className="text-xs text-[#6B6B6B]">
                          Owner: <strong>{booking.ownerName}</strong> • {booking.tenureMonths ? `${booking.tenureMonths} Months` : `${booking.tenureDays} Days`}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        booking.status === 'Active'
                          ? 'bg-emerald-100 text-[#1FA463]'
                          : booking.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : booking.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-[#6B6B6B]">
                        Total Paid: <strong>₹{booking.totalPaid}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Rental Timeline & Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#1F1F1F]">
                    <div className="p-3.5 bg-neutral-50 rounded-2xl">
                      <span className="text-[11px] text-[#6B6B6B] block">Rental Period:</span>
                      <p className="font-bold mt-0.5">
                        {booking.startDate} to {booking.endDate}
                      </p>
                    </div>

                    <div className="p-3.5 bg-neutral-50 rounded-2xl">
                      <span className="text-[11px] text-[#6B6B6B] block">Delivery Address:</span>
                      <p className="font-medium mt-0.5 truncate">
                        {booking.deliveryAddress.street}, {booking.deliveryAddress.city}
                      </p>
                    </div>

                    <div className="p-3.5 bg-neutral-50 rounded-2xl">
                      <span className="text-[11px] text-[#6B6B6B] block">Security Deposit:</span>
                      <p className="font-bold text-emerald-700 mt-0.5">
                        ₹{booking.securityDeposit} (100% Refundable on return)
                      </p>
                    </div>
                  </div>

                  {/* Rental Action Buttons: Raise a Request, Extend, Return, Cancel */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    {/* Raise a Request Button on active rental */}
                    {isActive && (
                      <Link
                        to="/repairs"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Wrench className="w-3.5 h-3.5" /> Raise Repair Request
                      </Link>
                    )}

                    {/* Extend Tenure */}
                    {isActive && (
                      <button
                        onClick={() => extendBookingTenure(booking.id, 3)}
                        className="px-4 py-2 rounded-xl border border-neutral-300 hover:border-[#F26B21] text-xs font-semibold text-[#1F1F1F] flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#F26B21]" /> Extend Tenure (+3 Months)
                      </button>
                    )}

                    {/* Request Return */}
                    {booking.status === 'Active' && (
                      <button
                        onClick={() => requestReturnBooking(booking.id)}
                        className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-[#1F1F1F] flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-neutral-500" /> Request Pickup Return
                      </button>
                    )}

                    {/* Cancel Booking */}
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                      >
                        Cancel Booking (100% Refund)
                      </button>
                    )}

                    {/* Leave Review for completed rentals */}
                    {booking.status === 'Completed' && (
                      <button
                        onClick={() => {
                          setReviewBookingId(booking.id);
                          setReviewProductId(booking.productId);
                        }}
                        className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rate Experience
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Profile & Addresses */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
              Personal Details
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full p-2.5 bg-neutral-100 border rounded-xl text-neutral-500"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Mobile Phone Number</label>
                <input
                  type="text"
                  value={user?.phone || ''}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Operating City</label>
                <input
                  type="text"
                  value={selectedCity}
                  disabled
                  className="w-full p-2.5 bg-neutral-100 border rounded-xl text-neutral-600"
                />
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F26B21]" /> Saved Delivery Addresses
              </h2>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-bold text-[#F26B21] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-2xl border transition ${
                    addr.isDefault
                      ? 'border-[#F26B21] bg-[#FFF3EA]/40'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-xs text-[#1F1F1F]">{addr.fullName}</p>
                    {addr.isDefault ? (
                      <span className="text-[10px] font-bold text-[#1FA463] bg-emerald-50 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[10px] text-[#F26B21] hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-1">{addr.street}, {addr.area}</p>
                  <p className="text-xs font-semibold text-[#1F1F1F] mt-0.5">{addr.city} - {addr.pincode}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100 text-[11px]">
                    <span className="text-neutral-500">Phone: {addr.phone}</span>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-neutral-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-base text-[#1F1F1F]">No Saved Items in Wishlist</h3>
              <p className="text-xs text-[#6B6B6B]">Tap the heart icon on any product to save it here.</p>
              <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-[#F26B21] text-white text-xs font-bold inline-block">
                Explore Equipment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-3">
          <h2 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            System & Rental Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-xs text-[#6B6B6B] py-6 text-center">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  n.isRead ? 'bg-white border-neutral-100' : 'bg-[#FFF3EA]/40 border-orange-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-[#1F1F1F]">{n.title}</p>
                  <p className="text-[#6B6B6B] mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-neutral-100">
            <h3 className="font-bold text-lg text-[#1F1F1F] mb-4">Add Delivery Address</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1 font-semibold">Street Address / Flat / Building *</label>
                <input
                  type="text"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="E.g. Flat 301, Lakeview Heights"
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1 font-semibold">Area / Locality *</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="E.g. Madhapur, Hitec City"
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={selectedCity}
                    disabled
                    className="w-full p-2.5 bg-neutral-100 border rounded-xl text-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold">PIN Code *</label>
                  <input
                    type="text"
                    value={newPincode}
                    maxLength={6}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-600 mb-1 font-semibold">Contact Phone Number *</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-neutral-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F26B21] text-white font-bold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal for Completed Rentals */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-neutral-100">
            <h3 className="font-bold text-lg text-[#1F1F1F] mb-1">Rate Your Rental Experience</h3>
            <p className="text-xs text-[#6B6B6B] mb-4">Reviews can only be submitted after completing a verified rental.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${reviewRating >= star ? 'fill-amber-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Comment</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the equipment condition and return inspection?"
                  className="w-full p-3 bg-neutral-50 border rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewBookingId(null)}
                  className="px-4 py-2 border rounded-xl text-neutral-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F26B21] text-white text-xs font-bold rounded-xl"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
