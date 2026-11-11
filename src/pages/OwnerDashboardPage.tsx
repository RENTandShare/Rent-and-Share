import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useToast } from '../context/ToastContext';
import { Product, Category, ItemAvailability, BookingStatus } from '../types';
import {
  PlusCircle,
  Package,
  Calendar,
  DollarSign,
  Layers,
  Wrench,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Star,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES: Category[] = [
  'Furniture',
  'Appliances',
  'Electronics',
  'Fitness',
  'Photography',
  'Tools',
  'Events',
  'Agriculture',
];

export const OwnerDashboardPage: React.FC = () => {
  const { user, role, switchRole, selectedCity } = useAuth();
  const {
    products,
    bookings,
    repairTickets,
    reviews,
    saveProductListing,
    deleteProductListing,
    uploadProductImage,
    updateBookingStatus,
    settings,
  } = useMarketplace();
  const { showToast } = useToast();

  const isOwner = role === 'owner' || role === 'admin';

  // Modal State for Add / Edit Listing
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form States for Listing
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Furniture');
  const [formSubcategory, setFormSubcategory] = useState('Beds');
  const [formRentType, setFormRentType] = useState<'monthly' | 'daily'>('monthly');
  const [formRentPrice, setFormRentPrice] = useState<number>(599);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(1199);
  const [formDeposit, setFormDeposit] = useState<number>(1000);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'repairs' | 'earnings'>('listings');

  // Filter items owned by this owner
  // In demo mode, 'owner-1' is the primary owner ID for Venkata Rao
  const ownerId = user?.role === 'owner' ? user.id : 'owner-1';

  const ownerProducts = useMemo(() => {
    return products.filter((p) => p.ownerId === ownerId || user?.role === 'admin');
  }, [products, ownerId, user?.role]);

  const ownerBookings = useMemo(() => {
    return bookings.filter((b) => b.ownerId === ownerId || user?.role === 'admin');
  }, [bookings, ownerId, user?.role]);

  const ownerTickets = useMemo(() => {
    return repairTickets.filter((t) => t.ownerId === ownerId || user?.role === 'admin');
  }, [repairTickets, ownerId, user?.role]);

  // Financial calculations
  const totalGrossRent = ownerBookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalRent, 0);

  const totalCommissionDeducted = Math.round(totalGrossRent * (settings.commissionPercent / 100));
  const netEarnings = totalGrossRent - totalCommissionDeducted;

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('Furniture');
    setFormSubcategory('Living');
    setFormRentType('monthly');
    setFormRentPrice(599);
    setFormOriginalPrice(1199);
    setFormDeposit(1000);
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80');
    setIsListingModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormRentType(p.dailyRent ? 'daily' : 'monthly');
    setFormRentPrice(p.dailyRent || p.monthlyRent || 499);
    setFormOriginalPrice(p.originalPrice);
    setFormDeposit(p.securityDeposit);
    setFormDescription(p.description);
    setFormImageUrl(p.images[0]);
    setIsListingModalOpen(true);
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBrand.trim()) return;

    const prodId = editingProduct ? editingProduct.id : `prod-own-${Date.now()}`;
    const newProd: Product = {
      id: prodId,
      name: formName.trim(),
      brand: formBrand.trim(),
      category: formCategory,
      subcategory: formSubcategory.trim(),
      city: selectedCity,
      description: formDescription.trim(),
      specifications: editingProduct?.specifications || {
        Condition: 'Certified Mint Condition',
        Warranty: 'Free Maintenance Included',
      },
      monthlyRent: formRentType === 'monthly' ? Number(formRentPrice) : undefined,
      dailyRent: formRentType === 'daily' ? Number(formRentPrice) : undefined,
      originalPrice: Number(formOriginalPrice),
      securityDeposit: Number(formDeposit),
      availability: editingProduct?.availability || 'in-stock',
      ownerId: ownerId,
      ownerName: user?.name || 'Venkata Rao Rentals',
      ownerPhone: user?.phone || '+91 98480 22334',
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 1,
      images: [
        formImageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        formImageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        formImageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      ],
      isFreeRepair: true,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    saveProductListing(newProd);
    setIsListingModalOpen(false);
  };

  const handleDirectImageUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadProductImage(productId, file);
    } catch {
      showToast('Upload Failed', 'error', 'Could not upload image. Please try another file.');
    }
  };

  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormImageUrl(reader.result as string);
      showToast('Photo Loaded', 'success', 'Image preview ready for your listing.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Non-Owner Onboarding Alert if viewing as customer */}
      {!isOwner && (
        <div className="bg-[#FFF3EA] border border-orange-200 rounded-3xl p-6 sm:p-8 mb-8 text-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-[#F26B21] uppercase tracking-wider">
              Earn Passive Income
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F1F1F]">
              Have Idle Furniture, Cameras, or Tools?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl">
              List your equipment on Rent and Share. We handle doorstep pickup, tenant KYC verification, 100% free maintenance, and timely payouts.
            </p>
          </div>
          <button
            onClick={() => switchRole('owner')}
            className="px-6 py-3 rounded-2xl bg-[#F26B21] text-white font-bold text-xs sm:text-sm shadow-xl hover:bg-[#D9530F] transition whitespace-nowrap"
          >
            Switch to Owner Demo Account
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
              Equipment Owner Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF3EA] text-[#F26B21]">
              Owner Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
            Manage your inventory, rental bookings, repair alerts, and payouts in {selectedCity}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Equipment
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">My Listings</span>
            <Package className="w-5 h-5 text-[#F26B21]" />
          </div>
          <p className="text-2xl font-black text-[#1F1F1F]">{ownerProducts.length}</p>
          <span className="text-[11px] text-[#1FA463] font-semibold block mt-1">
            {ownerProducts.filter((p) => p.availability === 'in-stock').length} Active & Ready
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Total Bookings</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-[#1F1F1F]">{ownerBookings.length}</p>
          <span className="text-[11px] text-[#6B6B6B] font-semibold block mt-1">
            {ownerBookings.filter((b) => b.status === 'Active').length} Currently Active
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Net Owner Earnings</span>
            <TrendingUp className="w-5 h-5 text-[#1FA463]" />
          </div>
          <p className="text-2xl font-black text-emerald-700">₹{netEarnings}</p>
          <span className="text-[10px] text-neutral-500 block mt-1">
            After {settings.commissionPercent}% platform commission
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Service Tickets</span>
            <Wrench className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#1F1F1F]">{ownerTickets.length}</p>
          <span className="text-[11px] text-[#1FA463] font-semibold block mt-1">
            100% Free Repairs Handled
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'listings', label: `My Equipment (${ownerProducts.length})`, icon: Package },
          { id: 'bookings', label: `Rental Requests (${ownerBookings.length})`, icon: Calendar },
          { id: 'repairs', label: `Repair Alerts (${ownerTickets.length})`, icon: Wrench },
          { id: 'earnings', label: 'Earnings & Commission Breakdown', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab: Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ownerProducts.map((p) => {
              const isDaily = Boolean(p.dailyRent && !p.monthlyRent);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-neutral-100">
                      <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs ${
                        p.availability === 'in-stock' ? 'bg-[#1FA463]' : 'bg-neutral-800'
                      }`}>
                        {p.availability}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#F26B21] uppercase tracking-wider">
                        {p.category} • {p.brand}
                      </span>
                      <h3 className="font-bold text-sm text-[#1F1F1F] line-clamp-1 mt-0.5">{p.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-extrabold text-base text-[#1F1F1F]">
                          ₹{p.monthlyRent || p.dailyRent}
                        </span>
                        <span className="text-xs text-[#6B6B6B]">{isDaily ? '/day' : '/mo'}</span>
                        <span className="text-[11px] text-neutral-400 ml-2">Deposit: ₹{p.securityDeposit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      to={`/product/${p.id}`}
                      className="text-xs font-semibold text-[#F26B21] hover:underline flex items-center gap-1"
                    >
                      View Live <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {/* Replace Photo File Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        id={`upload-card-${p.id}`}
                        className="hidden"
                        onChange={(e) => handleDirectImageUpload(p.id, e)}
                      />
                      <label
                        htmlFor={`upload-card-${p.id}`}
                        className="p-2 rounded-xl text-neutral-600 hover:text-[#F26B21] hover:bg-[#FFF3EA] transition cursor-pointer"
                        title="Upload Custom Image for this Item"
                      >
                        <Upload className="w-4 h-4" />
                      </label>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 rounded-xl text-neutral-600 hover:text-[#F26B21] hover:bg-[#FFF3EA] transition"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProductListing(p.id)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {ownerBookings.length === 0 ? (
            <p className="p-8 text-center bg-white rounded-3xl border text-xs text-neutral-500">
              No booking requests received yet.
            </p>
          ) : (
            ownerBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={b.productImage} alt="" className="w-14 h-14 rounded-2xl object-cover bg-neutral-100" />
                  <div>
                    <span className="text-[10px] font-bold text-[#F26B21] uppercase">Booking ID: {b.id}</span>
                    <h4 className="font-bold text-sm text-[#1F1F1F]">{b.productName}</h4>
                    <p className="text-xs text-[#6B6B6B]">
                      Customer: <strong>{b.userName}</strong> • {b.deliveryAddress.city} ({b.startDate} to {b.endDate})
                    </p>
                    <p className="text-xs text-[#1FA463] font-semibold mt-0.5">
                      Your Earnings: ₹{b.ownerEarnings} (Commission: ₹{b.platformCommission})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    b.status === 'Active' ? 'bg-emerald-100 text-[#1FA463]' : 'bg-[#FFF3EA] text-[#F26B21]'
                  }`}>
                    {b.status}
                  </span>

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'Delivered')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {b.status === 'Delivered' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'Active')}
                      className="px-3 py-1.5 rounded-xl bg-[#F26B21] text-white text-xs font-bold"
                    >
                      Activate Rental
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Repairs */}
      {activeTab === 'repairs' && (
        <div className="space-y-4">
          {ownerTickets.length === 0 ? (
            <p className="p-8 text-center bg-white rounded-3xl border text-xs text-neutral-500">
              No repair tickets reported for your equipment.
            </p>
          ) : (
            ownerTickets.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-[#F26B21]" />
                    <div>
                      <p className="font-bold text-xs text-[#1F1F1F]">{t.productName} (Ticket #{t.id})</p>
                      <p className="text-[11px] text-[#6B6B6B]">Issue: {t.issueType} • Reported by {t.userName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF3EA] text-[#F26B21]">
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B] bg-neutral-50 p-3 rounded-xl">{t.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Earnings */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Earnings & Platform Commission Breakdown
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-neutral-50">
              <span className="text-xs text-neutral-500 font-semibold uppercase">Gross Rental Volume</span>
              <p className="text-2xl font-black text-[#1F1F1F] mt-1">₹{totalGrossRent}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FFF3EA]">
              <span className="text-xs text-[#D9530F] font-semibold uppercase">Platform Fee ({settings.commissionPercent}%)</span>
              <p className="text-2xl font-black text-[#D9530F] mt-1">-₹{totalCommissionDeducted}</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50">
              <span className="text-xs text-[#1FA463] font-semibold uppercase">Net Owner Payout</span>
              <p className="text-2xl font-black text-[#1FA463] mt-1">₹{netEarnings}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-neutral-200 text-xs text-[#6B6B6B] space-y-1">
            <p className="font-bold text-[#1F1F1F]">Payout Schedule & Bank Settlement:</p>
            <p>Rental payouts are directly disbursed via NEFT/IMPS to your registered Indian bank account on the 1st and 15th of every month. Zero gateway charges on owner disbursements.</p>
          </div>
        </div>
      )}

      {/* Add / Edit Listing Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsListingModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-[#1F1F1F] mb-4">
              {editingProduct ? 'Edit Equipment Listing' : 'List New Rental Equipment'}
            </h3>

            <form onSubmit={handleSaveListing} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Equipment Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="E.g. Sony Alpha A7 IV Mirrorless Camera"
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Brand *</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="E.g. Sony, Bosch, Urban Ladder"
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Rent Type</label>
                  <select
                    value={formRentType}
                    onChange={(e) => setFormRentType(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  >
                    <option value="monthly">Per Month (INR)</option>
                    <option value="daily">Per Day (INR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Rent Amount (₹) *</label>
                  <input
                    type="number"
                    value={formRentPrice}
                    onChange={(e) => setFormRentPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Security Deposit (₹) *</label>
                  <input
                    type="number"
                    value={formDeposit}
                    onChange={(e) => setFormDeposit(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Original Retail Price (for strikethrough)</label>
                <input
                  type="number"
                  value={formOriginalPrice}
                  onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Product Photo *</label>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <label className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl cursor-pointer font-bold text-xs flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleModalFileUpload}
                      />
                    </label>
                    <span className="text-[11px] text-neutral-400">or enter direct image URL:</span>
                  </div>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://... or upload photo above"
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                    required
                  />
                  {formImageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-12 h-9 object-cover rounded-lg bg-neutral-200"
                      />
                      <span className="text-[11px] text-emerald-600 font-semibold">✓ Image Preview Loaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Key features, specifications, and included accessories."
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsListingModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F26B21] text-white font-bold rounded-xl hover:bg-[#D9530F] transition"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
