// src/hooks/useAdminAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function useAdminAuth() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkAdminStatus(user);
    });

    return () => unsubscribe();
  }, [router]);

  return { isAdmin, loading };
}