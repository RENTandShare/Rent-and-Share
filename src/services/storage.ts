import {
  Product,
  Booking,
  RepairTicket,
  KycRecord,
  Review,
  PlatformSettings,
  AppNotification,
  DeliveryAddress,
  CartItem,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const KEYS = {
  PRODUCTS: 'rentshare_products_v4',
  BOOKINGS: 'rentshare_bookings_v1',
  REPAIRS: 'rentshare_repairs_v1',
  KYC: 'rentshare_kyc_v1',
  REVIEWS: 'rentshare_reviews_v1',
  SETTINGS: 'rentshare_settings_v1',
  CART: 'rentshare_cart_v1',
  WISHLIST: 'rentshare_wishlist_v1',
  NOTIFICATIONS: 'rentshare_notifications_v1',
  ADDRESSES: 'rentshare_addresses_v1',
  SELECTED_CITY: 'rentshare_selected_city_v1',
};

export const DEFAULT_SETTINGS: PlatformSettings = {
  commissionPercent: 10,
  gstPercent: 18,
  platformFee: 99,
  freeDeliveryThreshold: 1000,
  standardDeliveryFee: 299,
};

export const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    street: 'Flat 402, Sai Residency, Road No. 36',
    area: 'Jubilee Hills',
    city: 'Hyderabad',
    pincode: '500033',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Rahul Sharma (Office)',
    phone: '+91 98765 43210',
    street: 'Building 12, Mindspace Tech Park',
    area: 'Madhapur',
    city: 'Hyderabad',
    pincode: '500081',
    isDefault: false,
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-9041',
    userId: 'cust-demo-1',
    userName: 'Rahul Sharma',
    userEmail: 'customer@rentandshare.com',
    userPhone: '+91 98765 43210',
    productId: 'appl-004',
    productName: 'Fully Automatic Top-Load Washing Machine 6.5kg',
    productImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    category: 'Appliances',
    ownerId: 'owner-1',
    ownerName: 'Venkata Rao Rentals',
    startDate: '2026-02-01',
    endDate: '2026-08-01',
    tenureMonths: 6,
    monthlyRent: 584,
    totalRent: 3504,
    securityDeposit: 1200,
    deliveryFee: 0,
    platformFee: 99,
    gstAmount: 648,
    totalPaid: 5451,
    ownerEarnings: 3153,
    platformCommission: 351,
    status: 'Active',
    deliveryAddress: DEFAULT_ADDRESSES[0],
    paymentMethod: 'UPI (GPay)',
    paymentId: 'pay_test_upi_DEMO9041',
    isTestPayment: true,
    createdAt: '2026-02-01T08:30:00Z',
    notes: 'Please install near dry balcony faucet.',
  },
  {
    id: 'BK-2026-8812',
    userId: 'cust-demo-1',
    userName: 'Rahul Sharma',
    userEmail: 'customer@rentandshare.com',
    userPhone: '+91 98765 43210',
    productId: 'furn-010',
    productName: 'Ergonomic High-Back Executive Chair',
    productImage: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    ownerId: 'owner-1',
    ownerName: 'Venkata Rao Rentals',
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    tenureMonths: 3,
    monthlyRent: 499,
    totalRent: 1497,
    securityDeposit: 900,
    deliveryFee: 0,
    platformFee: 99,
    gstAmount: 287,
    totalPaid: 2783,
    ownerEarnings: 1347,
    platformCommission: 150,
    status: 'Active',
    deliveryAddress: DEFAULT_ADDRESSES[0],
    paymentMethod: 'Credit Card',
    paymentId: 'pay_test_card_DEMO8812',
    isTestPayment: true,
    createdAt: '2026-01-15T11:20:00Z',
  },
];

