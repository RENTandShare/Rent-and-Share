import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Database, ShieldCheck, Key, HelpCircle, X, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types';

export const DemoModeBanner: React.FC = () => {
  const { isFirebaseActive, role, switchRole, user } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'customer', label: 'Customer', desc: 'Browse, book, cart, KYC & repairs' },
    { id: 'owner', label: 'Owner', desc: 'Add/edit listings, manage equipment & earnings' },
    { id: 'admin', label: 'Admin', desc: 'All controls, KYC approval, commission & seed' },
  ];

  return (
    <>
      <div className="bg-[#141414] text-white text-xs py-1.5 px-3 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFirebaseActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isFirebaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-medium">
              {isFirebaseActive ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firebase Connected</span>
                  <span className="hidden md:inline text-neutral-400 font-normal">
                    • Cloud Firestore & Auth Active (Project: gen-lang-client-0290758255)
                  </span>
                </span>
              ) : (
                <span className="text-amber-300 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> Local Storage Demo Mode
                </span>
              )}
            </span>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-neutral-400 hover:text-white ml-1 inline-flex items-center gap-0.5 text-[11px] underline"
            >
              Details <HelpCircle className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Role Switcher for Testing */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-neutral-400 hidden sm:inline text-[11px]">Active View:</span>
            {roles.map((r) => {
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  title={r.desc}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#F26B21] text-white font-semibold shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {r.label}
                  {isActive && ' ✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Firebase Status & Details Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-neutral-100">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1F1F1F]">Firebase Cloud Status</h3>
                <p className="text-xs text-[#6B6B6B]">Live Cloud Firestore Database & Authentication</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#1F1F1F]">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <strong>Firestore Cloud Database is Live!</strong>
                  <p className="mt-0.5 text-emerald-700">
                    Product catalog, user accounts, rental bookings, repair requests, and KYC identity documents are synced in real-time to Google Cloud Firestore.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs font-mono space-y-1">
                <p className="font-bold text-[#F26B21]">Active Cloud Configuration:</p>
                <p className="text-neutral-600">Project ID: <span className="text-neutral-900 font-semibold">gen-lang-client-0290758255</span></p>
                <p className="text-neutral-600">Database ID: <span className="text-neutral-900 font-semibold">ai-studio-rentandshare-82d6e3c7-c6c2-483e-af12-74333d3e1ce7</span></p>
                <p className="text-neutral-600">Auth Providers: <span className="text-neutral-900 font-semibold">Email/Password & Google Sign-In</span></p>
                <p className="text-neutral-600">Storage Bucket: <span className="text-neutral-900 font-semibold">gen-lang-client-0290758255.firebasestorage.app</span></p>
              </div>

              <div className="bg-[#FFF3EA] p-3 rounded-xl text-xs text-[#D9530F] flex items-start gap-2">
                <Key className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Hardened security rules (<code>firestore.rules</code>) with role-based access control (ABAC) and administrator access for <code>likitha.25mic7334@vitapstudent.ac.in</code> have been deployed to your cloud project.
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2 rounded-xl bg-[#F26B21] text-white text-sm font-medium hover:bg-[#D9530F] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
