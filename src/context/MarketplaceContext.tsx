import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Product,
  CartItem,
  Booking,
  RepairTicket,
  KycRecord,
  Review,
  PlatformSettings,
  AppNotification,
  BookingStatus,
  ItemAvailability,
  DeliveryAddress,
  TicketIssueType,
} from '../types';
import { storageService, DEFAULT_SETTINGS } from '../services/storage';
import { firestoreService } from '../services/firestoreService';
import { isFirebaseConfigured, auth } from '../services/firebase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface PriceCalculation {
  baseRent: number;
  discountedRent: number;
  tenureDuration: number;
  isMonthly: boolean;
  totalRentalPrice: number;
  securityDeposit: number;
  deliveryFee: number;
  platformFee: number;
  gstAmount: number;
  totalPayableNow: number;
  ownerEarnings: number;
  platformCommission: number;
}

interface CreateBookingParams {
  productId: string;
  startDate: string;
  endDate: string;
  tenureMonths?: number;
  tenureDays?: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  notes?: string;
}

interface RaiseRepairParams {
  bookingId: string;
  issueType: TicketIssueType;
  description: string;
  preferredDate: string;
  preferredTimeSlot: string;
  mediaUrl?: string;
}

interface MarketplaceContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  bookings: Booking[];
  repairTickets: RepairTicket[];
  kycRecords: KycRecord[];
  reviews: Review[];
  settings: PlatformSettings;
  notifications: AppNotification[];
  // Cart & Wishlist
  addToCart: (
    product: Product,
    tenureMonths?: number,
    tenureDays?: number,
    startDate?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartTenure: (productId: string, tenureMonths?: number, tenureDays?: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  // Calculations
  calculateProductPricing: (
    product: Product,
    tenureMonths?: number,
    tenureDays?: number
  ) => PriceCalculation;
  // Bookings
  createBooking: (params: CreateBookingParams) => Promise<{ success: boolean; bookingId?: string; error?: string }>;
  cancelBooking: (bookingId: string) => void;
  extendBookingTenure: (bookingId: string, additionalMonths: number) => void;
  requestReturnBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  // Repairs
  raiseRepairTicket: (params: RaiseRepairParams) => Promise<RepairTicket>;
  updateRepairTicketStatus: (
    ticketId: string,
    updates: Partial<RepairTicket>
  ) => void;
  // KYC
  reviewKycRecord: (kycId: string, status: KycRecord['status'], reason?: string) => void;
  // Admin & Owner
  seedDefaultProducts: () => void;
  updatePlatformSettings: (settings: PlatformSettings) => void;
  saveProductListing: (product: Product) => void;
  deleteProductListing: (productId: string) => void;
  uploadProductImage: (productId: string, file: File, imageIndex?: number) => Promise<string>;
  submitReview: (productId: string, bookingId: string, rating: number, comment: string) => void;
  markNotificationRead: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  const isFirebaseActive = isFirebaseConfigured();

  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => storageService.getWishlist());
  const [bookings, setBookings] = useState<Booking[]>(() => storageService.getBookings());
  const [repairTickets, setRepairTickets] = useState<RepairTicket[]>(() => storageService.getRepairTickets());
  const [kycRecords, setKycRecords] = useState<KycRecord[]>(() => storageService.getKycRecords());
  const [reviews, setReviews] = useState<Review[]>(() => storageService.getReviews());
  const [settings, setSettings] = useState<PlatformSettings>(() => storageService.getSettings());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storageService.getNotifications(user?.id));

  // Sync products from Firestore or bootstrap
  useEffect(() => {
    if (isFirebaseActive) {
      const unsubProducts = firestoreService.listenProducts(async (remoteProducts) => {
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          storageService.saveProductList(remoteProducts);
        } else {
          // If empty, seed initial catalog
          const localProds = storageService.getProducts();
          try {
            await firestoreService.seedProducts(localProds);
          } catch (e) {
            console.warn('Initial seed write failed:', e);
          }
        }
      });
      return () => unsubProducts();
    }
  }, [isFirebaseActive]);

  // Sync Bookings from Firestore when authenticated in Firebase
  useEffect(() => {
    if (isFirebaseActive && auth?.currentUser) {
      try {
        const unsub = firestoreService.listenBookings(auth.currentUser.uid, role, (remoteBookings) => {
          if (remoteBookings.length > 0) {
            setBookings(remoteBookings);
            remoteBookings.forEach((b) => storageService.saveBooking(b));
          }
        });
        return () => unsub();
      } catch (e) {
        console.warn('Error listening to remote bookings:', e);
      }
    }
  }, [isFirebaseActive, user?.id, role]);

  // Sync Repair Tickets from Firestore
  useEffect(() => {
    if (isFirebaseActive && auth?.currentUser) {
      try {
        const unsub = firestoreService.listenRepairTickets(auth.currentUser.uid, role, (remoteTickets) => {
          if (remoteTickets.length > 0) {
            setRepairTickets(remoteTickets);
            remoteTickets.forEach((t) => storageService.saveRepairTicket(t));
          }
        });
        return () => unsub();
      } catch (e) {
        console.warn('Error listening to remote repair tickets:', e);
      }
    }
  }, [isFirebaseActive, user?.id, role]);

  // Sync KYC Records from Firestore
  useEffect(() => {
    if (isFirebaseActive && auth?.currentUser) {
      try {
        const unsub = firestoreService.listenKycRecords(auth.currentUser.uid, role, (remoteKyc) => {
          if (remoteKyc.length > 0) {
            setKycRecords(remoteKyc);
            remoteKyc.forEach((k) => storageService.saveKycRecord(k));
          }
        });
        return () => unsub();
      } catch (e) {
        console.warn('Error listening to remote KYC records:', e);
      }
    }
  }, [isFirebaseActive, user?.id, role]);

  // Sync to storage on change
  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    storageService.saveWishlist(wishlist);
  }, [wishlist]);

  // Dynamic Tenure Discount Rules
  const calculateProductPricing = useCallback(
    (product: Product, tenureMonths: number = 3, tenureDays?: number): PriceCalculation => {
      const isDaily = Boolean(product.dailyRent && !product.monthlyRent);

      if (isDaily && product.dailyRent) {
        const days = tenureDays || 1;
        let discountMultiplier = 1.0;
        if (days >= 14) discountMultiplier = 0.70;
        else if (days >= 7) discountMultiplier = 0.80;
        else if (days >= 3) discountMultiplier = 0.90;

        const effectiveDaily = Math.round(product.dailyRent * discountMultiplier);
        const totalRent = effectiveDaily * days;
        const securityDeposit = product.securityDeposit;
        const deliveryFee = totalRent >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
        const platformFee = settings.platformFee;
        const taxableAmount = totalRent + platformFee;
        const gstAmount = Math.round(taxableAmount * (settings.gstPercent / 100));
        const totalPayableNow = totalRent + securityDeposit + deliveryFee + platformFee + gstAmount;

        const platformCommission = Math.round(totalRent * (settings.commissionPercent / 100));
        const ownerEarnings = totalRent - platformCommission;

        return {
          baseRent: product.dailyRent,
          discountedRent: effectiveDaily,
          tenureDuration: days,
          isMonthly: false,
          totalRentalPrice: totalRent,
          securityDeposit,
          deliveryFee,
          platformFee,
          gstAmount,
          totalPayableNow,
          ownerEarnings,
          platformCommission,
        };
      }

      // Default Monthly
      const baseMonthly = product.monthlyRent || 449;
      const months = tenureMonths || 3;
      let discountMultiplier = 1.0;

      if (months >= 12) discountMultiplier = 0.75;
      else if (months >= 9) discountMultiplier = 0.82;
      else if (months >= 6) discountMultiplier = 0.90;
      else discountMultiplier = 1.0;

      const discountedMonthly = Math.round(baseMonthly * discountMultiplier);
      const totalRentForTenure = discountedMonthly * months;
      const securityDeposit = product.securityDeposit;
      const deliveryFee = totalRentForTenure >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
      const platformFee = settings.platformFee;
      const taxableAmount = totalRentForTenure + platformFee;
      const gstAmount = Math.round(taxableAmount * (settings.gstPercent / 100));
      const totalPayableNow = totalRentForTenure + securityDeposit + deliveryFee + platformFee + gstAmount;

      const platformCommission = Math.round(totalRentForTenure * (settings.commissionPercent / 100));
      const ownerEarnings = totalRentForTenure - platformCommission;

      return {
        baseRent: baseMonthly,
        discountedRent: discountedMonthly,
        tenureDuration: months,
        isMonthly: true,
        totalRentalPrice: totalRentForTenure,
        securityDeposit,
        deliveryFee,
        platformFee,
        gstAmount,
        totalPayableNow,
        ownerEarnings,
        platformCommission,
      };
    },
    [settings]
  );

  // ==================== CART ACTIONS ====================
  const addToCart = (
    product: Product,
    tenureMonths: number = 3,
    tenureDays?: number,
    startDate?: string
  ) => {
    const today = new Date();
    const effectiveStart = startDate || today.toISOString().split('T')[0];
    const isDaily = Boolean(product.dailyRent && !product.monthlyRent);

    let effectiveEnd: string;
    if (isDaily) {
      const days = tenureDays || 1;
      const endDateObj = new Date(effectiveStart);
      endDateObj.setDate(endDateObj.getDate() + days);
      effectiveEnd = endDateObj.toISOString().split('T')[0];
    } else {
      const months = tenureMonths || 3;
      const endDateObj = new Date(effectiveStart);
      endDateObj.setMonth(endDateObj.getMonth() + months);
      effectiveEnd = endDateObj.toISOString().split('T')[0];
    }

    const pricing = calculateProductPricing(product, tenureMonths, tenureDays);

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        showToast('Cart Updated', 'info', `Updated tenure for ${product.name}`);
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                tenureMonths: isDaily ? undefined : tenureMonths,
                tenureDays: isDaily ? tenureDays || 1 : undefined,
                calculatedMonthlyRent: pricing.discountedRent,
                securityDeposit: pricing.securityDeposit,
                startDate: effectiveStart,
                endDate: effectiveEnd,
              }
            : item
        );
      } else {
        showToast('Added to Cart', 'success', `${product.name} has been added.`);
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity: 1,
          tenureMonths: isDaily ? undefined : tenureMonths,
          tenureDays: isDaily ? tenureDays || 1 : undefined,
          calculatedMonthlyRent: pricing.discountedRent,
          securityDeposit: pricing.securityDeposit,
          startDate: effectiveStart,
          endDate: effectiveEnd,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item Removed', 'info', 'Item has been removed from your cart.');
  };

  const updateCartTenure = (productId: string, tenureMonths?: number, tenureDays?: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const pricing = calculateProductPricing(item.product, tenureMonths, tenureDays);
          return {
            ...item,
            tenureMonths,
            tenureDays,
            calculatedMonthlyRent: pricing.discountedRent,
            securityDeposit: pricing.securityDeposit,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // ==================== WISHLIST ====================
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist', 'success', 'You can find it in your saved items.');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // ==================== BOOKINGS ====================
  const createBooking = async (
    params: CreateBookingParams
  ): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) {
      return { success: false, error: 'Product not found.' };
    }

    const isOverlapping = storageService.isItemBookedForDates(
      params.productId,
      params.startDate,
      params.endDate
    );

    if (isOverlapping) {
      return {
        success: false,
        error: `Sorry, this item is already booked for the selected dates (${params.startDate} to ${params.endDate}). Please choose different dates.`,
      };
    }

    const pricing = calculateProductPricing(
      product,
      params.tenureMonths || 3,
      params.tenureDays
    );

    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      userId: user?.id || 'cust-guest',
      userName: user?.name || params.deliveryAddress.fullName,
      userEmail: user?.email || 'customer@rentandshare.com',
      userPhone: user?.phone || params.deliveryAddress.phone,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      category: product.category,
      ownerId: product.ownerId,
      ownerName: product.ownerName || 'Equipment Partner',
      startDate: params.startDate,
      endDate: params.endDate,
      tenureMonths: params.tenureMonths,
      tenureDays: params.tenureDays,
      monthlyRent: pricing.discountedRent,
      totalRent: pricing.totalRentalPrice,
      securityDeposit: pricing.securityDeposit,
      deliveryFee: pricing.deliveryFee,
      platformFee: pricing.platformFee,
      gstAmount: pricing.gstAmount,
      totalPaid: pricing.totalPayableNow,
      ownerEarnings: pricing.ownerEarnings,
      platformCommission: pricing.platformCommission,
      status: 'Confirmed',
      deliveryAddress: params.deliveryAddress,
      paymentMethod: params.paymentMethod,
      paymentId: `pay_test_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isTestPayment: true,
      createdAt: new Date().toISOString(),
      notes: params.notes,
    };

    // Save locally
    storageService.saveBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);

    // Save to Firestore
    if (isFirebaseActive) {
      firestoreService.saveBooking(newBooking).catch(console.warn);
    }

    // Create Notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: user?.id || 'cust-demo-1',
      title: 'Booking Confirmed!',
      message: `Your rental for ${product.name} (Booking ID: ${bookingId}) is confirmed for delivery on ${params.startDate}.`,
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/account?tab=rentals',
    };
    storageService.saveNotification(notif);
    setNotifications(storageService.getNotifications(user?.id));

    // Remove from cart
    setCart((prev) => prev.filter((item) => item.productId !== product.id));

    showToast('Booking Confirmed!', 'success', `Order #${bookingId} placed successfully.`);
    return { success: true, bookingId };
  };

  const cancelBooking = (bookingId: string) => {
    storageService.updateBooking(bookingId, { status: 'Cancelled' });
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    if (isFirebaseActive) {
      firestoreService.updateBooking(bookingId, { status: 'Cancelled' }).catch(console.warn);
    }
    showToast('Booking Cancelled', 'info', 'Refund of 100% deposit & rent will be initiated.');
  };

  const extendBookingTenure = (bookingId: string, additionalMonths: number) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const currentEnd = new Date(booking.endDate);
    currentEnd.setMonth(currentEnd.getMonth() + additionalMonths);
    const newEndStr = currentEnd.toISOString().split('T')[0];
    const newTenure = (booking.tenureMonths || 0) + additionalMonths;

    storageService.updateBooking(bookingId, {
      endDate: newEndStr,
      tenureMonths: newTenure,
    });
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, endDate: newEndStr, tenureMonths: newTenure } : b
      )
    );
    if (isFirebaseActive) {
      firestoreService
        .updateBooking(bookingId, { endDate: newEndStr, tenureMonths: newTenure })
        .catch(console.warn);
    }
    showToast('Tenure Extended!', 'success', `Your rental is now extended till ${newEndStr}`);
  };

  const requestReturnBooking = (bookingId: string) => {
    storageService.updateBooking(bookingId, { status: 'Return Requested' });
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Return Requested' } : b))
    );
    if (isFirebaseActive) {
      firestoreService.updateBooking(bookingId, { status: 'Return Requested' }).catch(console.warn);
    }
    showToast('Return Requested', 'info', 'Our logistics specialist will contact you to schedule pickup.');
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    storageService.updateBooking(bookingId, { status });
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    if (isFirebaseActive) {
      firestoreService.updateBooking(bookingId, { status }).catch(console.warn);
    }
    showToast('Status Updated', 'success', `Booking status changed to ${status}`);
  };

  // ==================== REPAIRS ====================
  const raiseRepairTicket = async (params: RaiseRepairParams): Promise<RepairTicket> => {
    const booking = bookings.find((b) => b.id === params.bookingId);
    const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: RepairTicket = {
      id: ticketId,
      bookingId: params.bookingId,
      userId: user?.id || 'cust-demo-1',
      userName: user?.name || 'Customer',
      userEmail: user?.email || 'customer@rentandshare.com',
      ownerId: booking?.ownerId || 'owner-1',
      productId: booking?.productId || 'item-unknown',
      productName: booking?.productName || 'Rented Equipment',
      productImage: booking?.productImage || '',
      issueType: params.issueType,
      description: params.description,
      preferredDate: params.preferredDate,
      preferredTimeSlot: params.preferredTimeSlot,
      mediaUrl: params.mediaUrl,
      status: 'Submitted',
      customerCharge: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveRepairTicket(newTicket);
    setRepairTickets((prev) => [newTicket, ...prev]);

    if (isFirebaseActive) {
      firestoreService.saveRepairTicket(newTicket).catch(console.warn);
    }

    showToast('Repair Ticket Raised', 'success', `Ticket #${ticketId} created. Technician visit scheduled.`);
    return newTicket;
  };

  const updateRepairTicketStatus = (
    ticketId: string,
    updates: Partial<RepairTicket>
  ) => {
    const current = repairTickets.find((t) => t.id === ticketId);
    if (!current) return;
    const updated = { ...current, ...updates };

    storageService.saveRepairTicket(updated);
    setRepairTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? updated : t))
    );

    if (isFirebaseActive) {
      firestoreService.updateRepairTicket(ticketId, updates).catch(console.warn);
    }

    showToast('Ticket Updated', 'success', `Ticket #${ticketId} updated to ${updated.status}`);
  };

  // ==================== KYC ====================
  const reviewKycRecord = (kycId: string, status: KycRecord['status'], reason?: string) => {
    const records = storageService.getKycRecords();
    const target = records.find((r) => r.id === kycId);
    if (!target) return;

    const updated: KycRecord = {
      ...target,
      status,
      rejectionReason: reason,
      verifiedAt: status === 'Approved' ? new Date().toISOString() : undefined,
    };

    storageService.saveKycRecord(updated);
    setKycRecords((prev) =>
      prev.map((r) => (r.id === kycId ? updated : r))
    );

    if (isFirebaseActive) {
      firestoreService.updateKycRecord(kycId, {
        status,
        rejectionReason: reason,
        verifiedAt: status === 'Approved' ? new Date().toISOString() : undefined,
      }).catch(console.warn);
    }

    showToast('KYC Reviewed', status === 'Approved' ? 'success' : 'warning', `KYC for ${target.userName} is marked as ${status}`);
  };

  // ==================== ADMIN & OWNER ====================
  const seedDefaultProducts = async () => {
    storageService.resetProducts();
    const localProds = storageService.getProducts();
    setProducts(localProds);
    if (isFirebaseActive) {
      try {
        await firestoreService.seedProducts(localProds);
      } catch (e) {
        console.warn('Seeding to Firestore failed:', e);
      }
    }
    showToast('Products Reset', 'success', 'All 120+ default verified products have been seeded.');
  };

  const updatePlatformSettings = (newSettings: PlatformSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('Settings Saved', 'success', 'Platform commission and fee rates updated.');
  };

  const saveProductListing = (product: Product) => {
    storageService.saveProduct(product);
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });

    if (isFirebaseActive) {
      firestoreService.saveProduct(product).catch(console.warn);
    }

    showToast('Listing Saved', 'success', `${product.name} is now live.`);
  };

  const deleteProductListing = (productId: string) => {
    storageService.deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    if (isFirebaseActive) {
      firestoreService.deleteProduct(productId).catch(console.warn);
    }

    showToast('Listing Deleted', 'info', 'Product removed from marketplace.');
  };

  const uploadProductImage = async (productId: string, file: File, imageIndex = 0): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const currentProducts = storageService.getProducts();
        const target = currentProducts.find((p) => p.id === productId);
        if (target) {
          const newImages = [...target.images];
          if (imageIndex < newImages.length) {
            newImages[imageIndex] = dataUrl;
          } else {
            newImages.unshift(dataUrl);
          }
          const updated: Product = { ...target, images: newImages };
          storageService.saveProduct(updated);
          setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
          if (isFirebaseActive) {
            firestoreService.saveProduct(updated).catch(console.warn);
          }
          showToast('Image Replaced Successfully', 'success', `Custom photo saved for ${target.name}.`);
        }
        resolve(dataUrl);
      };
      reader.onerror = (err) => {
        showToast('Image Upload Failed', 'error', 'Unable to process the image file.');
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const submitReview = (productId: string, bookingId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      bookingId,
      userId: user?.id || 'cust-demo-1',
      userName: user?.name || 'Verified Renter',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    storageService.saveReview(newRev);
    setReviews(storageService.getReviews());
    showToast('Review Submitted', 'success', 'Thank you for rating your rental experience!');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        cart,
        wishlist,
        bookings,
        repairTickets,
        kycRecords,
        reviews,
        settings,
        notifications,
        addToCart,
        removeFromCart,
        updateCartTenure,
        clearCart,
        toggleWishlist,
        isWishlisted,
        calculateProductPricing,
        createBooking,
        cancelBooking,
        extendBookingTenure,
        requestReturnBooking,
        updateBookingStatus,
        raiseRepairTicket,
        updateRepairTicketStatus,
        reviewKycRecord,
        seedDefaultProducts,
        updatePlatformSettings,
        saveProductListing,
        deleteProductListing,
        uploadProductImage,
        submitReview,
        markNotificationRead,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
