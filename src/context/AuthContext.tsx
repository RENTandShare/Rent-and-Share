import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile, KycStatus, DeliveryAddress, City } from '../types';
import { auth, googleProvider, isFirebaseConfigured, db } from '../services/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { firestoreService } from '../services/firestoreService';
import { storageService, DEFAULT_ADDRESSES } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isFirebaseActive: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (name: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  submitKyc: (docType: 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License', docNumber: string, docUrl: string, addressProofUrl: string) => void;
  addresses: DeliveryAddress[];
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
}

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  customer: {
    id: 'cust-demo-1',
    name: 'Rahul Sharma',
    email: 'customer@rentandshare.com',
    phone: '+91 98765 43210',
    role: 'customer',
    city: 'Hyderabad',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    addresses: DEFAULT_ADDRESSES,
    kycStatus: 'Approved',
    kycId: 'kyc-demo-1',
    createdAt: '2026-01-14T09:00:00Z',
  },
  owner: {
    id: 'owner-1',
    name: 'Venkata Rao (Equipment Owner)',
    email: 'owner@rentandshare.com',
    phone: '+91 98480 22334',
    role: 'owner',
    city: 'Hyderabad',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    addresses: [DEFAULT_ADDRESSES[0]],
    kycStatus: 'Approved',
    createdAt: '2026-01-10T10:00:00Z',
  },
  admin: {
    id: 'admin-super-1',
    name: 'Rent & Share SuperAdmin',
    email: 'likitha.25mic7334@vitapstudent.ac.in',
    phone: '+91 99999 11111',
    role: 'admin',
    city: 'Hyderabad',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    addresses: [DEFAULT_ADDRESSES[0]],
    kycStatus: 'Approved',
    createdAt: '2025-12-01T00:00:00Z',
  },
};

