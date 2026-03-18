'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Beef, Search, ChevronRight, User, X, Clock, Star, Music } from 'lucide-react';
import MenuCard from '@/components/MenuCard';
import AIAssistant from '@/components/AIAssistant';

const translations: any = {
  TH: {
    table: 'โต๊ะ',
    steakPoints: 'แต้มสเต็ก',
    search: 'ค้นหาเมนู...',
    pay: 'จ่ายที่โต๊ะ',
    items: 'รายการ',
    orderStatus: 'สถานะออเดอร์',
    preparing: 'กำลังเตรียมอาหาร',
    inQueue: 'รอคิว',
    completed: 'เสร็จสิ้น',
    dismiss: 'ปิด',
    viewDetails: 'ดูรายละเอียด',
    neighborAI: 'Chef Dek Ouan',
    askMe: 'ถามอะไรก็ได้!',
    placeholder: 'ถามเชฟได้เลย...',
    orderReceived: 'ได้รับออเดอร์แล้ว!',
    pointsEarned: 'คุณได้รับเหรียญสเต็ก!',
    streak: 'กินต่อเนื่อง',
    days: 'ครั้ง',
    coinUnit: 'SC'
  },
  EN: {
    table: 'Table',
    steakPoints: 'Steak Points',
    search: 'Search menu...',
    pay: 'Pay at Table',
    items: 'items',
    orderStatus: 'Order Status',
    preparing: 'Preparing',
    inQueue: 'In Queue',
    completed: 'Completed',
    dismiss: 'Dismiss',
    viewDetails: 'View Details',
    neighborAI: 'Chef Dek Ouan',
    askMe: 'Ask me anything!',
    placeholder: 'Ask the Chef...',
    orderReceived: 'Order Received!',
    pointsEarned: 'You earned Steak Coins!',
    streak: 'Streak',
    days: 'TIMES',
    coinUnit: 'SC'
  }
};

