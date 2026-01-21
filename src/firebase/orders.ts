import { db } from './orders'; // your Firestore init
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveOrderToFirestore = async (userId: string, order: any) => {
  await addDoc(collection(db, 'orders'), {
    userId,
    ...order,
    createdAt: serverTimestamp(),
  });
};
