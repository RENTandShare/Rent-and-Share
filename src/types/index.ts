export type UserRole = 'customer' | 'owner' | 'admin';

export type City =
  | 'Hyderabad'
  | 'Bengaluru'
  | 'Mumbai'
  | 'Delhi NCR'
  | 'Pune'
  | 'Chennai'
  | 'Vijayawada'
  | 'Visakhapatnam'
  | 'Amaravati';

export type Category =
  | 'Furniture'
  | 'Appliances'
  | 'Electronics'
  | 'Fitness'
  | 'Photography'
  | 'Tools'
  | 'Events'
  | 'Agriculture';

export type ItemAvailability = 'in-stock' | 'rented' | 'maintenance' | 'out-of-stock';

export type RentalTenure = 1 | 3 | 7 | 14 | 30 | 3 | 6 | 9 | 12; // Days or Months

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subcategory: string;
  city: City | 'All Cities';
  description: string;
  specifications: Record<string, string>;
  monthlyRent?: number;
  dailyRent?: number;
  weeklyRent?: number;
  originalPrice: number;
  securityDeposit: number;
  availability: ItemAvailability;
  ownerId: string;
  ownerName?: string;
  ownerPhone?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isFreeRepair: boolean;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  minTenureMonths?: number;
  minTenureDays?: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  tenureMonths?: number;
  tenureDays?: number;
  startDate: string;
  endDate: string;
  calculatedMonthlyRent: number;
  securityDeposit: number;
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Delivered'
  | 'Active'
  | 'Return Requested'
  | 'Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  productId: string;
  productName: string;
  productImage: string;
  category: Category;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  tenureMonths?: number;
  tenureDays?: number;
  monthlyRent: number;
  totalRent: number;
  securityDeposit: number;
  deliveryFee: number;
  platformFee: number;
  gstAmount: number;
  totalPaid: number;
  ownerEarnings: number;
  platformCommission: number;
  status: BookingStatus;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  paymentId: string;
  isTestPayment: boolean;
  createdAt: string;
  notes?: string;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  area: string;
  city: City;
  pincode: string;
  isDefault?: boolean;
}

export type KycStatus = 'Pending' | 'Approved' | 'Rejected' | 'Not Submitted';

export interface KycRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  documentType: 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License';
  documentNumber: string;
  documentUrl: string;
  addressProofUrl: string;
  status: KycStatus;
  rejectionReason?: string;
  submittedAt: string;
  verifiedAt?: string;
}

export type TicketIssueType =
  | 'Not working'
  | 'Damaged'
  | 'Noise or leakage'
  | 'Cosmetic damage'
  | 'Other';

export type TicketStatus =
  | 'Submitted'
  | 'Technician Assigned'
  | 'Visit Scheduled'
  | 'Resolved'
  | 'Replacement Approved'
  | 'Replaced';

export interface RepairTicket {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage: string;
  ownerId: string;
  issueType: TicketIssueType;
  description: string;
  mediaUrl?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  technicianName?: string;
  technicianPhone?: string;
  visitDate?: string;
  visitTimeSlot?: string;
  status: TicketStatus;
  customerCharge: number;
  chargeReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  bookingId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  city: City;
  avatarUrl?: string;
  addresses: DeliveryAddress[];
  kycStatus: KycStatus;
  kycId?: string;
  createdAt: string;
}

export interface ComboPack {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  image: string;
  productIds: string[];
  totalMonthlyRent: number;
  discountedRent: number;
  securityDeposit: number;
  savings: number;
  category: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'repair' | 'kyc' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface PlatformSettings {
  commissionPercent: number; // e.g. 10
  gstPercent: number; // e.g. 18
  platformFee: number; // e.g. 99
  freeDeliveryThreshold: number; // e.g. 1000
  standardDeliveryFee: number; // e.g. 299
}
