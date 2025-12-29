
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  writeBatch, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { Booking, AvailabilitySlot } from "../types";
import { AVAILABILITY_SCHEDULE } from "../constants";

export const getAvailabilitySettings = async (): Promise<AvailabilitySlot[]> => {
  try {
    const settingsRef = doc(db, "settings", "availability");
    const snap = await getDoc(settingsRef);
    if (snap.exists() && snap.data().slots) {
      return snap.data().slots as AvailabilitySlot[];
    }
  } catch (err) {
    console.error("Error fetching availability settings:", err);
  }
  return AVAILABILITY_SCHEDULE;
};

export const getGlobalBookings = async (): Promise<Booking[]> => {
  try {
    const globalRef = collection(db, "globalBookings");
    const snap = await getDocs(globalRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (err) {
    console.error("Error fetching global bookings:", err);
    return [];
  }
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const userBookingsRef = collection(db, "users", userId, "bookings");
    const snap = await getDocs(userBookingsRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    return [];
  }
};

export const createNewBooking = async (userId: string, bookingData: Partial<Booking>) => {
  const bookingId = Math.random().toString(36).substr(2, 9);
  const batch = writeBatch(db);
  
  const now = new Date().toISOString();
  const finalData = {
    ...bookingData,
    id: bookingId,
    userId,
    paymentStatus: 'paid',
    createdAt: now,
  };

  // 1. Add to user's sub-collection: /users/{userId}/bookings/{bookingId}
  const userBookingRef = doc(db, "users", userId, "bookings", bookingId);
  batch.set(userBookingRef, finalData);

  // 2. Add to global collection: /globalBookings/{bookingId}
  const globalBookingRef = doc(db, "globalBookings", bookingId);
  batch.set(globalBookingRef, {
    userId,
    startTime: finalData.startTime,
    endTime: finalData.endTime,
    duration: finalData.duration,
    paymentStatus: 'paid',
    createdAt: now,
    // Including sessionType and date for easier conflict checking UI-side
    sessionType: finalData.sessionType,
    date: finalData.date
  });

  await batch.commit();
  return finalData as Booking;
};
