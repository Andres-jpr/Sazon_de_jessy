'use client';
import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { getImgPath } from '@/lib/data';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-[#1C130B] border border-[#F56F06]/30 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white/80 hover:text-white backdrop-blur-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagen Cabecera */}
        <div className="relative aspect-video w-full bg-[#140D07]">
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-[#F56F06] text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {product.badge}
            </span>
          )}
          <img
            src={getImgPath(product.img || '/img/img_hamburguesa.png')}
            alt={product.nombre}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = getImgPath('/img/img_hamburguesa.png'); }}
          />
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase text-[#F56F06] tracking-widest block mb-1">
                {product.cat}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white font-['Rubik'] leading-tight">
                {product.nombre}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#7E6F62] block">Precio</span>
              <span className="text-2xl font-black text-amber-300 font-['Rubik']">
                ${product.precio.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#BBA999] leading-relaxed">
            {product.desc}
          </p>

          <div className="bg-[#140D07] border border-[#F56F06]/15 p-3 rounded-xl text-xs text-amber-300/90 flex items-center gap-2">
            <span>🍟</span>
            <span>Incluye papas fritas crocantes adicionales de cortesía.</span>
          </div>

          {/* Stepper y Añadir */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center bg-[#0B0704] border border-[#F56F06]/30 rounded-2xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1C130B] hover:bg-[#F56F06] text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-black text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F56F06] hover:bg-[#FF8324] text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!product.disponible}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-sm transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#D95F00] to-[#F56F06] hover:from-[#F56F06] hover:to-[#FF8324] text-white shadow-lg shadow-[#F56F06]/25 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Añadido!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir ${(product.precio * quantity).toFixed(2).replace('.', ',')}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
