export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Rentals & Tenure',
    question: 'How does tenure selection affect the monthly rent?',
    answer: 'The longer your commitment, the lower your monthly rent! Standard 3 months tenure is at 100% base price, 6 months gives you a 10% discount, 9 months gives 18% off, and 12 months or longer gives a massive 25% discount on the monthly price.',
  },
  {
    category: 'Security Deposit',
    question: 'Is the security deposit 100% refundable?',
    answer: 'Yes! Your security deposit is completely refundable. Once the rental tenure concludes and our delivery specialist picks up the equipment, the full deposit is processed directly back to your original payment mode or bank account within 2-4 working days.',
  },
  {
    category: 'Repairs & Support',
    question: 'What is the "Free Repair & Instant Replacement" guarantee?',
    answer: 'All normal wear and tear, technical breakdowns, cooling issues, or manufacturing faults are 100% covered for free by Rent and Share. If an item cannot be repaired within 48 hours, we arrange an instant replacement unit of equal or higher specification at zero extra charge.',
  },
  {
    category: 'KYC & Documentation',
    question: 'Why do I need to complete KYC verification?',
    answer: 'Before your first rental delivery, we require a valid government photo ID (Aadhaar, PAN, Passport, or Driving License) and current address proof. This keeps the marketplace secure for both equipment owners and renters.',
  },
  {
    category: 'Delivery & Relocation',
    question: 'Do you offer free doorstep delivery and installation?',
    answer: 'Yes! Orders above ₹1,000 enjoy free doorstep delivery, professional unboxing, and testing by verified technicians. If you shift homes within the same city during your active rental, we also provide free relocation once a year.',
  },
  {
    category: 'Cancellation & Returns',
    question: 'What is the cancellation policy?',
    answer: 'You can cancel any booking before dispatch with zero cancellation charges and 100% instant refund of both rent and deposit. For early tenure termination after delivery, standard tenure adjustment applies as outlined in your rental agreement.',
  },
];

export const TRUST_PILLARS = [
  {
    title: 'Free Repairs',
    desc: 'Zero maintenance charges for all normal wear & tear',
    icon: 'Wrench',
  },
  {
    title: 'Free Relocation',
    desc: 'Moving homes within the city? We move your rentals free',
    icon: 'Truck',
  },
  {
    title: 'Instant Replacement',
    desc: 'Unfixable issue? Get a new unit delivered in 48 hours',
    icon: 'RefreshCw',
  },
  {
    title: 'Flexible Tenure',
    desc: 'Rent from 1 day up to 36 months, extend anytime',
    icon: 'Calendar',
  },
  {
    title: 'Doorstep Delivery',
    desc: 'Safe delivery and technician installation included',
    icon: 'PackageCheck',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Browse & Pick Tenure',
    desc: 'Choose from 120+ verified appliances, furniture, and tools. Select your city and rental duration from 1 day to 12+ months.',
  },
  {
    step: '02',
    title: 'Quick KYC & Checkout',
    desc: 'Upload an ID proof once, review transparent pricing with refundable deposit, and place your order securely.',
  },
  {
    step: '03',
    title: 'Doorstep Setup & Enjoy',
    desc: 'Our certified logistics team brings the equipment to your doorstep, installs it, tests it, and hands you the keys.',
  },
  {
    step: '04',
    title: 'Extend, Return, or Upgrade',
    desc: 'Love the setup? Extend seamlessly in your dashboard, request free maintenance, or return with instant deposit refund.',
  },
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Ananya Deshmukh',
    city: 'Bengaluru',
    role: 'Software Architect',
    rating: 5,
    comment: 'Furnished my 2BHK in HSR Layout in just 2 days through Rent and Share! The double door Samsung fridge and queen bed arrived in mint condition. Saved over ₹75,000 upfront.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    itemRented: 'WFH Pack + Double Bed',
  },
  {
    id: 'test-2',
    name: 'Karthik Varma',
    city: 'Hyderabad',
    role: 'Product Lead',
    rating: 5,
    comment: 'The Sony Alpha A7 IV and Godox lighting kit made our corporate conference shoot a massive success. Renting for 2 days was 95% cheaper than buying camera gear!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    itemRented: 'Sony A7 IV + Lighting Kit',
  },
  {
    id: 'test-3',
    name: 'Priya Sundaram',
    city: 'Chennai',
    role: 'Content Creator',
    rating: 5,
    comment: 'The "Free Repair & Replacement" is real! When our washing machine had a drain motor glitch, a technician arrived next morning and fixed it without charging a single rupee.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    itemRented: 'LG Washing Machine 6.5kg',
  },
];
