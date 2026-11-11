import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { Product, Booking, RepairTicket, KycRecord, UserProfile, UserRole } from '../types';

export const firestoreService = {
  // =================== PRODUCTS (Public Read) ===================
  async getProducts(): Promise<Product[]> {
    const path = 'products';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => d.data() as Product);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  listenProducts(onUpdate: (products: Product[]) => void): Unsubscribe {
    const path = 'products';
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as Product);
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async saveProduct(product: Product): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `products/${product.id}`;
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async seedProducts(products: Product[]): Promise<number> {
    if (!auth?.currentUser) return 0;
    const batchSize = 400;
    let seeded = 0;
    for (let i = 0; i < products.length; i += batchSize) {
      const chunk = products.slice(i, i + batchSize);
      const batch = writeBatch(db);
      chunk.forEach((p) => {
        const ref = doc(db, 'products', p.id);
        batch.set(ref, p);
      });
      await batch.commit();
      seeded += chunk.length;
    }
    return seeded;
  },

  // =================== USERS (Private per user) ===================
  async getUser(uid: string): Promise<UserProfile | null> {
    if (!auth?.currentUser) return null;
    const path = `users/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? (snap.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async saveUser(user: UserProfile): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `users/${user.id}`;
    try {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // =================== BOOKINGS ===================
  listenBookings(
    userId: string | undefined,
    role: UserRole,
    onUpdate: (bookings: Booking[]) => void
  ): Unsubscribe {
    // Only attach listener if authenticated with Firebase
    if (!auth?.currentUser) {
      return () => {};
    }

    const currentUid = auth.currentUser.uid;
    const currentEmail = auth.currentUser.email || '';
    const isAdmin = currentEmail === 'likitha.25mic7334@vitapstudent.ac.in';
    const path = 'bookings';

    let q;
    if (role === 'admin' && isAdmin) {
      q = collection(db, path);
    } else if (role === 'owner') {
      q = query(collection(db, path), where('ownerId', '==', currentUid));
    } else {
      q = query(collection(db, path), where('userId', '==', currentUid));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as Booking);
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  async saveBooking(booking: Booking): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `bookings/${booking.id}`;
    try {
      await setDoc(doc(db, 'bookings', booking.id), booking);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // =================== REPAIR TICKETS ===================
  listenRepairTickets(
    userId: string | undefined,
    role: UserRole,
    onUpdate: (tickets: RepairTicket[]) => void
  ): Unsubscribe {
    // Only attach listener if authenticated with Firebase
    if (!auth?.currentUser) {
      return () => {};
    }

    const currentUid = auth.currentUser.uid;
    const currentEmail = auth.currentUser.email || '';
    const isAdmin = currentEmail === 'likitha.25mic7334@vitapstudent.ac.in';
    const path = 'repairTickets';

    let q;
    if (role === 'admin' && isAdmin) {
      q = collection(db, path);
    } else if (role === 'owner') {
      q = query(collection(db, path), where('ownerId', '==', currentUid));
    } else {
      q = query(collection(db, path), where('userId', '==', currentUid));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as RepairTicket);
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  async saveRepairTicket(ticket: RepairTicket): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `repairTickets/${ticket.id}`;
    try {
      await setDoc(doc(db, 'repairTickets', ticket.id), ticket);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateRepairTicket(ticketId: string, updates: Partial<RepairTicket>): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `repairTickets/${ticketId}`;
    try {
      await updateDoc(doc(db, 'repairTickets', ticketId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // =================== KYC RECORDS ===================
  listenKycRecords(
    userId: string | undefined,
    role: UserRole,
    onUpdate: (records: KycRecord[]) => void
  ): Unsubscribe {
    // Only attach listener if authenticated with Firebase
    if (!auth?.currentUser) {
      return () => {};
    }

    const currentUid = auth.currentUser.uid;
    const currentEmail = auth.currentUser.email || '';
    const isAdmin = currentEmail === 'likitha.25mic7334@vitapstudent.ac.in';
    const path = 'kyc';

    let q;
    if (role === 'admin' && isAdmin) {
      q = collection(db, path);
    } else {
      q = query(collection(db, path), where('userId', '==', currentUid));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as KycRecord);
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  async saveKycRecord(record: KycRecord): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `kyc/${record.id}`;
    try {
      await setDoc(doc(db, 'kyc', record.id), record);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateKycRecord(kycId: string, updates: Partial<KycRecord>): Promise<void> {
    if (!auth?.currentUser) return;
    const path = `kyc/${kycId}`;
    try {
      await updateDoc(doc(db, 'kyc', kycId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },
};
