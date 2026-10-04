'use client';
import { Flame, MapPin, Sparkles, Clock, Utensils } from 'lucide-react';

export default function Hero({ restaurantName, slogan, desc, badge, logoUrl, onExploreMenu }) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 px-4 bg-gradient-to-b from-[#140D07] via-[#0B0704] to-[#0B0704] border-b border-[#F56F06]/10">
      
      {/* Luces de fondo decorativas */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F56F06]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        
        {/* Badge Hero */}
        <div className="inline-flex items-center gap-2 bg-[#1C130B]/90 border border-[#F56F06]/30 text-[#F56F06] px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold mb-6 shadow-inner shadow-[#F56F06]/10">
          <MapPin className="w-3.5 h-3.5 text-[#F56F06]" />
          <span>{badge || 'Muey, Santa Elena'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F56F06]" />
          <span className="text-[#BBA999] font-normal">Sabor Casero Genuino</span>
        </div>

        {/* Logo central */}
        {logoUrl && (
          <div className="w-36 h-36 md:w-48 md:h-48 mb-6 group hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_35px_rgba(245,111,6,0.35)]">
            <img 
              src={logoUrl} 
              alt={restaurantName} 
              className="w-full h-full object-contain filter drop-shadow-xl" 
            />
          </div>
        )}

        {/* Titular */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white mb-4 font-['Rubik'] leading-tight">
          {restaurantName || 'La Sazón de Jessy'}
        </h1>

        {/* Slogan */}
        <p className="text-lg md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent mb-4 max-w-2xl">
          {slogan || 'Comida rápida con auténtico sabor casero'}
        </p>

        {/* Descripción corta */}
        <p className="text-sm md:text-base text-[#BBA999] max-w-xl mb-8 leading-relaxed">
          {desc || 'Hamburguesas al grill, salchipapas, papi pollo y sánduches preparados al momento. ¡Todas tus órdenes incluyen papas fritas de cortesía!'}
        </p>

        {/* Botones de acción rápida */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreMenu}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D95F00] to-[#F56F06] hover:from-[#F56F06] hover:to-[#FF8324] text-white font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-[#F56F06]/30 transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            <Flame className="w-5 h-5 text-amber-200 animate-bounce" />
            Explorar Menú Digital
          </button>
          
          <a
            href="#informacion-local"
            className="flex items-center gap-2 bg-[#1C130B] hover:bg-[#261B10] text-[#FAF5F0] border border-[#F56F06]/25 font-bold px-5 py-3.5 rounded-2xl transition-all hover:border-[#F56F06]/60 text-sm md:text-base"
          >
            <Clock className="w-4 h-4 text-[#F56F06]" />
            Horarios & Ubicación
          </a>
        </div>

      </div>
    </section>
  );
}
