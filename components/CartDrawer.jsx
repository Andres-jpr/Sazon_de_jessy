'use client';
import { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, Sparkles, User, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

function isValidUUID(str) {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onModifyCart,
  onClearCart,
  totalAmount,
  whatsappNumber,
  friesNote
}) {
  const [clientName, setClientName] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOrder = async () => {
    if (!cartItems.length) return;
    setIsSubmitting(true);

    const name = clientName.trim() || 'Cliente Web';
    const notes = clientNotes.trim();

    // 1. Construir mensaje de WhatsApp
    let msg = `🍔 *PEDIDO — LA SAZÓN DE JESSY*\n`;
    msg += `─────────────────────────\n`;
    msg += `📍 *Modalidad:* 🥡 Para Retirar en Local / Llevar\n`;
    if (name && name !== 'Cliente Web') {
      msg += `👤 *Cliente:* ${name}\n`;
    }
    msg += `─────────────────────────\n`;
    msg += `📋 *DETALLE DEL PEDIDO:*\n`;

    cartItems.forEach(it => {
      msg += `• *${it.quantity}x* ${it.nombre} — $${(it.precio * it.quantity).toFixed(2).replace('.', ',')}\n`;
    });

    msg += `─────────────────────────\n`;
    msg += `💰 *TOTAL A PAGAR: $${totalAmount.toFixed(2).replace('.', ',')}*\n`;
    if (friesNote) {
      msg += `🍟 _${friesNote}_\n`;
    }
    if (notes) {
      msg += `📝 *Observaciones:* ${notes}\n`;
    }
    msg += `\n¿Me confirman para pasar a retirar en el local? ¡Muchas gracias!`;

    const waNum = whatsappNumber || '593998446974';
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;

    // 2. Registrar en Supabase
    if (supabase) {
      try {
        const { data: pedido, error } = await supabase
          .from('pedidos')
          .insert({
            cliente_nombre: name,
            tipo_pedido: 'retiro',
            notas: notes,
            subtotal: totalAmount,
            costo_envio: 0,
            total: totalAmount,
            estado: 'pendiente',
            origen: 'web'
          })
          .select()
          .single();

        if (!error && pedido) {
          const itemsToInsert = cartItems.map(it => ({
            pedido_id: pedido.id,
            producto_id: isValidUUID(it.uuid) ? it.uuid : null,
            nombre_producto: it.nombre,
            precio_unitario: it.precio,
            cantidad: it.quantity,
            subtotal: it.precio * it.quantity
          }));
          await supabase.from('pedido_items').insert(itemsToInsert);
        }
      } catch (err) {
        console.warn('No se pudo registrar orden en Supabase:', err);
      }
    }

    // 3. Efecto de Confeti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F56F06', '#F5B70A', '#25D366', '#ffffff']
      });
    } catch (e) {}

    // 4. Abrir WhatsApp y reiniciar carrito
    window.open(waUrl, '_blank');
    setIsSubmitting(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#140D07] border-l border-[#F56F06]/20 shadow-2xl flex flex-col justify-between">
          
          {/* Header del Carrito */}
          <div className="p-5 border-b border-[#F56F06]/15 flex items-center justify-between bg-[#1C130B]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#F56F06]" />
              <h2 className="font-extrabold text-lg text-white font-['Rubik']">
                Tu Pedido ({cartItems.reduce((sum, it) => sum + it.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#BBA999] hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Productos */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-[#BBA999]">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="font-bold text-white text-base mb-1">Tu carrito está vacío</h3>
                <p className="text-xs max-w-xs mx-auto">Selecciona tus platos favoritos del menú para realizar tu pedido por WhatsApp.</p>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-[#1C130B] border border-[#F56F06]/15 rounded-xl gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white truncate font-['Rubik']">
                        {item.nombre}
                      </div>
                      <div className="text-xs text-[#BBA999]">
                        ${item.precio.toFixed(2).replace('.', ',')} c/u
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#0B0704] border border-[#F56F06]/30 rounded-lg p-0.5">
                        <button
                          onClick={() => onModifyCart(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-[#1C130B] hover:bg-[#F56F06] text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onModifyCart(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-[#F56F06] hover:bg-[#FF8324] text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-black text-xs text-amber-300 w-14 text-right">
                        ${(item.precio * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Formulario Cliente */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#BBA999] flex items-center gap-1.5 mb-1.5">
                      <User className="w-3.5 h-3.5 text-[#F56F06]" />
                      Tu Nombre (Opcional)
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full bg-[#1C130B] border border-[#F56F06]/20 focus:border-[#F56F06] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#7E6F62] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#BBA999] flex items-center gap-1.5 mb-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F56F06]" />
                      Observaciones o salsas
                    </label>
                    <input
                      type="text"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Ej. Sin cebolla, salsa tártara extra..."
                      className="w-full bg-[#1C130B] border border-[#F56F06]/20 focus:border-[#F56F06] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#7E6F62] outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer del Carrito */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#F56F06]/20 bg-[#1C130B] space-y-3">
              
              <div className="flex items-center justify-between text-xs text-[#BBA999]">
                <span>Modalidad</span>
                <span className="font-bold text-white">🥡 Retiro en Local</span>
              </div>

              {friesNote && (
                <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 p-2 rounded-lg text-center font-medium">
                  🍟 {friesNote}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-extrabold text-white">Total a Pagar</span>
                <span className="text-2xl font-black text-amber-300 font-['Rubik']">
                  ${totalAmount.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <button
                  onClick={onClearCart}
                  className="col-span-1 p-3 rounded-xl border border-red-900/50 hover:bg-red-950/40 text-red-400 flex items-center justify-center transition-colors"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSendOrder}
                  disabled={isSubmitting}
                  className="col-span-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-green-900/30 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
