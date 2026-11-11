import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    showToast('Message Received', 'success', 'Our team will contact you within 2 business hours.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-[#1F1F1F]">Contact Rent and Share</h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B]">
          Need help choosing equipment, shifting homes, or tracking a technician visit? We are here 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#1F1F1F]">Toll-Free Helpline</p>
              <p className="text-sm font-extrabold text-[#F26B21]">+91 1800-RENT-SHARE</p>
              <p className="text-[11px] text-[#6B6B6B]">Mon to Sun (09:00 AM - 08:00 PM)</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1FA463] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#1F1F1F]">Email Support</p>
              <p className="text-xs font-bold text-[#1F1F1F]">support@rentandshare.com</p>
              <p className="text-[11px] text-[#6B6B6B]">Typical response time &lt; 2 hours</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#1F1F1F]">Headquarters & Hubs</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Mindspace IT Park, Madhapur, Hyderabad, Telangana 500081
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-[#1FA463] mx-auto" />
              <h3 className="font-bold text-base text-[#1FA463]">Thank You!</h3>
              <p className="text-xs text-[#6B6B6B]">Your inquiry has been logged. An equipment specialist will call you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-bold text-base text-[#1F1F1F] mb-2">Send us a Message</h3>
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Message / Question *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with rentals, bulk corporate bookings, or equipment listings?"
                  className="w-full p-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
