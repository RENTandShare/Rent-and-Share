import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Info,
  MapPin,
  Plus,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartTenure, clearCart, settings } = useMarketplace();
  const { addresses, selectedCity } = useAuth();
  const navigate = useNavigate();

  const totalMonthlyRent = cart.reduce((sum, item) => sum + item.calculatedMonthlyRent, 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.securityDeposit, 0);
  const deliveryFee = totalMonthlyRent >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
  const platformFee = settings.platformFee;
  const taxable = totalMonthlyRent + platformFee;
  const gst = Math.round(taxable * (settings.gstPercent / 100));
  const totalPayable = totalMonthlyRent + totalDeposit + deliveryFee + platformFee + gst;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1F1F1F]">Your Rental Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto">
          Explore our wide range of furniture, electronics, fitness equipment, cameras, and tools for smart monthly living.
        </p>
        <div className="pt-2">
          <Link
            to="/explore"
            className="px-6 py-3 rounded-2xl bg-[#F26B21] text-white text-xs sm:text-sm font-bold shadow-lg hover:bg-[#D9530F] transition inline-block"
          >
            Explore Equipment Catalog →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">Rental Cart</h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">
            You have {cart.length} equipment {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:underline font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const isDaily = Boolean(item.product.dailyRent && !item.product.monthlyRent);

            return (
              <div
                key={item.productId}
                className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-2xl object-cover bg-neutral-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#F26B21] uppercase tracking-wider">
                      {item.product.brand} • {item.product.category}
                    </span>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-bold text-sm text-[#1F1F1F] hover:text-[#F26B21] transition block line-clamp-1"
                    >
                      {item.product.name}
                    </Link>

                    {/* Free Repair Tag */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#1FA463] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Free Repair & Replacement
                    </div>

                    <p className="text-[11px] text-[#6B6B6B]">
                      Delivery from: <span className="font-medium text-[#1F1F1F]">{item.startDate}</span>
                    </p>
                  </div>
                </div>

                {/* Tenure Selector & Price */}
                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-base text-[#1F1F1F]">
                        ₹{item.calculatedMonthlyRent}
                      </span>
                      <span className="text-xs text-[#6B6B6B]">
                        {isDaily ? '/day' : '/mo'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#1FA463] font-semibold block">
                      Deposit: ₹{item.securityDeposit} (Refundable)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Change tenure dropdown */}
                    {!isDaily ? (
                      <select
                        value={item.tenureMonths || 3}
                        onChange={(e) => updateCartTenure(item.productId, Number(e.target.value))}
                        className="p-1.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-neutral-50"
                      >
                        <option value={3}>3 Months</option>
                        <option value={6}>6 Months (10% OFF)</option>
                        <option value={9}>9 Months (18% OFF)</option>
                        <option value={12}>12 Months (25% OFF)</option>
                      </select>
                    ) : (
                      <select
                        value={item.tenureDays || 1}
                        onChange={(e) => updateCartTenure(item.productId, undefined, Number(e.target.value))}
                        className="p-1.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-neutral-50"
                      >
                        <option value={1}>1 Day</option>
                        <option value={3}>3 Days (10% OFF)</option>
                        <option value={7}>1 Week (20% OFF)</option>
                        <option value={14}>2 Weeks (30% OFF)</option>
                      </select>
                    )}

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Delivery Location Notice */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1F1F1F]">Delivering to {selectedCity}</p>
                <p className="text-[11px] text-[#6B6B6B]">
                  {addresses[0]?.street || 'Standard Doorstep Delivery & Setup'}
                </p>
              </div>
            </div>
            <Link to="/account" className="text-xs font-bold text-[#F26B21] hover:underline">
              Change Address
            </Link>
          </div>
        </div>

        {/* Order Price Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4 sticky top-24">
          <h3 className="font-extrabold text-base text-[#1F1F1F] pb-3 border-b border-neutral-100">
            Order Price Summary
          </h3>

          <div className="space-y-2.5 text-xs text-[#6B6B6B]">
            <div className="flex justify-between">
              <span>Rental Charges</span>
              <span className="font-bold text-[#1F1F1F]">₹{totalMonthlyRent}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                Refundable Security Deposit
                <span className="text-[10px] text-[#1FA463] font-bold">100% Refundable</span>
              </span>
              <span className="font-bold text-emerald-700">₹{totalDeposit}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery & Installation</span>
              <span className={deliveryFee === 0 ? 'text-[#1FA463] font-bold' : 'text-[#1F1F1F]'}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Platform Service Fee</span>
              <span className="text-[#1F1F1F]">₹{platformFee}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="text-[#1F1F1F]">₹{gst}</span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline font-extrabold text-base text-[#1F1F1F]">
              <span>Total Payable Now</span>
              <span className="text-[#F26B21] text-lg">₹{totalPayable}</span>
            </div>
          </div>

          <div className="bg-[#FFF3EA] p-3 rounded-2xl text-[11px] text-[#D9530F] flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Zero hidden fees. Deposit processed back within 2-4 days of return.</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
