'use client';
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function PromoBanner({ text, active }) {
  const [visible, setVisible] = useState(true);

  if (!active || !text || !visible) return null;

  return (
    <aside aria-label="Promoción destacada" className="relative bg-gradient-to-r from-[#D95F00] via-[#F56F06] to-[#E05300] text-white py-2.5 px-4 text-center text-xs md:text-sm font-semibold tracking-wide shadow-md flex items-center justify-center gap-2 z-40">
      <Sparkles className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
      <span className="truncate max-w-[85vw]">{text}</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 p-1 hover:bg-black/20 rounded-full transition-colors text-white/80 hover:text-white"
        aria-label="Cerrar promoción"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
}
