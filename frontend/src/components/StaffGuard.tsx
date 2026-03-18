'use client';

import React, { useState } from 'react';
import { Lock, ChevronRight, X } from 'lucide-react';

interface StaffGuardProps {
  children: React.ReactNode;
  role: string;
}

export default function StaffGuard({ children, role }: StaffGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const correctPin = "1234"; // Simple PIN for prototype simulation

  const handleInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          setIsAuthenticated(true);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-primary z-[200] flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-xs text-center space-y-8">
        <div className="space-y-2">
          <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">{role} ACCESS</h1>
          <p className="text-white/60 font-bold text-sm uppercase tracking-widest">Enter Staff PIN to continue</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                error ? 'bg-red-500 border-red-500 animate-shake' : 
                pin.length > i ? 'bg-white border-white scale-125' : 'border-white/30'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "DEL"].map((key, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (key === "DEL") setPin(pin.slice(0, -1));
                else if (key !== "") handleInput(key);
              }}
              disabled={key === ""}
              className={`h-16 rounded-2xl font-black text-xl transition-all active:scale-90 ${
                key === "" ? 'opacity-0' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
