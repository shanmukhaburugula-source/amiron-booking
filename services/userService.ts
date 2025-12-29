
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "../types";
import { deleteUser as deleteAuthUser } from "firebase/auth";

export const syncUserToFirestore = async (user: User) => {
  const userRef = doc(db, "users", user.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      id: user.id,
      name: user.name,
      email: user.email,
      photoFileName: user.photoFileName || "default_profile.png",
      createdAt: new Date().toISOString()
    });
  }
  return userSnap.exists() ? userSnap.data() as User : user;
};

export const updateFirestoreUser = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};

export const deleteUserAccount = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
  
  const currentUser = auth.currentUser;
  if (currentUser) {
    await deleteAuthUser(currentUser);
  }
};
