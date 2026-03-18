'use client';

import React from 'react';

interface MenuCardProps {
  item: {
    id: number;
    name: string;
    price: number;
    pointPrice?: number;
    description: string;
    image: string;
  };
  onAdd: (id: number) => void;
}

export default function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div className="group bg-white rounded-[32px] p-4 flex gap-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-300">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-28 h-28 rounded-[24px] object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <button 
          onClick={() => onAdd(item.id)}
          className="absolute -bottom-2 -right-2 bg-primary text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"
        >
          <span className="text-xl font-bold">+</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1">
        <h3 className="font-black text-lg leading-none tracking-tight">{item.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 leading-snug">{item.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {item.price > 0 ? (
            <span className="text-xl font-black text-primary">฿{item.price}</span>
          ) : item.pointPrice !== undefined ? (
            <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-2 py-1 rounded-lg font-black text-xs">
              <span className="text-sm">{item.pointPrice}</span>
              <span>Points</span>
            </div>
          ) : (
            <span className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              Free Perk
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

