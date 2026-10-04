'use client';
import { MapPin, Clock, CreditCard, Navigation, ExternalLink, ShieldAlert, Award, Zap, Heart } from 'lucide-react';

export default function RestaurantInfo({ content, isOpenNow, statusText }) {
  const horarios = content?.horarios || [];
  const metodosPago = content?.metodosPago || [];
  const beneficios = content?.beneficios || [];

  return (
    <section id="informacion-local" className="py-16 px-4 sm:px-8 lg:px-12 max-w-[1540px] mx-auto space-y-12 border-t border-[#F56F06]/15 relative z-10">
      
      {/* Sección Beneficios */}
      {beneficios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beneficios.map((b, idx) => (
            <div 
              key={idx}
              className="bg-[#1C130B] border border-[#F56F06]/15 hover:border-[#F56F06]/40 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{b.icon || '⭐'}</div>
              <h4 className="font-extrabold text-base text-white font-['Rubik'] mb-1.5">{b.titulo}</h4>
              <p className="text-xs text-[#BBA999] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Grid de Información: Horarios, Ubicación y Pagos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Horarios */}
        <div className="bg-[#1C130B] border border-[#F56F06]/20 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#F56F06]/15 text-[#F56F06]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white font-['Rubik']">Horario de Atención</h3>
                <span className={`text-xs font-bold ${isOpenNow ? 'text-emerald-400' : 'text-red-400'}`}>
                  ● {statusText || (isOpenNow ? 'Abierto ahora' : 'Cerrado ahora')}
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 pt-2 border-t border-white/5">
              {horarios.map((h, i) => (
                <li key={i} className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#BBA999] font-medium">{h.dias}</span>
                  <span className="font-bold text-white bg-[#0B0704] px-2.5 py-1 rounded-lg border border-white/5">
                    {h.texto || `${h.apertura} – ${h.cierre}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Ubicación y Mapa */}
        <div className="bg-[#1C130B] border border-[#F56F06]/20 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#F56F06]/15 text-[#F56F06]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white font-['Rubik']">Ubicación</h3>
                <span className="text-xs text-[#BBA999]">Muey, Santa Elena</span>
              </div>
            </div>

            <p className="text-xs text-white font-semibold mb-2">
              {content?.direccion || 'Av. José Luis Tamayo, a 9 calles de la Av. Principal (Calles 14)'}
            </p>
            <p className="text-xs text-[#BBA999] mb-4">
              {content?.referencia || 'Muey, Península de Santa Elena, Ecuador'}
            </p>
          </div>

          <a
            href={content?.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=-2.235771%2C-80.9309066'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0B0704] hover:bg-[#F56F06] hover:text-white border border-[#F56F06]/30 text-amber-300 font-bold py-3 px-4 rounded-xl text-xs transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Cómo llegar con Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3. Métodos de Pago */}
        <div className="bg-[#1C130B] border border-[#F56F06]/20 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#F56F06]/15 text-[#F56F06]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white font-['Rubik']">Métodos de Pago</h3>
                <span className="text-xs text-[#BBA999]">Aceptamos en el local</span>
              </div>
            </div>

            <ul className="space-y-3 pt-2 border-t border-white/5">
              {metodosPago.map((m, i) => (
                <li key={i} className="flex items-center gap-3 text-xs bg-[#0B0704] p-2.5 rounded-xl border border-white/5">
                  <span className="text-xl">{m.icon || '💵'}</span>
                  <div>
                    <strong className="text-white block font-bold">{m.nombre}</strong>
                    <span className="text-[#BBA999] text-[11px]">{m.detalle}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </section>
  );
}
