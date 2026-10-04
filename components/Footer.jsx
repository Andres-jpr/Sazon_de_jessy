'use client';
import Link from 'next/link';
import { Heart, Lock } from 'lucide-react';

export default function Footer({ restaurantName, slogan, whatsappDisplay, whatsappNumber }) {
  return (
    <footer className="bg-[#0B0704] border-t border-[#F56F06]/15 py-12 px-4 sm:px-8 lg:px-12 text-center text-xs text-[#BBA999] space-y-4 relative z-10">
      <div className="max-w-[1540px] mx-auto space-y-3">
        <h4 className="font-extrabold text-base text-white font-['Rubik']">
          {restaurantName || 'La Sazón de Jessy'}
        </h4>
        <p className="text-xs text-[#BBA999] max-w-md mx-auto">
          {slogan || 'Comida rápida con auténtico sabor casero'} · Muey, Península de Santa Elena, Ecuador.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold">
          <a
            href={`https://wa.me/${whatsappNumber || '593998446974'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            WhatsApp: {whatsappDisplay || '+593 998-446-974'}
          </a>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4 text-[11px] text-[#7E6F62]">
          <span>© {new Date().getFullYear()} {restaurantName}. Todos los derechos reservados.</span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[#7E6F62] hover:text-[#F56F06] transition-colors p-1"
          >
            <Lock className="w-3 h-3" />
            <span>Acceso Administrativo</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