const menuItems = [
  {
    id: 1,
    name: { TH: 'ข้าวคั่วพริกเกลือสันคอหมู', EN: 'Pork Neck Chili & Salt Rice' },
    price: 99,
    category: { TH: 'จานเดี่ยว', EN: 'Single Dish' },
    description: { TH: 'รสชาติเข้มข้น คั่วพริกเกลือหอมๆ สันคอหมูนุ่มๆ', EN: 'Tender pork neck stir-fried with aromatic chili and salt.' },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 2,
    name: { TH: 'ข้าวคั่วพริกเกลือไก่ย่าง', EN: 'Grilled Chicken Chili & Salt Rice' },
    price: 99,
    category: { TH: 'จานเดี่ยว', EN: 'Single Dish' },
    description: { TH: 'ไก่ย่างนุ่มคั่วพริกเกลือ รสชาติไทยแท้', EN: 'Soft grilled chicken tossed in authentic Thai chili and salt.' },
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 3,
    name: { TH: 'ซอฟท์เสิร์ฟ', EN: 'Soft Serve' },
    price: 0,
    pointPrice: 0,
    category: { TH: 'เมนูใหม่', EN: 'New Menu' },
    isNew: true,
    description: { TH: 'ของหวานฟรี สำหรับลูกค้าทุกท่าน', EN: 'Complimentary dessert for all our neighbors.' },
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 4,
    name: { TH: 'สเต็กไก่สไปซี่', EN: 'Spicy Chicken Steak' },
    price: 129,
    category: { TH: 'สเต็ก', EN: 'Steak' },
    description: { TH: 'ไก่หมักเครื่องเทศ รสเผ็ดนิดๆ เสิร์ฟพร้อมเฟรนช์ฟรายส์', EN: 'Spiced marinated chicken with a kick, served with fries.' },
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 5,
    name: { TH: 'น้ำเปล่า', EN: 'Water' },
    price: 15,
    category: { TH: 'เครื่องดื่ม', EN: 'Drinks' },
    description: { TH: 'น้ำเปล่าเย็นชื่นใจ', EN: 'Refreshing cold water.' },
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 6,
    name: { TH: 'โค้ก', EN: 'Coke' },
    price: 25,
    category: { TH: 'เครื่องดื่ม', EN: 'Drinks' },
    description: { TH: 'เครื่องดื่มอัดลมสุดซ่า', EN: 'Fizzy soda.' },
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 7,
    name: { TH: 'ขอเพลง', EN: 'Song Request' },
    price: 0,
    pointPrice: 9,
    category: { TH: 'ขอเพลง', EN: 'Song Request' },
    description: { TH: 'เลือกเพลงที่อยากฟังในร้านได้เลย! ใช้ 9 แต้ม', EN: 'Pick a song to play in the shop! 9 points per request.' },
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 8,
    name: { TH: 'สเต็กพริกไทยดำ', EN: 'Black Pepper Steak' },
    price: 159,
    category: { TH: 'สเต็ก', EN: 'Steak' },
    isNew: true,
    description: { TH: 'สเต็กพริกไทยดำรสชาติเข้มข้น หอมกรุ่น', EN: 'Intense black pepper flavor, aromatic and juicy.' },
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 9,
    name: { TH: 'สเต็กปลาแซลมอนกริลล์', EN: 'Grilled Salmon Steak' },
    price: 289,
    category: { TH: 'สเต็ก', EN: 'Steak' },
    isNew: true,
    description: { TH: 'แซลมอนสดกริลล์พอดีคำ เสิร์ฟพร้อมซอสเลมอน', EN: 'Freshly grilled salmon served with a zesty lemon sauce.' },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 10,
    name: { TH: 'สเต็กหมูคุโรบูตะ', EN: 'Kurobuta Pork Steak' },
    price: 199,
    category: { TH: 'สเต็ก', EN: 'Steak' },
    isNew: true,
    description: { TH: 'หมูคุโรบูตะนุ่มพิเศษ ย่างจนหอมกรุ่น', EN: 'Ultra-tender Kurobuta pork, grilled to perfection.' },
    image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 11,
    name: { TH: 'สเต็กเนื้อริบอายวากิว', EN: 'Ribeye Wagyu Steak' },
    price: 399,
    category: { TH: 'สเต็ก', EN: 'Steak' },
    isNew: true,
    description: { TH: 'เนื้อวากิวพรีเมียม นุ่มละลายในปาก', EN: 'Premium Wagyu ribeye, melts in your mouth.' },
    image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 12,
    name: { TH: 'มันบดอบชีสลาวา', EN: 'Cheesy Mashed Potato' },
    price: 69,
    category: { TH: 'เมนูใหม่', EN: 'New Menu' },
    isNew: true,
    description: { TH: 'มันบดเนื้อเนียน อบพร้อมชีสยืดๆ', EN: 'Creamy mashed potatoes with gooey melted cheese.' },
    image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 13,
    name: { TH: 'ปีกไก่ทอดน้ำปลา', EN: 'Fish Sauce Wings' },
    price: 89,
    category: { TH: 'เมนูใหม่', EN: 'New Menu' },
    isNew: true,
    description: { TH: 'ปีกไก่ทอดกรอบ คลุกเคล้าน้ำปลาหอมๆ', EN: 'Crispy fried wings tossed in aromatic fish sauce.' },
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 14,
    name: { TH: 'ข้าวผัดกระเทียมเชฟเด็กอ้วน', EN: 'Chef Garlic Fried Rice' },
    price: 49,
    category: { TH: 'จานเดี่ยว', EN: 'Single Dish' },
    isNew: true,
    description: { TH: 'ข้าวผัดกระเทียมสูตรพิเศษ หอมกระเทียมเน้นๆ', EN: 'Signature garlic fried rice, bursting with flavor.' },
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: 15,
    name: { TH: 'สลัดผักรวมออร์แกนิก', EN: 'Mixed Organic Salad' },
    price: 79,
    category: { TH: 'เมนูใหม่', EN: 'New Menu' },
    isNew: true,
    description: { TH: 'ผักสดกรอบจากสวน เสิร์ฟพร้อมน้ำสลัดสูตรพิเศษ', EN: 'Fresh garden greens with a specialty house dressing.' },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=400&auto=format&fit=crop'
  }
];

