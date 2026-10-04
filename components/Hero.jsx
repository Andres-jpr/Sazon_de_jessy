'use client';
import { Flame, MapPin, Sparkles, Clock, Star, ShieldCheck, Heart } from 'lucide-react';

export default function Hero({ restaurantName, slogan, desc, badge, logoUrl, onExploreMenu }) {
  return (
    <section className="relative overflow-hidden py-12 md:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 bg-gradient-to-b from-[#160E08] via-[#0E0905] to-[#0B0704] border-b border-[#F56F06]/15">
      
      {/* Luces de fondo ambientales */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-[#F56F06]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-28 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[450px] h-[450px] bg-orange-600/12 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1540px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Información & CTA (6 cols en lg) */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-6">
          
          {/* Badges superiores */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <div className="inline-flex items-center gap-2 bg-[#1C130B] border border-[#F56F06]/35 text-[#F56F06] px-3.5 py-1.5 rounded-full text-xs md:text-sm font-black shadow-lg shadow-[#F56F06]/10">
              <MapPin className="w-3.5 h-3.5 text-[#F56F06]" />
              <span>{badge || '📍 Muey, Santa Elena'}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#1C130B]/80 border border-amber-500/25 text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 · +1.200 pedidos entregados</span>
            </div>
          </div>

          {/* Titular Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white font-['Rubik'] leading-[1.08]">
            {restaurantName || 'La Sazón de Jessy'}
          </h1>

          {/* Slogan */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent font-['Rubik']">
            {slogan || 'Comida rápida con auténtico sabor casero'}
          </p>

          {/* Descripción */}
          <p className="text-sm md:text-base text-[#BBA999] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {desc || 'Hamburguesas al grill, salchipapas, papi pollo y sánduches preparados al momento con ingredientes frescos. ¡Todas las órdenes incluyen papas fritas crocantes de cortesía!'}
          </p>

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onExploreMenu}
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#D95F00] via-[#F56F06] to-[#FF8324] hover:brightness-110 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#F56F06]/35 transition-all hover:scale-105 active:scale-95 text-base md:text-lg"
            >
              <Flame className="w-5 h-5 text-amber-200 animate-bounce" />
              <span>Explorar Menú Completo</span>
            </button>
            
            <a
              href="#informacion-local"
              className="flex items-center gap-2 bg-[#1C130B] hover:bg-[#261B10] text-[#FAF5F0] border border-[#F56F06]/30 font-bold px-6 py-4 rounded-2xl transition-all hover:border-[#F56F06]/70 text-sm md:text-base"
            >
              <Clock className="w-4 h-4 text-[#F56F06]" />
              <span>Horarios & Ubicación</span>
            </a>
          </div>

          {/* Mini Highlights */}
          <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/5 max-w-lg mx-auto lg:mx-0 text-left">
            <div className="bg-[#1C130B]/60 border border-white/5 p-2.5 rounded-xl">
              <span className="text-sm block">🍟</span>
              <strong className="text-xs font-bold text-white block">Papas Gratis</strong>
              <span className="text-[10px] text-[#BBA999]">En cada hamburguesa</span>
            </div>
            <div className="bg-[#1C130B]/60 border border-white/5 p-2.5 rounded-xl">
              <span className="text-sm block">🥩</span>
              <strong className="text-xs font-bold text-white block">Carne al Grill</strong>
              <span className="text-[10px] text-[#BBA999]">Sazón casera única</span>
            </div>
            <div className="bg-[#1C130B]/60 border border-white/5 p-2.5 rounded-xl">
              <span className="text-sm block">⚡</span>
              <strong className="text-xs font-bold text-white block">Al Instante</strong>
              <span className="text-[10px] text-[#BBA999]">Retiro en Muey</span>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Logo Extra Grande & Badges Flotantes (6 cols en lg) */}
        <div className="lg:col-span-6 flex items-center justify-center relative py-6">
          
          {/* Halo de luz radial gigante detrás del logo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F56F06]/35 via-orange-500/20 to-amber-500/25 rounded-full blur-3xl scale-110 pointer-events-none" />

          {/* Contenedor del Logo Gigante */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] xl:w-[550px] xl:h-[550px] group transition-transform duration-500 hover:scale-105">
            
            <img 
              src={logoUrl || '/img/logo_oficial.png'} 
              alt={restaurantName} 
              className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(245,111,6,0.45)] animate-in zoom-in duration-500" 
            />

            {/* Badge Flotante 1: Superior */}
            <div className="absolute top-2 right-0 sm:-right-4 bg-[#1C130B]/95 backdrop-blur-md border border-[#F56F06]/50 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
              <span className="text-lg">🔥</span>
              <span>¡Sabor del Bueno!</span>
            </div>

            {/* Badge Flotante 2: Inferior */}
            <div className="absolute bottom-2 left-0 sm:-left-4 bg-[#1C130B]/95 backdrop-blur-md border border-emerald-500/50 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2">
              <span className="text-lg">🥡</span>
              <span className="text-emerald-400">Pide por WhatsApp</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
