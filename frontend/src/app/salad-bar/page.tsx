"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SaladBarRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/analytics');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans text-black">
      <div className="text-center">
        <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter text-primary">Redirecting to Management Hub...</h1>
        <p className="text-gray-400 font-bold text-sm italic">One-stop operational center for staff.</p>
      </div>
    </div>
  );
}
