'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  language: 'TH' | 'EN';
  t: any;
}

export default function AIAssistant({ language, t }: AIAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    
    // Simulate API call to FastAPI
    setTimeout(() => {
      let response = language === 'TH' 
        ? "ฉันพร้อมช่วยเหลือคุณ! สนใจเมนูแนะนำไหม? 'ข้าวคั่วพริกเกลือสันคอหมู' เป็นเมนูยอดฮิตของนักศึกษาเลยนะ!" 
        : "I'm here to help! Looking for a recommendation? The 'Pork Neck Chili & Salt Rice' is a student favorite!";
      
      if (userMsg.toLowerCase().includes('recommend') || userMsg.includes('แนะนำ')) {
        response = language === 'TH'
          ? "เมนูยอดฮิตคือ 'ข้าวคั่วพริกเกลือสันคอหมู' (฿99) ให้ฉันเพิ่มลงในตะกร้าเลยไหม?"
          : "Our student favorite is 'Pork Neck Chili & Salt Rice' (฿99). Should I add one to your cart?";
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-32 right-6 z-50 flex flex-col items-end gap-3">
      {isChatOpen && (
        <div className="w-80 bg-white rounded-[32px] shadow-2xl border border-gray-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-primary p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm leading-none">{t.neighborAI}</h4>
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{t.askMe}</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {chatMessages.length === 0 && (
              <p className="text-gray-400 text-sm font-bold text-center py-10 opacity-50">
                {t.askMe}
              </p>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-sm font-bold shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white' : 'bg-white text-gray-800 border border-gray-50'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-white flex gap-2">
            <input 
              className="flex-1 bg-gray-50 rounded-2xl px-4 py-2 text-sm font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
              placeholder={t.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage} 
              className="bg-primary text-white p-2 rounded-2xl shadow-lg shadow-primary/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`w-14 h-14 bg-primary text-white rounded-[20px] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${!isChatOpen && 'animate-bounce'}`}
      >
        {isChatOpen ? <X /> : <MessageCircle fill="currentColor" />}
      </button>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
