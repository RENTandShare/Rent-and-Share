import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createSvgFallback } from '../data/productImages';
import { ProductCard } from '../components/common/ProductCard';
import {
  ShieldCheck,
  Star,
  Heart,
  Truck,
  RotateCcw,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
  Phone,
  Sparkles,
  User,
  X,
  Share2,
  Upload,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, isWishlisted, toggleWishlist, calculateProductPricing, reviews, submitReview, uploadProductImage } = useMarketplace();
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === id);

  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});
  const isDaily = Boolean(product?.dailyRent && !product?.monthlyRent);

  // Monthly or Daily Tenures
  const [selectedTenureMonths, setSelectedTenureMonths] = useState<number>(3);
  const [selectedTenureDays, setSelectedTenureDays] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Pincode Checker
  const [pincode, setPincode] = useState('500033');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; serviceable: boolean; message: string }>({
    checked: true,
    serviceable: true,
    message: 'Express 24-hr delivery available to Jubilee Hills, Hyderabad',
  });

  // Owner Contact Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [ownerMessage, setOwnerMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Customer Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const canManageProduct = role === 'admin' || (role === 'owner' && (user?.id === product?.ownerId || !product?.ownerId || product?.ownerId === 'owner-1'));

  const handleUploadReplacement = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadProductImage(product.id, file, activeImageIndex);
    } catch {
      showToast('Upload Failed', 'error', 'Could not upload replacement photo.');
    }
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#1F1F1F]">Product Not Found</h2>
        <p className="text-sm text-[#6B6B6B]">The equipment you are looking for is no longer active.</p>
        <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-[#F26B21] text-white text-xs font-bold inline-block">
          Explore Other Rentals
        </Link>
      </div>
    );
  }

  // Dynamic Pricing Calculation
  const pricing = calculateProductPricing(
    product,
    isDaily ? undefined : selectedTenureMonths,
    isDaily ? selectedTenureDays : undefined
  );

  // Handle Image Fallback
  const handleImgError = (idx: number) => {
    setImageErrorMap((prev) => ({ ...prev, [idx]: true }));
  };

  const currentDisplayImage = imageErrorMap[activeImageIndex]
    ? createSvgFallback(product.name, product.category)
    : product.images[activeImageIndex] || product.images[0];

  const wishlisted = isWishlisted(product.id);

  // Pincode validation
  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({
        checked: true,
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    const firstTwo = pincode.trim().substring(0, 2);
    // Common Indian hub ranges: 50 (Hyd), 56 (Blr), 40 (Mum), 11 (Delhi), 41 (Pune), 60 (Chennai), 52 (Vijayawada), 53 (Vizag)
    const validHubs = ['50', '51', '52', '53', '56', '57', '40', '41', '11', '12', '20', '60'];
    const isServiceable = validHubs.includes(firstTwo);

    if (isServiceable) {
      setPincodeStatus({
        checked: true,
        serviceable: true,
        message: `✓ PIN ${pincode} is serviceable! Guaranteed doorstep delivery & technician setup within 24-48 hours.`,
      });
      showToast('Delivery Available', 'success', 'Standard installation included for free.');
    } else {
      setPincodeStatus({
        checked: true,
        serviceable: false,
        message: `Currently expanding to PIN ${pincode}. Contact support for custom freight delivery.`,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      isDaily ? undefined : selectedTenureMonths,
      isDaily ? selectedTenureDays : undefined,
      startDate
    );
  };

  const handleRentNow = () => {
    addToCart(
      product,
      isDaily ? undefined : selectedTenureMonths,
      isDaily ? selectedTenureDays : undefined,
      startDate
    );
    navigate('/cart');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerMessage.trim()) return;
    setMessageSent(true);
    showToast('Message Sent to Owner', 'success', `${product.ownerName} will respond to you shortly via phone or notifications.`);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setMessageSent(false);
      setOwnerMessage('');
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    submitReview(product.id, `BK-MANUAL-${Date.now()}`, newReviewRating, newReviewComment.trim());
    setIsReviewModalOpen(false);
    setNewReviewComment('');
  };

  // Similar Products
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-6">
        <Link to="/" className="hover:text-[#F26B21]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link to={`/explore?category=${product.category}`} className="hover:text-[#F26B21]">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[#1F1F1F] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: 4:3 Gallery & Image Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
            <img
              src={currentDisplayImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => handleImgError(activeImageIndex)}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-xs transition ${
                wishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-neutral-600 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Free Repair Tag */}
            {product.isFreeRepair && (
              <div className="absolute top-4 left-4 bg-[#1FA463] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <ShieldCheck className="w-4 h-4" /> Free Repair & Replacement Covered
              </div>
            )}
          </div>

          {/* Owner & Admin Photo Upload Quick Action */}
          {canManageProduct && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 px-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-900">Owner & Admin Action:</span>
                <span className="text-purple-700">Upload replacement photo for slot #{activeImageIndex + 1}</span>
              </div>
              <label className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer flex items-center gap-1.5 transition shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Replace Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadReplacement}
                />
              </label>
            </div>
          )}

          {/* Thumbnails (3+ images guaranteed) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {product.images.map((img, idx) => {
              const hasErr = imageErrorMap[idx];
              const thumbSrc = hasErr ? createSvgFallback(product.name, product.category) : img;
              const isSelected = activeImageIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-4/3 rounded-2xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-[#F26B21] ring-2 ring-[#F26B21]/20 scale-102'
                      : 'border-neutral-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumbSrc}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={() => handleImgError(idx)}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Free Repair Guarantee Callout Banner */}
          <div className="bg-[#FFF3EA] rounded-2xl p-5 border border-orange-200/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1FA463] text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#1F1F1F]">
                Rent and Share Complete Protection Guarantee
              </h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                100% Free repair service for all normal wear and tear. If an issue cannot be rectified by our technician within 48 hours, we provide an instant replacement unit at zero additional cost.
              </p>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-base text-[#1F1F1F] mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 flex justify-between">
                <span className="text-[#6B6B6B]">Brand</span>
                <span className="font-bold text-[#1F1F1F]">{product.brand}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 flex justify-between">
                <span className="text-[#6B6B6B]">Category</span>
                <span className="font-bold text-[#1F1F1F]">{product.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 flex justify-between">
                <span className="text-[#6B6B6B]">Subcategory</span>
                <span className="font-bold text-[#1F1F1F]">{product.subcategory}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 flex justify-between">
                <span className="text-[#6B6B6B]">Operational Hub</span>
                <span className="font-bold text-[#F26B21]">{product.city}</span>
              </div>
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-neutral-50 flex justify-between">
                  <span className="text-[#6B6B6B]">{key}</span>
                  <span className="font-bold text-[#1F1F1F] text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pricing, Tenure Selector, Pincode & Booking Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Brand */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-1">
                <span className="text-[#F26B21] font-bold uppercase tracking-wider">{product.brand}</span>
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full font-medium">
                  {product.availability === 'in-stock' ? 'In Stock • Ready to Ship' : 'Limited Availability'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F1F1F] leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 bg-emerald-50 text-[#1FA463] text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                  <span>{product.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-[#1FA463]" />
                </div>
                <span className="text-xs text-[#6B6B6B]">{product.reviewCount} customer reviews</span>
                <span className="text-xs text-[#1FA463] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Quality Verified
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6B6B6B] leading-relaxed pt-2 border-t border-neutral-100">
              {product.description}
            </p>

            {/* Interactive Tenure Selector */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F26B21]" /> Select Rental Duration
                </label>
                <span className="text-[11px] font-semibold text-[#1FA463]">
                  Longer commitment = Cheaper rent!
                </span>
              </div>

              {isDaily ? (
                // Daily Rental Tenure Selector
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 1, label: '1 Day', disc: 'Base' },
                    { days: 3, label: '3 Days', disc: '10% OFF' },
                    { days: 7, label: '1 Week', disc: '20% OFF' },
                    { days: 14, label: '2 Weeks', disc: '30% OFF' },
                  ].map((t) => {
                    const isSelected = selectedTenureDays === t.days;
                    return (
                      <button
                        key={t.days}
                        onClick={() => setSelectedTenureDays(t.days)}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-[#F26B21] bg-[#FFF3EA] shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <p className={`font-bold text-xs ${isSelected ? 'text-[#F26B21]' : 'text-[#1F1F1F]'}`}>
                          {t.label}
                        </p>
                        <span className="text-[10px] text-[#1FA463] font-semibold block mt-0.5">
                          {t.disc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Monthly Rental Tenure Selector: 3, 6, 9, 12 months
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { months: 3, label: '3 Months', disc: '100% Base' },
                    { months: 6, label: '6 Months', disc: '10% OFF' },
                    { months: 9, label: '9 Months', disc: '18% OFF' },
                    { months: 12, label: '12+ Months', disc: '25% OFF' },
                  ].map((t) => {
                    const isSelected = selectedTenureMonths === t.months;
                    return (
                      <button
                        key={t.months}
                        onClick={() => setSelectedTenureMonths(t.months)}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-[#F26B21] bg-[#FFF3EA] shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <p className={`font-bold text-xs ${isSelected ? 'text-[#F26B21]' : 'text-[#1F1F1F]'}`}>
                          {t.label}
                        </p>
                        <span className="text-[10px] text-[#1FA463] font-semibold block mt-0.5">
                          {t.disc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Delivery Start Date Picker */}
            <div className="pt-3 border-t border-neutral-100">
              <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                Earliest Delivery Date
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#F26B21]"
              />
            </div>

            {/* Delivery Pincode Check */}
            <div className="pt-3 border-t border-neutral-100">
              <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                Check Delivery & Installation Pincode
              </label>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Indian Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#F26B21]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold"
                >
                  Check
                </button>
              </form>
              {pincodeStatus.checked && (
                <p className={`text-xs mt-1.5 leading-snug ${pincodeStatus.serviceable ? 'text-[#1FA463]' : 'text-rose-500'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* Transparent Price Breakdown (No Hidden Charges) */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#1F1F1F] flex items-center justify-between">
              <span>Transparent Price Breakdown</span>
              <span className="text-[11px] font-semibold text-[#1FA463] bg-emerald-50 px-2 py-0.5 rounded">
                No Hidden Charges
              </span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-neutral-100 pt-1">
              <div className="flex justify-between pt-1">
                <span className="text-[#6B6B6B]">
                  {pricing.isMonthly ? `Monthly Rent (${pricing.tenureDuration} months)` : `Daily Rent (${pricing.tenureDuration} days)`}
                </span>
                <span className="font-bold text-[#1F1F1F]">
                  ₹{pricing.discountedRent} {pricing.isMonthly ? '/mo' : '/day'}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-[#6B6B6B]">
                  Total Rental Fee
                </span>
                <span className="font-semibold text-[#1F1F1F]">
                  ₹{pricing.totalRentalPrice}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-[#6B6B6B] flex items-center gap-1">
                  Refundable Security Deposit
                  <span className="text-[10px] text-[#1FA463] font-bold">(100% Refundable)</span>
                </span>
                <span className="font-bold text-emerald-700">
                  ₹{pricing.securityDeposit}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-[#6B6B6B]">Delivery & Technician Setup</span>
                <span className={pricing.deliveryFee === 0 ? 'text-[#1FA463] font-bold' : 'text-[#1F1F1F]'}>
                  {pricing.deliveryFee === 0 ? 'FREE' : `₹${pricing.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-[#6B6B6B]">Platform Service Fee</span>
                <span className="text-[#1F1F1F]">₹{pricing.platformFee}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-[#6B6B6B]">GST (18% on Rental & Service)</span>
                <span className="text-[#1F1F1F]">₹{pricing.gstAmount}</span>
              </div>

              <div className="flex justify-between pt-3 font-extrabold text-sm sm:text-base text-[#1F1F1F]">
                <span>Total Payable Now</span>
                <span className="text-[#F26B21]">₹{pricing.totalPayableNow}</span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Rent Now */}
            <div className="pt-4 grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-2xl border-2 border-[#F26B21] text-[#F26B21] hover:bg-[#FFF3EA] font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
              >
                Add to Cart
              </button>
              <button
                onClick={handleRentNow}
                className="py-3 px-4 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#D9530F] font-bold flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1F1F1F]">{product.ownerName || 'Verified Equipment Partner'}</p>
                <p className="text-[11px] text-[#6B6B6B]">KYC Verified Partner • {product.city}</p>
              </div>
            </div>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-neutral-300 hover:border-[#F26B21] text-[#1F1F1F] text-xs font-semibold transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#F26B21]" /> Contact
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-[#1F1F1F]">
              Ratings & Reviews ({product.reviewCount + productReviews.length})
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-sm text-[#1F1F1F]">{product.rating} out of 5</span>
            </div>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition"
          >
            Leave a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="mt-6 space-y-4">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#1F1F1F]">{rev.userName}</span>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#6B6B6B] pt-1">{rev.comment}</p>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-neutral-50 text-xs text-neutral-600">
              <p className="font-medium text-[#1F1F1F]">"Item arrived in immaculate factory condition with sealed packing. Free installation took only 15 minutes."</p>
              <p className="text-[11px] text-neutral-400 mt-1">Verified Renter • Hyderabad</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Equipment */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-[#1F1F1F]">Similar Equipment You May Like</h3>
            <Link to={`/explore?category=${product.category}`} className="text-xs font-semibold text-[#F26B21]">
              View All {product.category} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Contact Owner Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-neutral-100">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-[#1F1F1F] mb-1">
              Contact Equipment Owner
            </h3>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Send a query to {product.ownerName} regarding {product.name}.
            </p>

            {messageSent ? (
              <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1FA463] mx-auto" />
                <p className="font-bold text-sm text-[#1FA463]">Message Delivered!</p>
                <p className="text-xs text-[#6B6B6B]">The owner has received your inquiry.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Your Question or Note</label>
                  <textarea
                    rows={4}
                    value={ownerMessage}
                    onChange={(e) => setOwnerMessage(e.target.value)}
                    placeholder="E.g. Is quick 2-day delivery possible? Can I see additional photos of the item?"
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#F26B21]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F26B21] text-white text-xs font-bold hover:bg-[#D9530F] transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-neutral-100">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-[#1F1F1F] mb-1">Leave a Review</h3>
            <p className="text-xs text-[#6B6B6B] mb-4">Share your rental experience for {product.name}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${newReviewRating >= star ? 'fill-amber-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1F1F] mb-1">Your Review</label>
                <textarea
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="How was the item condition, delivery punctuality, and functionality?"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#F26B21]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F26B21] text-white text-xs font-bold hover:bg-[#D9530F] transition"
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
