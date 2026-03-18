'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Order {
  id: number;
  table_number: string;
  status: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>([
    // Mocking initial orders for simulation
    { id: 101, table_number: '6', status: 'Pending', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: 102, table_number: '2', status: 'Pending', created_at: new Date(Date.now() - 4 * 60000).toISOString() },
    { id: 103, table_number: '8', status: 'Pending', created_at: new Date(Date.now() - 8 * 60000).toISOString() },
  ]);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const getWaitTime = (createdAt: string) => {
    const start = new Date(createdAt);
    const diff = Math.floor((now.getTime() - start.getTime()) / 60000);
    return diff;
  };

  const getColorClass = (minutes: number) => {
    if (minutes >= 10) return 'bg-red-50 border-red-200 text-red-700';
    if (minutes >= 5) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-green-50 border-green-200 text-green-700';
  };

  const completeOrder = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
      }
    } catch (e) {
      console.error("Failed to sync status to backend", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="bg-red-600 px-2 py-1 rounded">KDS</span> 
            KITCHEN DISPLAY SYSTEM
          </h1>
          <p className="text-gray-400 mt-1 uppercase text-xs tracking-widest font-bold">Steak Dek Ouan - Back of House</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono">{now.toLocaleTimeString()}</p>
          <p className="text-gray-500 text-xs uppercase">Live Status</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((order) => {
            const waitTime = getWaitTime(order.created_at);
            const colorClass = getColorClass(waitTime);

            return (
              <div key={order.id} className={`rounded-2xl border-2 p-5 flex flex-col justify-between shadow-xl transition-all ${colorClass}`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl font-black">TABLE {order.table_number}</span>
                    <div className="flex items-center gap-1 font-bold text-sm">
                      <Clock size={16} />
                      {waitTime}m
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between border-b border-current border-opacity-20 pb-1">
                      <span className="font-medium">Order ID</span>
                      <span className="font-mono">#{order.id}</span>
                    </div>
                    <p className="text-sm mt-4 font-semibold uppercase tracking-wider opacity-80">Items:</p>
                    <ul className="text-lg font-bold list-disc list-inside">
                      <li>สันคอหมู x 1</li>
                      <li>ไก่ย่าง x 2</li>
                      <li>สลัดบาร์ x 1</li>
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => completeOrder(order.id)}
                  className="w-full bg-white bg-opacity-90 hover:bg-opacity-100 text-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                  <CheckCircle size={24} />
                  COMPLETE ORDER
                </button>
              </div>
            );
          })}
        
        {orders.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
            <CheckCircle className="mx-auto text-gray-700 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">No Active Orders</h2>
            <p className="text-gray-600">The kitchen is all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
