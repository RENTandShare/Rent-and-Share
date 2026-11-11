import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Package,
  Calendar,
  Percent,
  RefreshCw,
  FileText,
  Wrench,
  Star,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Lock,
  Code,
  Sliders,
  Sparkles,
  Upload,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const {
    products,
    bookings,
    repairTickets,
    kycRecords,
    reviews,
    settings,
    seedDefaultProducts,
    updatePlatformSettings,
    deleteProductListing,
    uploadProductImage,
    updateBookingStatus,
    updateRepairTicketStatus,
    reviewKycRecord,
  } = useMarketplace();
  const { showToast } = useToast();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'listings' | 'bookings' | 'repairs' | 'kyc' | 'settings' | 'security'
  >('overview');

  // Commission % setting state
  const [commissionInput, setCommissionInput] = useState(settings.commissionPercent);
  const [platformFeeInput, setPlatformFeeInput] = useState(settings.platformFee);

  // Firestore Rules Raw Text
  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() { return request.auth != null; }
    function isUser(userId) { return isAuthenticated() && request.auth.uid == userId; }
    function isAdmin() { return isAuthenticated() && (request.auth.token.role == 'admin' || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'); }
    function isOwner() { return isAuthenticated() && (request.auth.token.role == 'owner' || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'owner' || isAdmin()); }

    match /users/{userId} {
      allow read: if isUser(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isUser(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    match /products/{productId} {
      allow read: if true;
      allow create: if isOwner() && (request.resource.data.ownerId == request.auth.uid || isAdmin());
      allow update, delete: if isAdmin() || (isOwner() && resource.data.ownerId == request.auth.uid);
    }

    match /bookings/{bookingId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || resource.data.ownerId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.userId == request.auth.uid || resource.data.ownerId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }

    match /repairTickets/{ticketId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || resource.data.ownerId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin() || (isOwner() && resource.data.ownerId == request.auth.uid);
    }

    match /kyc/{kycId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
  }
}`;

  // Role Gate: Only Admin!
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#1F1F1F]">Admin Route Protected</h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-md mx-auto">
          Route <code>/admin</code> is strictly restricted to administrator accounts.
          As this is currently running in local storage demo mode, you can test the admin capabilities with 1 click:
        </p>
        <button
          onClick={() => switchRole('admin')}
          className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-xl transition"
        >
          Switch to Admin SuperUser Role
        </button>
      </div>
    );
  }

  // Calculate Metrics
  const totalVolume = bookings.reduce((sum, b) => sum + b.totalPaid, 0);
  const totalCommissionEarned = bookings.reduce((sum, b) => sum + b.platformCommission, 0);
  const pendingBookings = bookings.filter((b) => b.status === 'Pending' || b.status === 'Confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed' || b.status === 'Active').length;
  const pendingKyc = kycRecords.filter((k) => k.status === 'Pending').length;
  const openRepairs = repairTickets.filter((r) => r.status !== 'Resolved' && r.status !== 'Replaced').length;

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      ...settings,
      commissionPercent: Number(commissionInput),
      platformFee: Number(platformFeeInput),
    });
  };

  const handleAdminImageUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadProductImage(productId, file);
    } catch {
      showToast('Upload Failed', 'error', 'Could not upload photo.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
              Platform Admin Control Panel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
            Full marketplace oversight: users, equipment approvals, KYC verification & commission management.
          </p>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={seedDefaultProducts}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            title="Seed / Reset 120+ Products"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Seed 120+ Products
          </button>
        </div>
      </div>

      {/* 5 High-Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 my-8">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Live Listings</span>
            <Package className="w-4 h-4 text-[#F26B21]" />
          </div>
          <p className="text-2xl font-black text-[#1F1F1F]">{products.length}</p>
          <span className="text-[10px] text-neutral-500 block mt-1">Across 8 Categories</span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Total Bookings</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-[#1F1F1F]">{bookings.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            {pendingBookings} In Pipeline
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Commission Earned</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">₹{totalCommissionEarned}</p>
          <span className="text-[10px] text-neutral-500 block mt-1">
            Rate: {settings.commissionPercent}%
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Pending KYC</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingKyc}</p>
          <span className="text-[10px] text-amber-600 font-bold block mt-1">
            Requires Approval
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex justify-between items-center text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Active Repairs</span>
            <Wrench className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{openRepairs}</p>
          <span className="text-[10px] text-neutral-500 block mt-1">
            {repairTickets.length} Total Raised
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'overview', label: 'Overview & Reports', icon: TrendingUp },
          { id: 'listings', label: `Manage Listings (${products.length})`, icon: Package },
          { id: 'bookings', label: `All Bookings (${bookings.length})`, icon: Calendar },
          { id: 'repairs', label: `Repair Tickets (${repairTickets.length})`, icon: Wrench },
          { id: 'kyc', label: `KYC Queue (${kycRecords.length})`, icon: FileText },
          { id: 'settings', label: 'Commission & Settings', icon: Sliders },
          { id: 'security', label: 'Firestore Security Rules', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview & Visual Analytics */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution Chart */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="font-extrabold text-sm text-[#1F1F1F] mb-4">
                Equipment Distribution by Category
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { cat: 'Furniture', count: products.filter((p) => p.category === 'Furniture').length, color: 'bg-orange-500' },
                  { cat: 'Appliances', count: products.filter((p) => p.category === 'Appliances').length, color: 'bg-sky-500' },
                  { cat: 'Electronics', count: products.filter((p) => p.category === 'Electronics').length, color: 'bg-purple-500' },
                  { cat: 'Fitness', count: products.filter((p) => p.category === 'Fitness').length, color: 'bg-emerald-500' },
                  { cat: 'Photography', count: products.filter((p) => p.category === 'Photography').length, color: 'bg-amber-500' },
                  { cat: 'Tools', count: products.filter((p) => p.category === 'Tools').length, color: 'bg-indigo-500' },
                  { cat: 'Events', count: products.filter((p) => p.category === 'Events').length, color: 'bg-rose-500' },
                  { cat: 'Agriculture', count: products.filter((p) => p.category === 'Agriculture').length, color: 'bg-teal-500' },
                ].map((item) => {
                  const percent = Math.round((item.count / products.length) * 100);
                  return (
                    <div key={item.cat} className="space-y-1">
                      <div className="flex justify-between text-neutral-600 font-medium">
                        <span>{item.cat}</span>
                        <span>{item.count} items ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Revenue & Commission Health */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-[#1F1F1F]">
                Revenue Model & Commission Insights
              </h3>
              <div className="p-4 rounded-2xl bg-purple-50 text-xs text-purple-900 space-y-1">
                <p className="font-bold text-sm">Active Platform Commission: {settings.commissionPercent}%</p>
                <p>Platform automatically withholds {settings.commissionPercent}% from every monthly rental before disbursing to equipment owners.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-neutral-50">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Gross Transaction Value</span>
                  <p className="text-xl font-black text-[#1F1F1F] mt-1">₹{totalVolume}</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Platform Retained Profit</span>
                  <p className="text-xl font-black text-purple-700 mt-1">₹{totalCommissionEarned}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF3EA] text-xs text-[#D9530F] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Zero default rates: Customer KYC and 100% security deposit guarantee owner equipment security.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Manage Listings */}
      {activeAdminTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#1F1F1F]">All Marketplace Listings ({products.length})</h3>
            <span className="text-xs text-[#6B6B6B]">Showing all approved partner inventory</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Rent</th>
                  <th className="p-3.5">Deposit</th>
                  <th className="p-3.5">Owner</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.slice(0, 25).map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/60">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover bg-neutral-100" />
                        <div>
                          <p className="font-bold text-[#1F1F1F] line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-[#F26B21] font-semibold">{p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-neutral-600">{p.category}</td>
                    <td className="p-3.5 font-bold text-[#1F1F1F]">₹{p.monthlyRent || p.dailyRent}</td>
                    <td className="p-3.5 text-neutral-600">₹{p.securityDeposit}</td>
                    <td className="p-3.5 text-neutral-600 truncate max-w-[120px]">{p.ownerName}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.availability === 'in-stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {p.availability}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          id={`admin-img-${p.id}`}
                          className="hidden"
                          onChange={(e) => handleAdminImageUpload(p.id, e)}
                        />
                        <label
                          htmlFor={`admin-img-${p.id}`}
                          className="text-purple-700 hover:text-purple-900 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                          title="Upload replacement photo"
                        >
                          <Upload className="w-3 h-3" /> Photo
                        </label>
                        <button
                          onClick={() => deleteProductListing(p.id)}
                          className="text-rose-500 hover:text-rose-700 font-semibold text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: KYC Approvals */}
      {activeAdminTab === 'kyc' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Tenant KYC Document Queue
          </h3>
          <div className="space-y-4">
            {kycRecords.map((kyc) => (
              <div
                key={kyc.id}
                className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1F1F1F]">{kyc.userName}</span>
                    <span className="text-xs text-[#6B6B6B]">({kyc.userEmail})</span>
                  </div>
                  <p className="text-xs text-[#6B6B6B]">
                    Document: <strong>{kyc.documentType}</strong> • Number: <span className="font-mono text-[#1F1F1F]">{kyc.documentNumber}</span>
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Submitted: {new Date(kyc.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={kyc.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#F26B21] underline"
                  >
                    Preview ID Proof
                  </a>

                  {kyc.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewKycRecord(kyc.id, 'Approved')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewKycRecord(kyc.id, 'Rejected', 'Image blurred')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      kyc.status === 'Approved' ? 'bg-emerald-100 text-[#1FA463]' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {kyc.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: All Bookings */}
      {activeAdminTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Marketplace Rental Orders ({bookings.length})
          </h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#F26B21]">{b.id}</span>
                  <p className="font-bold text-[#1F1F1F] text-sm mt-0.5">{b.productName}</p>
                  <p className="text-[#6B6B6B]">
                    Tenant: {b.userName} • Owner: {b.ownerName}
                  </p>
                  <p className="text-[#1FA463] font-semibold mt-0.5">
                    Total: ₹{b.totalPaid} (Commission: ₹{b.platformCommission})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                    className="p-1.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Active">Active</option>
                    <option value="Return Requested">Return Requested</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Repair Tickets Management */}
      {activeAdminTab === 'repairs' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Maintenance & Replacement Ticket Dispatch
          </h3>
          <div className="space-y-4">
            {repairTickets.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm text-[#1F1F1F]">Ticket #{t.id} - {t.productName}</span>
                    <p className="text-[#6B6B6B]">Issue: <strong>{t.issueType}</strong> • Customer: {t.userName}</p>
                  </div>
                  <span className="font-bold px-3 py-1 rounded-full bg-[#FFF3EA] text-[#F26B21]">
                    {t.status}
                  </span>
                </div>

                <p className="text-neutral-700 bg-white p-3 rounded-xl border border-neutral-200">
                  {t.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200 items-center justify-between">
                  <span className="text-neutral-500">
                    Preferred: {t.preferredDate} ({t.preferredTimeSlot.split(' ')[0]})
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateRepairTicketStatus(t.id, {
                        status: 'Technician Assigned',
                        technicianName: 'Suresh Kumar (Senior Technician)',
                        technicianPhone: '+91 98490 88771',
                      })}
                      className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold"
                    >
                      Assign Tech
                    </button>
                    <button
                      onClick={() => updateRepairTicketStatus(t.id, { status: 'Resolved' })}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => updateRepairTicketStatus(t.id, { status: 'Replacement Approved' })}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                    >
                      Approve Replacement
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Settings (Commission %) */}
      {activeAdminTab === 'settings' && (
        <div className="max-w-xl bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <h3 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Marketplace Commission & Fee Settings
          </h3>
          <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Platform Commission Rate (% deducted from owner rental payouts)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(Number(e.target.value))}
                  className="w-28 p-2.5 bg-neutral-50 border rounded-xl font-bold text-sm"
                  required
                />
                <span className="font-bold text-sm text-neutral-600">% (Current default: 10%)</span>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Flat Platform Convenience Fee (₹ added to customer order)
              </label>
              <input
                type="number"
                value={platformFeeInput}
                onChange={(e) => setPlatformFeeInput(Number(e.target.value))}
                className="w-28 p-2.5 bg-neutral-50 border rounded-xl font-bold text-sm"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition"
              >
                Update Platform Rates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Security Rules Viewer */}
      {activeAdminTab === 'security' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" /> firestore.rules File Viewer
              </h3>
              <p className="text-xs text-[#6B6B6B]">Role-based access control protecting Customer, Owner & Admin boundaries</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Active Security Profile
            </span>
          </div>

          <div className="bg-neutral-900 rounded-2xl p-5 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
            <pre className="leading-relaxed">{firestoreRulesText}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
