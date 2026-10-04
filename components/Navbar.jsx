'use client';
import { ShoppingBag, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ cartCount, cartTotal, onOpenCart, isOpenNow, statusText, restaurantName, logoUrl }) {
  return (
    <header className="sticky top-0 z-30 bg-[#140D07]/90 backdrop-blur-md border-b border-[#F56F06]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#F56F06]/30 shadow-lg shadow-[#F56F06]/10 group-hover:scale-105 transition-transform bg-[#1C130B] flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={restaurantName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">🍔</span>
            )}
          </div>
          <div>
            <span className="font-extrabold text-base md:text-lg tracking-tight text-white block leading-none font-['Rubik'] group-hover:text-[#F56F06] transition-colors">
              {restaurantName || 'La Sazón de Jessy'}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
              <span className="text-[11px] text-[#BBA999] font-medium">
                {statusText || (isOpenNow ? 'Abierto ahora' : 'Cerrado ahora')}
              </span>
            </div>
          </div>
        </Link>

        {/* Acciones de Navbar */}
        <div className="flex items-center gap-3">
          {/* Botón Carrito */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#D95F00] to-[#F56F06] hover:from-[#F56F06] hover:to-[#FF8324] text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-[#F56F06]/25 transition-all hover:scale-105 active:scale-95"
            aria-label="Ver Carrito de Pedido"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Mi Pedido</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#D95F00] text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="text-xs font-black text-amber-100 hidden md:inline border-l border-white/20 pl-2">
                ${cartTotal.toFixed(2).replace('.', ',')}
              </span>
            )}
          </button>

          {/* Enlace Admin */}
          <Link
            href="/admin"
            className="p-2.5 rounded-xl border border-[#F56F06]/20 bg-[#1C130B]/80 text-[#BBA999] hover:text-white hover:border-[#F56F06]/50 transition-colors"
            title="Panel de Administración"
          >
            <ShieldCheck className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </header>
  );
}