const INITIAL_REPAIRS: RepairTicket[] = [
  {
    id: 'TICK-4091',
    bookingId: 'BK-2026-9041',
    userId: 'cust-demo-1',
    userName: 'Rahul Sharma',
    userEmail: 'customer@rentandshare.com',
    productId: 'appl-004',
    productName: 'Fully Automatic Top-Load Washing Machine 6.5kg',
    productImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    ownerId: 'owner-1',
    issueType: 'Noise or leakage',
    description: 'Slight vibration noise during the high-speed spin cycle. Machine washes well otherwise.',
    preferredDate: '2026-11-06',
    preferredTimeSlot: '10:00 AM - 01:00 PM',
    technicianName: 'Suresh Kumar (Certified Appliance Tech)',
    technicianPhone: '+91 98490 88771',
    visitDate: '2026-11-06',
    visitTimeSlot: '11:30 AM',
    status: 'Visit Scheduled',
    customerCharge: 0,
    chargeReason: 'Covered under Rent and Share Free Repair Guarantee (Normal motor balancing)',
    createdAt: '2026-11-03T14:20:00Z',
    updatedAt: '2026-11-04T09:00:00Z',
  },
];

const INITIAL_KYC: KycRecord[] = [
  {
    id: 'kyc-demo-1',
    userId: 'cust-demo-1',
    userName: 'Rahul Sharma',
    userEmail: 'customer@rentandshare.com',
    documentType: 'Aadhaar',
    documentNumber: 'XXXX-XXXX-8921',
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    addressProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'Approved',
    submittedAt: '2026-01-14T09:00:00Z',
    verifiedAt: '2026-01-14T11:30:00Z',
  },
  {
    id: 'kyc-demo-2',
    userId: 'cust-new-2',
    userName: 'Deepika Rao',
    userEmail: 'deepika.rao@example.com',
    documentType: 'Driving License',
    documentNumber: 'TS09-2021008892',
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    addressProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    submittedAt: '2026-11-04T16:45:00Z',
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'appl-001',
    bookingId: 'BK-SAMPLE-01',
    userId: 'user-sample-1',
    userName: 'Vikram Reddy',
    rating: 5,
    comment: 'The Whirlpool fridge was spotless, completely sanitized, and chilled in 15 minutes! Delivery guys were polite and installed it smoothly.',
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'furn-001',
    bookingId: 'BK-SAMPLE-02',
    userId: 'user-sample-2',
    userName: 'Meghana Rao',
    rating: 5,
    comment: 'High quality solid wood single bed. Mattress was brand new with plastic wrap. Highly recommend Rent and Share!',
    createdAt: '2026-02-12T15:30:00Z',
  },
];

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to save to localStorage (${key}):`, e);
    }
  }

  public init(): void {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      this.setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      this.setItem(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    }
    if (!localStorage.getItem(KEYS.REPAIRS)) {
      this.setItem(KEYS.REPAIRS, INITIAL_REPAIRS);
    }
    if (!localStorage.getItem(KEYS.KYC)) {
      this.setItem(KEYS.KYC, INITIAL_KYC);
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      this.setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      this.setItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(KEYS.ADDRESSES)) {
      this.setItem(KEYS.ADDRESSES, DEFAULT_ADDRESSES);
    }
  }

  // ==================== PRODUCTS ====================
  public getProducts(): Product[] {
    const list = this.getItem<Product[]>(KEYS.PRODUCTS, []);
    return list.length ? list : INITIAL_PRODUCTS;
  }

  public saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.setItem(KEYS.PRODUCTS, products);
  }

  public saveProductList(products: Product[]): void {
    this.setItem(KEYS.PRODUCTS, products);
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setItem(KEYS.PRODUCTS, products);
  }

  public resetProducts(): void {
    this.setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  // ==================== BOOKINGS ====================
  public getBookings(): Booking[] {
    return this.getItem<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  public saveBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.setItem(KEYS.BOOKINGS, bookings);
  }

  public updateBooking(bookingId: string, updates: Partial<Booking>): void {
    const bookings = this.getBookings().map((b) =>
      b.id === bookingId ? { ...b, ...updates } : b
    );
    this.setItem(KEYS.BOOKINGS, bookings);
  }

  // Check overlapping dates for item booking
  public isItemBookedForDates(
    productId: string,
    checkStart: string,
    checkEnd: string,
    excludeBookingId?: string
  ): boolean {
    const bookings = this.getBookings().filter(
      (b) =>
        b.productId === productId &&
        b.id !== excludeBookingId &&
        b.status !== 'Cancelled' &&
        b.status !== 'Completed'
    );

    const targetStart = new Date(checkStart).getTime();
    const targetEnd = new Date(checkEnd).getTime();

    for (const b of bookings) {
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();

      // Check overlap: start1 <= end2 and start2 <= end1
      if (targetStart <= bEnd && bStart <= targetEnd) {
        return true;
      }
    }
    return false;
  }

  // ==================== REPAIRS ====================
  public getRepairTickets(): RepairTicket[] {
    return this.getItem<RepairTicket[]>(KEYS.REPAIRS, INITIAL_REPAIRS);
  }

  public saveRepairTicket(ticket: RepairTicket): void {
    const tickets = this.getRepairTickets();
    const index = tickets.findIndex((t) => t.id === ticket.id);
    if (index >= 0) {
      tickets[index] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    this.setItem(KEYS.REPAIRS, tickets);
  }

  // ==================== KYC ====================
  public getKycRecords(): KycRecord[] {
    return this.getItem<KycRecord[]>(KEYS.KYC, INITIAL_KYC);
  }

  public saveKycRecord(record: KycRecord): void {
    const records = this.getKycRecords();
    const index = records.findIndex((r) => r.id === record.id || r.userId === record.userId);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.unshift(record);
    }
    this.setItem(KEYS.KYC, records);
  }

  // ==================== REVIEWS ====================
  public getReviews(): Review[] {
    return this.getItem<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  public saveReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.setItem(KEYS.REVIEWS, reviews);
  }

  // ==================== SETTINGS ====================
  public getSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public saveSettings(settings: PlatformSettings): void {
    this.setItem(KEYS.SETTINGS, settings);
  }

  // ==================== CART & WISHLIST ====================
  public getCart(): CartItem[] {
    return this.getItem<CartItem[]>(KEYS.CART, []);
  }

  public saveCart(cart: CartItem[]): void {
    this.setItem(KEYS.CART, cart);
  }

  public getWishlist(): string[] {
    return this.getItem<string[]>(KEYS.WISHLIST, ['furn-001', 'elec-007', 'appl-004']);
  }

  public saveWishlist(wishlist: string[]): void {
    this.setItem(KEYS.WISHLIST, wishlist);
  }

  // ==================== NOTIFICATIONS ====================
  public getNotifications(userId?: string): AppNotification[] {
    const list = this.getItem<AppNotification[]>(KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        userId: 'cust-demo-1',
        title: 'Technician Visit Scheduled',
        message: 'Technician Suresh Kumar is scheduled for tomorrow at 11:30 AM for washing machine check.',
        type: 'repair',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'cust-demo-1',
        title: 'KYC Verified Successfully',
        message: 'Your Aadhaar card verification was approved. You are eligible for zero-security-deposit fast checkout.',
        type: 'kyc',
        isRead: true,
        createdAt: '2026-01-14T11:30:00Z',
      },
    ]);
    if (!userId) return list;
    return list.filter((n) => n.userId === userId || n.userId === 'all');
  }

  public saveNotification(notif: AppNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    this.setItem(KEYS.NOTIFICATIONS, list);
  }

  // ==================== ADDRESSES ====================
  public getAddresses(): DeliveryAddress[] {
    return this.getItem<DeliveryAddress[]>(KEYS.ADDRESSES, DEFAULT_ADDRESSES);
  }

  public saveAddress(address: DeliveryAddress): void {
    let addresses = this.getAddresses();
    if (address.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }
    const index = addresses.findIndex((a) => a.id === address.id);
    if (index >= 0) {
      addresses[index] = address;
    } else {
      addresses.push(address);
    }
    this.setItem(KEYS.ADDRESSES, addresses);
  }

  public deleteAddress(id: string): void {
    const addresses = this.getAddresses().filter((a) => a.id !== id);
    this.setItem(KEYS.ADDRESSES, addresses);
  }

  // ==================== CITY ====================
  public getSelectedCity(): string {
    return localStorage.getItem(KEYS.SELECTED_CITY) || 'Hyderabad';
  }

  public setSelectedCity(city: string): void {
    localStorage.setItem(KEYS.SELECTED_CITY, city);
  }
}

export const storageService = new StorageService();
storageService.init();
