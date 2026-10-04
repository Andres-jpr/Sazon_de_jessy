'use client';
import { Plus, Minus, Eye, Sparkles } from 'lucide-react';

export default function ProductCard({ product, quantityInCart, onModifyCart, onOpenDetail }) {
  const isUnavailable = !product.disponible;

  return (
    <article className={`group relative bg-[#1C130B] border border-[#F56F06]/15 hover:border-[#F56F06]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F56F06]/10 ${
      isUnavailable ? 'opacity-60 grayscale-[40%]' : ''
    }`}>
      
      {/* Contenedor Imagen & Badges */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="relative aspect-video w-full overflow-hidden bg-[#140D07] cursor-pointer"
      >
        {/* Badge superior */}
        {isUnavailable ? (
          <span className="absolute top-2.5 left-2.5 z-10 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
            Agotado
          </span>
        ) : product.badge ? (
          <span className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-amber-500 to-[#F56F06] text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {product.badge}
          </span>
        ) : null}

        {/* Imagen */}
        <img
          src={product.img || '/img/img_hamburguesa.png'}
          alt={product.nombre}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = '/img/img_hamburguesa.png'; }}
        />

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
          <Eye className="w-4 h-4" />
          <span>Ver detalles</span>
        </div>
      </div>

      {/* Info del Producto */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-extrabold text-base text-white hover:text-[#F56F06] cursor-pointer transition-colors leading-snug line-clamp-1 mb-1.5 font-['Rubik']"
          >
            {product.nombre}
          </h3>
          <p className="text-xs text-[#BBA999] line-clamp-2 leading-relaxed mb-4">
            {product.desc}
          </p>
        </div>

        {/* Precio y Acción */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <div>
            <span className="text-xs text-[#7E6F62] block leading-none">Precio</span>
            <span className="text-lg font-black text-amber-300 font-['Rubik']">
              ${(product.precio || 0).toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Stepper o Botón Pedir */}
          {isUnavailable ? (
            <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-900/50 px-2.5 py-1 rounded-lg">
              No disponible
            </span>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center bg-[#0B0704] border border-[#F56F06]/40 rounded-xl p-0.5 shadow-md">
              <button
                onClick={(e) => { e.stopPropagation(); onModifyCart(product.id, -1); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1C130B] hover:bg-[#F56F06] text-white transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-black text-white">
                {quantityInCart}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onModifyCart(product.id, 1); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F56F06] hover:bg-[#FF8324] text-white transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onModifyCart(product.id, 1); }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#D95F00] to-[#F56F06] hover:from-[#F56F06] hover:to-[#FF8324] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-[#F56F06]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pedir</span>
            </button>
          )}

        </div>

      </div>

    </article>
  );
}
