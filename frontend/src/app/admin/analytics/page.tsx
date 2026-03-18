'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, ShoppingBag, Database, RefreshCcw, AlertTriangle, Utensils, Check } from 'lucide-react';
import StaffGuard from '@/components/StaffGuard';

interface Ingredient {
  id: number;
  name: string;
  weight: number; // in grams
  maxWeight: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    total_revenue: 0,
    active_orders: 0,
    avg_wait_time: '0 min',
    customer_satisfaction: '0%'
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: 'Lettuce', weight: 1500, maxWeight: 2000 },
    { id: 2, name: 'Tomatoes', weight: 800, maxWeight: 1500 },
    { id: 3, name: 'Cucumbers', weight: 200, maxWeight: 1200 },
    { id: 4, name: 'Corn', weight: 1200, maxWeight: 1500 },
    { id: 5, name: 'Dressing', weight: 900, maxWeight: 1000 },
  ]);

  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Simulated fetching from backend endpoints
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_URL}/analytics/summary`);
        const data = await res.json();
        setMetrics(data);
      } catch (e) {
        console.error("Dashboard failed to fetch live data:", e);
      }
    };
    fetchAnalytics();
  }, []);

  // Simulate Weight Decrease (IoT Simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setIngredients(prev => prev.map(ing => ({
        ...ing,
        weight: Math.max(0, ing.weight - (Math.random() * 50))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Monitor for Alerts (< 20% capacity)
  useEffect(() => {
    const lowIngredients = ingredients
      .filter(ing => (ing.weight / ing.maxWeight) < 0.20)
      .map(ing => ing.name);
    
    setAlerts(lowIngredients);
  }, [ingredients]);

  const refill = (id: number) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === id ? { ...ing, weight: ing.maxWeight } : ing
    ));
  };

  return (
    <StaffGuard role="MANAGEMENT">
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans text-gray-900">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-primary">
              <BarChart3 size={36} />
              MANAGEMENT HUB
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Steak Dek Ouan - Insights & Performance</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">LIVE SYSTEM OK</span>
          </div>
        </header>

        {/* Alert Banner for Salad Bar */}
        {alerts.length > 0 && (
          <div className="mb-12 bg-primary text-white p-6 rounded-[32px] shadow-xl shadow-primary/20 flex items-center gap-6 animate-in slide-in-from-top duration-500">
            <div className="bg-white/20 p-4 rounded-2xl">
              <AlertTriangle size={32} />
            </div>
            <div className="flex-1">
              <h2 className="font-black text-xl uppercase tracking-tight">Salad Bar Critical Stock!</h2>
              <p className="font-bold opacity-90 text-sm italic">
                {alerts.join(', ')} are below 20%. Dispatch staff to refill.
              </p>
            </div>
            <button className="bg-white text-primary px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all">
              DISPATCH NOW
            </button>
          </div>
        )}

        {/* KPI Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard title="TOTAL REVENUE" value={`฿${metrics.total_revenue.toLocaleString()}`} icon={<TrendingUp />} trend="+12% from yesterday" />
          <KPICard title="ACTIVE ORDERS" value={metrics.active_orders.toString()} icon={<ShoppingBag />} trend="Kitchen load: Medium" color="text-primary" />
          <KPICard title="AVG PREP TIME" value={metrics.avg_wait_time} icon={<Clock />} trend="-1.5 min vs last week" />
          <KPICard title="CUSTOMER SATISFACTION" value={metrics.customer_satisfaction} icon={<Users />} trend="Target: 95%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Food Queue */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-gray-900">
                <Utensils className="text-primary" />
                Live Food Queue
              </h2>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                8 Active Orders
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { id: 1, item: "สเต็กริบอายวากิว", customer: "Neighbor", table: "06", time: "2m ago" },
                { id: 2, item: "ข้าวคั่วพริกเกลือสันคอหมู", customer: "Table 12", table: "12", time: "5m ago" },
                { id: 3, item: "สเต็กหมูคุโรบูตะ", customer: "Neighbor", table: "04", time: "8m ago" },
              ].map((order) => (
                <div key={order.id} className="group p-4 rounded-[24px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm text-gray-900 leading-tight">{order.item}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-2">{order.customer}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-md uppercase tracking-widest">Table {order.table}</span>
                        <span className="text-[9px] font-bold text-gray-300">{order.time}</span>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary hover:text-white transition-all">
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 text-[10px] font-black uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all">
              View Kitchen Display
            </button>
          </div>

          {/* Salad Bar IoT Monitoring */}
          <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-gray-900">
                <Database className="text-primary" />
                Salad Bar IoT Hub
              </h2>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SENSORS ONLINE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ingredients.map((ing) => {
                const percentage = (ing.weight / ing.maxWeight) * 100;
                const isLow = percentage < 20;
                
                return (
                  <div key={ing.id} className={`p-6 rounded-[32px] border ${isLow ? 'bg-primary/5 border-primary/10' : 'bg-gray-50/50 border-gray-100'} transition-all`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-lg text-gray-900 leading-none mb-1">{ing.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 font-mono tracking-tight">{Math.round(ing.weight)}g / {ing.maxWeight}g</p>
                      </div>
                      <span className={`text-xl font-black ${isLow ? 'text-primary animate-pulse' : 'text-gray-900'}`}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4 shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ${isLow ? 'bg-primary' : 'bg-accent'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <button 
                      onClick={() => refill(ing.id)}
                      className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isLow ? 'text-primary' : 'text-gray-400'} hover:opacity-70`}
                    >
                      <RefreshCcw size={12} />
                      Refill
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </StaffGuard>
  );
}

function KPICard({ title, value, icon, trend, color = "text-gray-900" }: { title: string, value: string, icon: React.ReactNode, trend: string, color?: string }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <span className="text-[10px] font-black text-accent uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
    </div>
  );
}