const categories = [
  { TH: 'เมนูใหม่', EN: 'New Menu' },
  { TH: 'จานเดี่ยว', EN: 'Single Dish' },
  { TH: 'สเต็ก', EN: 'Steak' },
  { TH: 'เครื่องดื่ม', EN: 'Drinks' },
  { TH: 'ขอเพลง', EN: 'Song Request' }
];

function ProgressStep({ title, description, status, isActive }: any) {
  const isDone = status === 'Completed';
  const isCurrent = status === 'Current';
  
  return (
    <div className={`flex items-start gap-4 transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
        isDone ? 'bg-accent text-white scale-110' : 
        isCurrent ? 'bg-primary text-white scale-110 animate-pulse' : 'bg-gray-100 text-gray-400'
      }`}>
        {isDone ? <Star size={16} fill="currentColor" /> : <Clock size={16} />}
      </div>
      <div className="space-y-1">
        <h4 className={`font-black leading-none ${isCurrent ? 'text-primary' : isDone ? 'text-accent' : 'text-gray-400'}`}>
          {title}
        </h4>
        <p className="text-xs font-bold text-gray-400 leading-tight">{description}</p>
      </div>
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function OrderingPage() {
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');
  const [activeCategory, setActiveCategory] = useState('เมนูใหม่');
  const [cart, setCart] = useState<{ id: number; quantity: number; metadata?: any }[]>([]);
  const [steakPoints, setSteakPoints] = useState(150);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTrackerDetail, setShowTrackerDetail] = useState(false);
  const [activeOrder, setActiveOrder] = useState<{ id: number; status: string } | null>(null);
  
  // Song Request State
  const [showSongModal, setShowSongModal] = useState(false);
  const [songTitle, setSongTitle] = useState('');

  const t = translations[language];

  useEffect(() => {
    // Polling logic...
    let interval: NodeJS.Timeout;
    if (activeOrder && activeOrder.status !== 'Completed') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/orders`);
          const orders = await res.json();
          const current = orders.find((o: any) => o.id === activeOrder.id);
          if (current && current.status !== activeOrder.status) {
            setActiveOrder({ id: current.id, status: current.status });
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  const cartTotal = cart.reduce((acc, curr) => {
    const item = menuItems.find(i => i.id === curr.id);
    return acc + (item?.price || 0) * curr.quantity;
  }, 0);

  const cartPointTotal = cart.reduce((acc, curr) => {
    const item = menuItems.find(i => i.id === curr.id);
    return acc + (item?.pointPrice || 0) * curr.quantity;
  }, 0);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const addToCart = (id: number) => {
    if (id === 7) {
      setShowSongModal(true);
      return;
    }

    const item = menuItems.find(i => i.id === id);
    if (item && item.pointPrice && item.pointPrice > 0) {
      // Basic check for points
      const currentPointsInCart = cart.reduce((acc, curr) => {
        const cartItem = menuItems.find(i => i.id === curr.id);
        return acc + (cartItem?.pointPrice || 0) * curr.quantity;
      }, 0);

      if (currentPointsInCart + item.pointPrice > steakPoints) {
        alert(language === 'TH' ? 'แต้มสเต็กไม่เพียงพอ!' : 'Not enough Steak Points!');
        return;
      }
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const confirmSongRequest = () => {
    if (!songTitle.trim()) return;
    
    const item = menuItems.find(i => i.id === 7);
    if (item && item.pointPrice && item.pointPrice > steakPoints) {
      alert(language === 'TH' ? 'แต้มสเต็กไม่เพียงพอ!' : 'Not enough Steak Points!');
      return;
    }

    setCart(prev => [...prev, { id: 7, quantity: 1, metadata: { title: songTitle } }]);
    setSongTitle('');
    setShowSongModal(false);
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    if (cartTotal === 0 && cartPointTotal > 0) {
      // If only point items, skip QR
      handleConfirmPayment();
    } else {
      setShowPaymentQR(true);
    }
  };

  const handleConfirmPayment = async () => {
    setShowPaymentQR(false);
    
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          table_number: "6"
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        setActiveOrder({ id: orderData.id, status: 'Pending' });
        const earned = Math.floor(cartTotal * 0.1);
        setLastEarnedPoints(earned);
        setSteakPoints(prev => prev + earned - cartPointTotal);
        setShowSuccess(true);
        setCart([]);
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(language === 'TH' ? "การเชื่อมต่อขัดข้อง กรุณาลองใหม่!" : "Backend connection error. Please try again!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground font-sans max-w-lg mx-auto relative border-x border-gray-100 shadow-2xl">
      {/* Friendly Header - Moderate Z-Index so modals appear above it */}
      <header className={`sticky top-0 z-[50] px-6 py-5 transition-all duration-500 ${
        showTrackerDetail || showPaymentQR || showSuccess || showSongModal 
          ? 'bg-white/20 blur-[1px] pointer-events-none' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-50'
      }`}>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-primary">{t.table} 6</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Steak Dek Ouan</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex bg-gray-50 p-1 rounded-xl text-[10px] font-black border border-gray-100 shadow-inner">
              <button 
                onClick={() => { setLanguage('TH'); setActiveCategory('เมนูใหม่'); }}
                className={`px-2 py-1 rounded-lg transition-all ${language === 'TH' ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
              >
                TH
              </button>
              <button 
                onClick={() => { setLanguage('EN'); setActiveCategory('New Menu'); }}
                className={`px-2 py-1 rounded-lg transition-all ${language === 'EN' ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
              >
                EN
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{t.steakPoints}</span>
                <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full font-black text-sm transition-all hover:scale-105 cursor-default">
                  <Beef size={14} fill="currentColor" />
                  {steakPoints}
                </div>
              </div>
            </div>
            <button className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-4 no-scrollbar mt-6 -mx-6 px-6 select-none touch-pan-x overscroll-x-contain">
          {categories.map(cat => (
            <button
              key={cat[language]}
              draggable="false"
              onClick={() => setActiveCategory(cat[language])}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
                activeCategory === cat[language]
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {cat[language]}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Menu Section */}
      <main className="flex-1 p-6 space-y-8">
        {/* Live Order Tracker Banner - Moved here so it can be blurred */}
        {activeOrder && (
          <div 
            onClick={() => setShowTrackerDetail(true)}
            className={`-mx-6 -mt-6 mb-8 px-6 py-4 cursor-pointer hover:brightness-110 active:scale-[0.98] ${activeOrder.status === 'Completed' ? 'bg-accent' : 'bg-primary'} text-white flex justify-between items-center transition-all duration-500 shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                {activeOrder.status === 'Completed' ? <Star size={16} fill="currentColor" /> : <Clock size={16} className="animate-spin-slow" />}
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{t.orderStatus}</p>
                <h4 className="font-black text-sm">#{activeOrder.id}: {activeOrder.status === 'Pending' ? t.inQueue : (activeOrder.status === 'Completed' ? t.completed : t.preparing)}...</h4>
              </div>
            </div>
            {activeOrder.status === 'Completed' ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveOrder(null);
                }} 
                className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
              >
                {t.dismiss}
              </button>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">{t.viewDetails}</span>
            )}
          </div>
        )}

        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-black tracking-tight">{activeCategory}</h2>
          <div className="text-primary hover:underline font-bold text-sm cursor-pointer flex items-center gap-1">
            See All <ChevronRight size={14} />
          </div>
        </div>

        <div className="grid gap-6">
          {menuItems
            .filter(item => {
              const isNewTab = activeCategory === 'เมนูใหม่' || activeCategory === 'New Menu';
              if (isNewTab) {
                return item.isNew;
              }
              return item.category[language] === activeCategory;
            })
            .map(item => (
              <MenuCard 
                key={item.id} 
                item={{
                  ...item,
                  name: item.name[language],
                  description: item.description[language]
                }} 
                onAdd={addToCart} 
              />
            ))}
        </div>
      </main>

      {/* Floating Checkout "Hero" */}
      <footer className="sticky bottom-0 p-6 z-40 pointer-events-none">
        <button 
          onClick={startCheckout}
          disabled={cartCount === 0}
          className={`pointer-events-auto w-full bg-primary text-white py-5 px-8 rounded-[32px] font-black text-lg flex justify-between items-center shadow-2xl transition-all duration-500 active:scale-95 ${
            cartCount > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center text-sm">
              {cartCount}
            </div>
            <span>{t.pay}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">฿{cartTotal}</span>
            <ChevronRight className="opacity-50" />
          </div>
        </button>
      </footer>

      {/* Song Request Modal */}
      {showSongModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            {/* Header Image */}
            <div className="relative h-32 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop" 
                alt="DJ Booth" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>
            
            <div className="p-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/10">
                <Music size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-900">
                {language === 'TH' ? 'ขอเพลงที่คุณรัก' : 'Request Your Song'}
              </h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6 italic flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                {language === 'TH' ? 'ระบุชื่อเพลงและศิลปิน (ใช้ 9 แต้ม)' : 'Enter song & artist (costs 9 pts)'}
              </p>
              
              <input 
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder={language === 'TH' ? 'เช่น: หมอลำซิ่ง - ลำเพลิน' : 'e.g.: Molam Sing - Lumplearn'}
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl mb-6 font-bold outline-none focus:border-primary/30 focus:bg-white transition-all shadow-inner text-gray-900 placeholder:text-gray-300"
                autoFocus
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSongModal(false)}
                  className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-black transition-all active:scale-95 border border-gray-100 hover:bg-gray-100"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button 
                  onClick={confirmSongRequest}
                  disabled={!songTitle.trim()}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 hover:opacity-90"
                >
                  {language === 'TH' ? 'ยืนยัน' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PromptPay Payment Modal */}
      {showPaymentQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            {/* Modal Header */}
            <div className="bg-blue-600 p-6 text-white text-center relative">
              <button 
                onClick={() => setShowPaymentQR(false)}
                className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X size={16} />
              </button>
              <h3 className="text-xl font-black">{language === 'TH' ? 'สแกนเพื่อจ่าย' : 'Scan to Pay'}</h3>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest">PromptPay (พร้อมเพย์)</p>
            </div>

            {/* QR Section */}
            <div className="p-8 flex flex-col items-center gap-6">
              <div className="bg-gray-50 p-6 rounded-[32px] border-4 border-blue-600/10 relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PROMPTPAY_${cartTotal}`}
                  alt="PromptPay QR Code"
                  className="w-48 h-48 rounded-lg"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-lg border shadow-sm">
                  <div className="bg-blue-600 text-white text-[8px] font-black px-1 py-0.5 rounded uppercase">ThaiQR</div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">{language === 'TH' ? 'ยอดที่ต้องชำระ' : 'Amount to pay'}</span>
                <p className="text-4xl font-black text-blue-600">฿{cartTotal.toLocaleString()}</p>
              </div>

              <button 
                onClick={handleConfirmPayment}
                className="w-full bg-blue-600 text-white py-4 rounded-[24px] font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
              >
                {language === 'TH' ? 'ยืนยันการชำระเงิน' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AIAssistant language={language} t={t} />

      {/* Success Animation */}
      {showSuccess && (
        <div 
          onClick={() => setShowSuccess(false)}
          className="fixed inset-0 bg-white/95 z-[200] flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in duration-500 cursor-pointer"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-20"></div>
            <div className="w-32 h-32 bg-accent text-white rounded-[48px] flex items-center justify-center shadow-2xl relative z-10 rotate-12">
              <Beef size={64} fill="currentColor" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-center leading-none mb-4">{t.orderReceived}</h2>
          <p className="text-gray-400 font-bold text-center mb-10 max-w-xs">{t.pointsEarned}</p>
          <div className="bg-accent/10 px-8 py-4 rounded-[24px] flex items-center gap-4 border border-accent/20">
            <span className="text-accent font-black text-2xl flex items-center gap-2">
              <Beef size={24} fill="currentColor" />
              +{lastEarnedPoints}
            </span>
            <div className="w-px h-8 bg-accent/20"></div>
            <span className="text-accent font-black">3 {t.days} {t.streak} 🔥</span>
          </div>
          <p className="mt-12 text-[10px] font-black uppercase tracking-widest text-gray-300 animate-pulse">
            {language === 'TH' ? 'แตะเพื่อปิด' : 'Tap anywhere to dismiss'}
          </p>
        </div>
      )}

      {/* Order Progress Detail Modal */}
      {showTrackerDetail && activeOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="bg-primary p-8 text-white relative">
              <button 
                onClick={() => setShowTrackerDetail(false)}
                className="absolute top-6 right-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{t.viewDetails}</p>
              <h3 className="text-3xl font-black">{language === 'TH' ? 'ออเดอร์' : 'Order'} #{activeOrder.id}</h3>
              <p className="text-xs font-bold mt-2 bg-white/20 inline-block px-3 py-1 rounded-lg">
                {language === 'TH' ? 'โต๊ะ' : 'Table'} 6 • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="p-8 space-y-8">
              <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                <ProgressStep 
                  title={language === 'TH' ? 'รับออเดอร์แล้ว' : 'Order Received'} 
                  description={language === 'TH' ? 'เราได้รับออเดอร์แล้ว! แจ้งห้องครัวเรียบร้อย' : 'We\'ve got your order! Kitchen notified.'} 
                  status="Completed" 
                  isActive={true} 
                />
                <ProgressStep 
                  title={language === 'TH' ? 'กำลังปรุงอาหาร' : 'Preparing & Cooking'} 
                  description={language === 'TH' ? 'เชฟของเรากำลังปรุงอาหารให้อย่างตั้งใจ' : 'Our chefs are crafting your meal with care.'} 
                  status={activeOrder.status === 'Completed' ? 'Completed' : (activeOrder.status === 'Pending' ? 'Upcoming' : 'Current')} 
                  isActive={activeOrder.status !== 'Pending'} 
                />
                <ProgressStep 
                  title={language === 'TH' ? 'ตรวจสอบคุณภาพ' : 'Quality Check'} 
                  description={language === 'TH' ? 'จัดจานและตรวจสอบความเรียบร้อย' : 'Plating and final touches.'} 
                  status={activeOrder.status === 'Completed' ? 'Completed' : 'Upcoming'} 
                  isActive={activeOrder.status === 'Completed'} 
                />
                <ProgressStep 
                  title={language === 'TH' ? 'พร้อมเสิร์ฟ' : 'Ready for Service'} 
                  description={language === 'TH' ? 'พนักงานกำลังนำอาหารไปเสิร์ฟที่โต๊ะ!' : 'Your friendly neighbor server is on the way!'} 
                  status={activeOrder.status === 'Completed' ? 'Current' : 'Upcoming'} 
                  isActive={activeOrder.status === 'Completed'} 
                />
              </div>

              <button 
                onClick={() => setShowTrackerDetail(false)}
                className="w-full bg-gray-100 text-gray-900 py-4 rounded-[24px] font-black text-lg hover:bg-gray-200 transition-all active:scale-95 mt-4"
              >
                {language === 'TH' ? 'กลับไปที่หน้าเมนู' : 'Back to Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