const AUTH_STORAGE_KEY = 'rentshare_current_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isFirebaseActive = isFirebaseConfigured();
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEMO_PROFILES.customer;
    } catch {
      return DEMO_PROFILES.customer;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => storageService.getAddresses());
  const [selectedCity, setSelectedCityState] = useState<City>(() => (storageService.getSelectedCity() as City) || 'Hyderabad');

  const setSelectedCity = (city: City) => {
    setSelectedCityState(city);
    storageService.setSelectedCity(city);
    if (user) {
      updateProfile({ city });
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Firebase Auth State Listener
  useEffect(() => {
    if (isFirebaseActive && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // Check if profile exists in Firestore
          try {
            const remoteUser = await firestoreService.getUser(fbUser.uid);
            if (remoteUser) {
              setUser(remoteUser);
              return;
            }
          } catch (e) {
            console.warn('Could not fetch remote profile:', e);
          }

          // Compute role: grant admin if matching verified admin email
          const isAdminUser =
            fbUser.email === 'likitha.25mic7334@vitapstudent.ac.in' ||
            (fbUser.email && fbUser.email.includes('admin'));

          const initialRole: UserRole = isAdminUser ? 'admin' : (user?.role || 'customer');

          const newProfile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || user?.name || 'Rent & Share User',
            email: fbUser.email || '',
            role: initialRole,
            city: selectedCity,
            avatarUrl: fbUser.photoURL || undefined,
            addresses: user?.addresses || DEFAULT_ADDRESSES,
            kycStatus: user?.kycStatus || 'Not Submitted',
            createdAt: new Date().toISOString(),
          };

          setUser(newProfile);

          // Save to Firestore
          try {
            await firestoreService.saveUser(newProfile);
          } catch (e) {
            console.warn('Could not sync user to Firestore:', e);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [isFirebaseActive, selectedCity]);

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isFirebaseActive && auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, pass);
          const remote = await firestoreService.getUser(cred.user.uid);
          if (remote) {
            setUser(remote);
          }
          return { success: true };
        } catch (fbErr: any) {
          // If user doesn't exist yet, try creating account automatically for seamless UX
          if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
            try {
              const newCred = await createUserWithEmailAndPassword(auth, email, pass);
              const targetRole: UserRole =
                email === 'likitha.25mic7334@vitapstudent.ac.in' || email.includes('admin')
                  ? 'admin'
                  : email.includes('owner')
                  ? 'owner'
                  : 'customer';

              const createdProfile: UserProfile = {
                id: newCred.user.uid,
                name: email.split('@')[0],
                email,
                role: targetRole,
                city: selectedCity,
                addresses: DEFAULT_ADDRESSES,
                kycStatus: 'Not Submitted',
                createdAt: new Date().toISOString(),
              };
              setUser(createdProfile);
              await firestoreService.saveUser(createdProfile);
              return { success: true };
            } catch (createErr: any) {
              return { success: false, error: createErr.message || 'Invalid credentials.' };
            }
          }
          return { success: false, error: fbErr.message || 'Login failed.' };
        }
      }

      // Demo fallback
      await new Promise((r) => setTimeout(r, 400));
      const targetRole: UserRole =
        email.includes('admin') ? 'admin' : email.includes('owner') ? 'owner' : 'customer';
      const demoUser = {
        ...DEMO_PROFILES[targetRole],
        email,
      };
      setUser(demoUser);
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e?.message || 'Authentication error' };
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole = 'customer'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isFirebaseActive && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const newUser: UserProfile = {
          id: cred.user.uid,
          name,
          email,
          role,
          city: selectedCity,
          addresses: [],
          kycStatus: 'Not Submitted',
          createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        await firestoreService.saveUser(newUser);
        return { success: true };
      }

      // Demo fallback
      await new Promise((r) => setTimeout(r, 400));
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        city: selectedCity,
        addresses: DEFAULT_ADDRESSES,
        kycStatus: 'Not Submitted',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isFirebaseActive && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const isAdminUser =
          fbUser.email === 'likitha.25mic7334@vitapstudent.ac.in' ||
          (fbUser.email && fbUser.email.includes('admin'));

        const profile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          email: fbUser.email || '',
          role: isAdminUser ? 'admin' : 'customer',
          city: selectedCity,
          avatarUrl: fbUser.photoURL || undefined,
          addresses: DEFAULT_ADDRESSES,
          kycStatus: 'Approved',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        await firestoreService.saveUser(profile);
        return { success: true };
      }

      // Demo Google login simulation
      await new Promise((r) => setTimeout(r, 400));
      setUser(DEMO_PROFILES.customer);
      return { success: true };
    } catch (e: any) {
      console.error('Google Sign-In Error:', e);
      return { success: false, error: e?.message || 'Google sign-in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (isFirebaseActive && auth) {
      firebaseSignOut(auth).catch(console.error);
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    setUser(profile);
    if (isFirebaseActive && profile) {
      firestoreService.saveUser(profile).catch(console.warn);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (isFirebaseActive) {
        firestoreService.saveUser(updated).catch(console.warn);
      }
      return updated;
    });
  };

  const submitKyc = (
    docType: 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License',
    docNumber: string,
    docUrl: string,
    addressProofUrl: string
  ) => {
    if (!user) return;
    const kycRecord = {
      id: `kyc-${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      documentType: docType,
      documentNumber: docNumber,
      documentUrl: docUrl,
      addressProofUrl,
      status: 'Pending' as KycStatus,
      submittedAt: new Date().toISOString(),
    };
    storageService.saveKycRecord(kycRecord);
    if (isFirebaseActive) {
      firestoreService.saveKycRecord(kycRecord).catch(console.warn);
    }
    updateProfile({ kycStatus: 'Pending', kycId: kycRecord.id });
  };

  const addAddress = (addressData: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    storageService.saveAddress(newAddr);
    setAddresses(storageService.getAddresses());
    if (user) {
      updateProfile({ addresses: storageService.getAddresses() });
    }
  };

  const deleteAddress = (id: string) => {
    storageService.deleteAddress(id);
    setAddresses(storageService.getAddresses());
    if (user) {
      updateProfile({ addresses: storageService.getAddresses() });
    }
  };

  const setDefaultAddress = (id: string) => {
    const list = storageService.getAddresses().map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    list.forEach((a) => storageService.saveAddress(a));
    setAddresses(list);
    if (user) {
      updateProfile({ addresses: list });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isFirebaseActive,
        isLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        switchRole,
        updateProfile,
        submitKyc,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
