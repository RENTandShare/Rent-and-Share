import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TicketIssueType, TicketStatus } from '../types';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Upload,
  User,
  Phone,
  ChevronRight,
  Plus,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ISSUE_TYPES: TicketIssueType[] = [
  'Not working',
  'Damaged',
  'Noise or leakage',
  'Cosmetic damage',
  'Other',
];

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM (Morning)',
  '12:00 PM - 03:00 PM (Afternoon)',
  '03:00 PM - 06:00 PM (Evening)',
  '06:00 PM - 08:00 PM (Late Evening)',
];

const STATUS_STEPS: TicketStatus[] = [
  'Submitted',
  'Technician Assigned',
  'Visit Scheduled',
  'Resolved',
  'Replacement Approved',
  'Replaced',
];

export const RepairsPage: React.FC = () => {
  const { bookings, repairTickets, raiseRepairTicket } = useMarketplace();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Active bookings that can have tickets raised
  const activeBookings = bookings.filter(
    (b) => (b.status === 'Active' || b.status === 'Confirmed') && (user?.role === 'admin' || b.userId === user?.id)
  );

  // Form states
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    activeBookings[0]?.id || ''
  );
  const [issueType, setIssueType] = useState<TicketIssueType>('Not working');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTicketTab, setSelectedTicketTab] = useState<'raise' | 'history'>('history');

  // Filter tickets for current user (or all if admin)
  const myTickets = repairTickets.filter((t) =>
    user?.role === 'admin' ? true : t.userId === user?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      showToast('Select Rental Item', 'warning', 'Please select which active rental needs service.');
      return;
    }
    if (!description.trim()) {
      showToast('Description Required', 'warning', 'Please provide a brief description of the issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await raiseRepairTicket({
        bookingId: selectedBookingId,
        issueType,
        description: description.trim(),
        preferredDate,
        preferredTimeSlot,
        mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      });
      setSelectedTicketTab('history');
      setDescription('');
    } catch {
      showToast('Submission Failed', 'error', 'Unable to submit repair request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FA463] text-white text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> 100% Free Maintenance Guarantee
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Repair & Instant Replacement Support
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Free doorstep repairs for all normal wear & tear, component issues, or motor faults.
            If an item cannot be resolved within 48 hours, we arrange an instant replacement unit at zero cost.
          </p>
        </div>
      </div>

      {/* Tabs: Ticket History vs Raise Request */}
      <div className="flex border-b border-neutral-200 mb-8">
        <button
          onClick={() => setSelectedTicketTab('history')}
          className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            selectedTicketTab === 'history'
              ? 'border-[#F26B21] text-[#F26B21]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Support Tickets ({myTickets.length})</span>
        </button>
        <button
          onClick={() => setSelectedTicketTab('raise')}
          className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            selectedTicketTab === 'raise'
              ? 'border-[#F26B21] text-[#F26B21]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Raise a New Request</span>
        </button>
      </div>

      {/* Tab 1: Raise a Request Form */}
      {selectedTicketTab === 'raise' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="font-extrabold text-lg text-[#1F1F1F] mb-1">
              Submit Repair or Replacement Ticket
            </h2>
            <p className="text-xs text-[#6B6B6B] mb-6">
              Our service coordinator will schedule a certified technician to inspect your equipment.
            </p>

            {activeBookings.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 space-y-3">
                <Wrench className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="font-bold text-sm text-[#1F1F1F]">No Active Rentals Found</p>
                <p className="text-xs text-[#6B6B6B]">
                  You need an active rental booking to raise a maintenance request.
                </p>
                <Link
                  to="/explore"
                  className="px-4 py-2 rounded-xl bg-[#F26B21] text-white text-xs font-bold inline-block"
                >
                  Browse Equipment
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Select Rental Item */}
                <div>
                  <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                    Select Active Equipment *
                  </label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#F26B21]"
                    required
                  >
                    {activeBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.productName} (Booking ID: {b.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                    Issue Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ISSUE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setIssueType(type)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                          issueType === type
                            ? 'border-[#F26B21] bg-[#FFF3EA] text-[#F26B21]'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                    Describe the Issue *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. AC compressor cuts out after 10 minutes, or washing machine makes rattling noise during spin cycle."
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-[#1F1F1F] focus:outline-none focus:border-[#F26B21]"
                    required
                  />
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                      Preferred Technician Visit Date *
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1F1F1F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1F1F1F]"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Photo Upload Simulation */}
                <div>
                  <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-1.5">
                    Attach Photo / Short Video (Optional)
                  </label>
                  <div className="p-4 border-2 border-dashed border-neutral-200 rounded-2xl text-center bg-neutral-50 hover:bg-[#FFF3EA]/30 transition cursor-pointer">
                    <Upload className="w-6 h-6 text-[#F26B21] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-[#1F1F1F]">
                      Click to upload equipment photos or video clips
                    </p>
                    <p className="text-[10px] text-[#6B6B6B]">PNG, JPG, MP4 up to 25MB (Saved to Cloud Storage)</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <span>Schedule Free Inspection Visit</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Policy Callout */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#1F1F1F] flex items-center gap-2 pb-3 border-b border-neutral-100">
              <ShieldCheck className="w-5 h-5 text-[#1FA463]" /> Protection & Repair Policy
            </h3>

            <div className="space-y-3 text-xs text-[#6B6B6B]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1FA463] shrink-0 mt-0.5" />
                <span>
                  <strong>100% Free for Normal Wear & Tear:</strong> Refrigerant gas refills, motor maintenance, loose joints, and electronic glitches are fully covered.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1FA463] shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Replacement Guarantee:</strong> If the technician deems the unit irreparable within 48 hours, an exact or upgraded model is swapped.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Proven Customer Damage Only:</strong> Charges apply strictly for proven intentional damage or physical drops, itemized transparently before repair.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ticket History & Real-Time Tracking */}
      {selectedTicketTab === 'history' && (
        <div className="space-y-6">
          {myTickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
              <Wrench className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-base text-[#1F1F1F]">No Repair Tickets Raised</h3>
              <p className="text-xs text-[#6B6B6B]">
                All your equipment is operating smoothly. If you ever face an issue, click "Raise a New Request".
              </p>
              <button
                onClick={() => setSelectedTicketTab('raise')}
                className="px-5 py-2.5 rounded-xl bg-[#F26B21] text-white text-xs font-bold"
              >
                Raise a Request
              </button>
            </div>
          ) : (
            myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-5"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={ticket.productImage}
                      alt={ticket.productName}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100"
                    />
                    <div>
                      <p className="font-bold text-sm text-[#1F1F1F]">{ticket.productName}</p>
                      <p className="text-xs text-[#6B6B6B]">
                        Ticket ID: <strong className="font-mono text-[#F26B21]">{ticket.id}</strong> • Issue: {ticket.issueType}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
                    ticket.status === 'Resolved' || ticket.status === 'Replaced'
                      ? 'bg-emerald-100 text-[#1FA463]'
                      : 'bg-[#FFF3EA] text-[#F26B21]'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                {/* Status Progress Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px]">
                  {STATUS_STEPS.map((step, idx) => {
                    const stepIdx = STATUS_STEPS.indexOf(ticket.status);
                    const isPassed = stepIdx >= idx;
                    const isCurrent = ticket.status === step;

                    return (
                      <div key={step} className="p-2 rounded-xl bg-neutral-50 flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                            isPassed ? 'bg-[#1FA463] text-white' : 'bg-neutral-200 text-neutral-500'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span className={`font-semibold ${isCurrent ? 'text-[#F26B21]' : isPassed ? 'text-neutral-800' : 'text-neutral-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Technician & Appointment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#1F1F1F]">
                  <div className="p-3.5 rounded-2xl bg-neutral-50">
                    <span className="text-[11px] text-[#6B6B6B] block">Description:</span>
                    <p className="font-medium mt-0.5">{ticket.description}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50">
                    <span className="text-[11px] text-[#6B6B6B] block">Assigned Technician:</span>
                    <p className="font-bold mt-0.5 text-[#1F1F1F]">
                      {ticket.technicianName || 'Assigning certified technician...'}
                    </p>
                    {ticket.technicianPhone && (
                      <p className="text-[11px] text-[#F26B21]">{ticket.technicianPhone}</p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50">
                    <span className="text-[11px] text-[#6B6B6B] block">Visit Schedule:</span>
                    <p className="font-bold mt-0.5">
                      {ticket.visitDate ? `${ticket.visitDate} at ${ticket.visitTimeSlot}` : `Preferred: ${ticket.preferredDate} (${ticket.preferredTimeSlot.split(' ')[0]})`}
                    </p>
                    <span className="text-[10px] text-[#1FA463] font-bold block mt-0.5">
                      Customer Charge: ₹0 (Free Repair Guarantee)
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
