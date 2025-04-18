import { useEffect, useState } from 'react';
import { db } from '../lib/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useOrderHistory = (userId: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    };

    if (userId) fetchOrders();
  }, [userId]);

  return { orders, loading };
};
