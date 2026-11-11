import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, switchRole, isFirebaseActive } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await loginWithEmail(email || 'customer@rentandshare.com', password || 'password123');
      if (res.success) {
        showToast('Welcome Back!', 'success', 'Logged into your Rent and Share account.');
        onClose();
      } else {
        showToast('Login Failed', 'error', res.error || 'Invalid email or password.');
      }
    } else {
      const res = await signupWithEmail(fullName || 'New Renter', email || 'renter@example.com', password || 'pass123', selectedRole);
      if (res.success) {
        showToast('Account Created!', 'success', `Welcome to Rent and Share as ${selectedRole}.`);
        onClose();
      } else {
        showToast('Registration Failed', 'error', res.error || 'Please check your inputs.');
      }
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    if (res.success) {
      showToast('Signed In with Google', 'success');
      onClose();
    } else {
      showToast('Google Sign-In Failed', 'error', res.error || 'Could not sign in with Google');
    }
    setIsSubmitting(false);
  };

  const handleQuickDemo = (roleToSet: UserRole) => {
    switchRole(roleToSet);
    showToast('Demo Account Switched', 'success', `Now operating as ${roleToSet.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F26B21] to-[#D9530F] text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            R&S
          </div>
          <h3 className="font-extrabold text-xl text-[#1F1F1F]">
            {mode === 'login' ? 'Welcome to Rent and Share' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Share it. Rent it. Use it.
          </p>
        </div>

        {/* 1-Tap Quick Demo Role Selection (for testing) */}
        <div className="mb-6 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center mb-2">
            Instant 1-Click Role Login (Demo Mode)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 rounded-xl bg-white border border-neutral-200 hover:border-[#F26B21] hover:text-[#F26B21] text-xs font-bold text-neutral-700 transition"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="py-1.5 px-2 rounded-xl bg-white border border-neutral-200 hover:border-[#F26B21] hover:text-[#F26B21] text-xs font-bold text-neutral-700 transition"
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 rounded-xl bg-white border border-neutral-200 hover:border-purple-600 hover:text-purple-600 text-xs font-bold text-neutral-700 transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border rounded-xl"
                  required
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-bold mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="customer@rentandshare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border rounded-xl"
                required
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border rounded-xl"
                required
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-2 rounded-xl border text-center font-bold ${
                    selectedRole === 'customer' ? 'border-[#F26B21] bg-[#FFF3EA] text-[#F26B21]' : 'border-neutral-200'
                  }`}
                >
                  Customer (Renter)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('owner')}
                  className={`p-2 rounded-xl border text-center font-bold ${
                    selectedRole === 'owner' ? 'border-[#F26B21] bg-[#FFF3EA] text-[#F26B21]' : 'border-neutral-200'
                  }`}
                >
                  Equipment Owner
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm shadow-lg transition"
          >
            {isSubmitting
              ? 'Please wait...'
              : mode === 'login'
              ? 'Login to Account'
              : 'Create Free Account'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t text-center text-xs text-[#6B6B6B]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-[#F26B21] hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#F26B21] hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
