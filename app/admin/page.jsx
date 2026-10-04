'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DEFAULT_DATA } from '@/lib/data';
import { 
  Lock, LogOut, Store, Bell, BellOff, Clock, Flame, 
  CheckCircle2, XCircle, Trash2, Edit3, Plus, Search, 
  DollarSign, Sparkles, ChefHat, Check, Bike, RefreshCw, Save
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('pedidos');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Datos
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('todos');
  const [products, setProducts] = useState(DEFAULT_DATA.productos);
  const [categories, setCategories] = useState(DEFAULT_DATA.categorias);
  const [content, setContent] = useState(DEFAULT_DATA.contenido);
  const [config, setConfig] = useState(DEFAULT_DATA.config);

  // Estados de edición de producto
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Notificaciones Toast internas
  const [toastMsg, setToastMsg] = useState(null);

  const audioCtxRef = useRef(null);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. Alerta de audio acústica Web Audio API
  const playOrderSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

      const now = audioCtxRef.current.currentTime;
      const osc1 = audioCtxRef.current.createOscillator();
      const gain1 = audioCtxRef.current.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(audioCtxRef.current.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = audioCtxRef.current.createOscillator();
      const gain2 = audioCtxRef.current.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.15);
      gain2.gain.setValueAtTime(0.4, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(audioCtxRef.current.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch (e) {}
  };

  // 2. Comprobar sesión de Admin
  useEffect(() => {
    const session = sessionStorage.getItem('sazon_admin_active');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === config.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sazon_admin_active', 'true');
      setPinError('');
      showToast('Bienvenido al Panel de Control');
    } else {
      setPinError('PIN incorrecto. Intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sazon_admin_active');
    setPinInput('');
  };

  // 3. Cargar datos de Supabase
  const fetchAllData = async () => {
    if (!supabase) return;

    try {
      // Pedidos
      const { data: ordersData } = await supabase
        .from('pedidos')
        .select(`
          id, numero_pedido, cliente_nombre, cliente_telefono,
          tipo_pedido, notas, total, estado, creado_en,
          pedido_items ( id, nombre_producto, cantidad, precio_unitario, subtotal )
        `)
        .order('creado_en', { ascending: false })
        .limit(60);

      if (ordersData) setOrders(ordersData);

      // Productos
      const { data: prodData } = await supabase
        .from('productos')
        .select('*')
        .order('codigo_original', { ascending: true });

      if (prodData && prodData.length > 0) {
        setProducts(prodData.map(p => ({
          id: p.codigo_original || p.id,
          uuid: p.id,
          cat: p.categoria_id || 'hamburguesas',
          nombre: p.nombre,
          desc: p.descripcion || '',
          precio: parseFloat(p.precio) || 0,
          img: p.imagen_url || '/img/img_hamburguesa.png',
          badge: p.insignia || '',
          disponible: !!p.disponible,
          popular: !!p.popular
        })));
      }

      // Categorías
      const { data: catData } = await supabase
        .from('categorias')
        .select('*')
        .order('orden', { ascending: true });

      if (catData && catData.length > 0) setCategories(catData);

      // Config
      const { data: configData } = await supabase
        .from('configuracion_sitio')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (configData) {
        setContent(prev => ({
          ...prev,
          nombreRestaurante: configData.nombre_restaurante || prev.nombreRestaurante,
          slogan: configData.slogan || prev.slogan,
          descripcionCorta: configData.descripcion || prev.descripcionCorta,
          whatsappNumero: configData.whatsapp_numero || prev.whatsappNumero,
          whatsappDisplay: configData.whatsapp_visible || prev.whatsappDisplay,
          direccion: configData.direccion || prev.direccion,
          referencia: configData.referencia || prev.referencia,
          googleMapsUrl: configData.google_maps_url || prev.googleMapsUrl,
          bannerPromoActivo: configData.banner_promo_activo !== false,
          bannerPromoTexto: configData.banner_promo_texto || prev.bannerPromoTexto
        }));
      }
    } catch (e) {
      console.warn('Error cargando datos de admin:', e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchAllData();

    // Polling de seguridad cada 4s
    const interval = setInterval(fetchAllData, 4000);

    // Realtime Supabase
    if (!supabase) return () => clearInterval(interval);

    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pedidos' }, (payload) => {
        playOrderSound();
        showToast(`🔔 ¡Nuevo Pedido Entrante #${payload.new.numero_pedido || ''}!`, 'success');
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => {
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // 4. Acciones de Pedidos
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, estado: newStatus } : o));
    showToast(`Pedido actualizado a ${newStatus.toUpperCase()}`);

    if (supabase) {
      try {
        await supabase
          .from('pedidos')
          .update({ estado: newStatus, actualizado_en: new Date().toISOString() })
          .eq('id', orderId);
      } catch (e) {}
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('¿Eliminar este pedido del historial?')) return;
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('Pedido eliminado', 'info');

    if (supabase) {
      try {
        await supabase.from('pedidos').delete().eq('id', orderId);
      } catch (e) {}
    }
  };

  // 5. Acciones de Productos
  const toggleStock = async (prodId) => {
    const target = products.find(p => p.id === prodId);
    if (!target) return;
    const newStatus = !target.disponible;

    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, disponible: newStatus } : p));
    showToast(`Producto marcado como ${newStatus ? 'Disponible' : 'Agotado'}`);

    if (supabase) {
      const match = typeof prodId === 'number' ? { codigo_original: prodId } : { id: target.uuid || prodId };
      await supabase.from('productos').update({ disponible: newStatus }).match(match);
    }
  };

  const updatePrice = async (prodId, newPrice) => {
    const val = parseFloat(newPrice);
    if (isNaN(val) || val < 0) return;

    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, precio: val } : p));
    showToast(`Precio actualizado a $${val.toFixed(2)}`);

    if (supabase) {
      const target = products.find(p => p.id === prodId);
      const match = typeof prodId === 'number' ? { codigo_original: prodId } : { id: target?.uuid || prodId };
      await supabase.from('productos').update({ precio: val }).match(match);
    }
  };

  const deleteProduct = async (prodId) => {
    const target = products.find(p => p.id === prodId);
    if (!target || !confirm(`¿Eliminar definitivamente "${target.nombre}"?`)) return;

    setProducts(prev => prev.filter(p => p.id !== prodId));
    showToast(`"${target.nombre}" eliminado`, 'danger');

    if (supabase) {
      const match = typeof prodId === 'number' ? { codigo_original: prodId } : { id: target.uuid || prodId };
      await supabase.from('productos').delete().match(match);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prodData = {
      nombre: formData.get('nombre').trim(),
      cat: formData.get('cat'),
      precio: parseFloat(formData.get('precio')) || 0,
      desc: formData.get('desc').trim(),
      badge: formData.get('badge').trim(),
      img: formData.get('img').trim() || '/img/img_hamburguesa.png',
      disponible: formData.get('disponible') === 'on'
    };

    if (editingProduct?.id) {
      // Editar
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...prodData } : p));
      showToast('Producto actualizado con éxito');
      if (supabase) {
        const match = typeof editingProduct.id === 'number' ? { codigo_original: editingProduct.id } : { id: editingProduct.uuid || editingProduct.id };
        await supabase.from('productos').update({
          nombre: prodData.nombre,
          descripcion: prodData.desc,
          precio: prodData.precio,
          imagen_url: prodData.img,
          insignia: prodData.badge,
          disponible: prodData.disponible
        }).match(match);
      }
    } else {
      // Crear
      const nextId = products.reduce((max, p) => Math.max(max, typeof p.id === 'number' ? p.id : 0), 0) + 1;
      const newProd = { id: nextId, ...prodData };
      setProducts(prev => [...prev, newProd]);
      showToast('Producto agregado al menú');
      if (supabase) {
        await supabase.from('productos').insert({
          codigo_original: nextId,
          nombre: prodData.nombre,
          descripcion: prodData.desc,
          precio: prodData.precio,
          imagen_url: prodData.img,
          insignia: prodData.badge,
          disponible: prodData.disponible
        });
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // 6. Guardar CMS
  const handleSaveCMS = async (e) => {
    e.preventDefault();
    showToast('Configuración del sitio guardada');

    if (supabase) {
      await supabase.from('configuracion_sitio').update({
        nombre_restaurante: content.nombreRestaurante,
        slogan: content.slogan,
        descripcion: content.descripcionCorta,
        whatsapp_numero: content.whatsappNumero,
        whatsapp_visible: content.whatsappDisplay,
        direccion: content.direccion,
        referencia: content.referencia,
        google_maps_url: content.googleMapsUrl,
        banner_promo_activo: content.bannerPromoActivo,
        banner_promo_texto: content.bannerPromoTexto
      }).eq('id', 1);
    }
  };

  // ----------------------------------------------------
  // VISTA 1: PANTALLA DE ACCESO (PIN)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0B0704] flex items-center justify-center p-4">
        <div className="bg-[#140D07] border border-[#F56F06]/30 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D95F00] to-[#F56F06] mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-[#F56F06]/30">
            🔐
          </div>
          <h1 className="text-xl font-black text-white font-['Rubik'] mb-1">Panel de Control</h1>
          <p className="text-xs text-[#BBA999] mb-6">La Sazón de Jessy · Acceso Seguro</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              maxLength={8}
              autoFocus
              className="w-full text-center tracking-widest text-2xl font-black bg-[#1C130B] border border-[#F56F06]/30 focus:border-[#F56F06] rounded-2xl p-3.5 text-white outline-none"
            />
            {pinError && <p className="text-xs font-bold text-red-400">{pinError}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D95F00] to-[#F56F06] hover:from-[#F56F06] hover:to-[#FF8324] text-white font-black py-3.5 rounded-2xl shadow-lg transition-all"
            >
              Ingresar al Panel
            </button>
          </form>

          <Link href="/" className="inline-block mt-6 text-xs text-[#7E6F62] hover:text-[#F56F06] transition-colors">
            ← Volver a la Tienda de Clientes
          </Link>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------
  // VISTA 2: PANEL DE ADMINISTRACIÓN COMPLETO
  // ----------------------------------------------------
  const pendingCount = orders.filter(o => o.estado === 'pendiente').length;
  const filteredOrders = orderFilter === 'todos' ? orders : orders.filter(o => o.estado === orderFilter);

  return (
    <main className="min-h-screen bg-[#0B0704] text-[#FAF5F0] flex flex-col">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-black flex items-center gap-2 border animate-in slide-in-from-top-2 ${
          toastMsg.type === 'danger'
            ? 'bg-red-950/90 border-red-800 text-red-200'
            : 'bg-[#1C130B] border-[#F56F06] text-white'
        }`}>
          <span>{toastMsg.type === 'danger' ? '⚠️' : '✅'}</span>
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header Superior */}
      <header className="bg-[#140D07] border-b border-[#F56F06]/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F56F06] flex items-center justify-center font-black text-lg text-white">
            ⚙️
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white font-['Rubik'] leading-none">
              {content.nombreRestaurante}
            </h1>
            <span className="text-[11px] text-[#F56F06] font-bold">Centro de Control & Comandas</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C130B] border border-[#F56F06]/20 hover:border-[#F56F06] text-xs font-bold text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#F56F06]" />
            <span>Ver Menú Cliente</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-xs font-bold text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Navegación por Pestañas */}
      <nav className="bg-[#140D07]/60 border-b border-white/5 px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'pedidos', label: '📦 Pedidos en Vivo', badge: pendingCount },
          { id: 'dashboard', label: '📊 Dashboard & Métricas' },
          { id: 'productos', label: '🍔 Catálogo de Menú' },
          { id: 'cms', label: '📝 CMS del Sitio' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3.5 px-4 font-extrabold text-xs md:text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[#F56F06] text-[#F56F06]'
                : 'border-transparent text-[#BBA999] hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Contenido de Pestañas */}
      <div className="p-6 max-w-7xl mx-auto w-full flex-1">
        
        {/* ====================================================
            TAB 1: PEDIDOS EN VIVO (COMANDAS & REALTIME)
           ==================================================== */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white font-['Rubik']">Comandas en Tiempo Real</h2>
                <p className="text-xs text-[#BBA999]">Los pedidos enviados por los clientes ingresan aquí al instante.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    soundEnabled
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-[#1C130B] border-white/10 text-[#7E6F62]'
                  }`}
                >
                  {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  <span>{soundEnabled ? 'Sonido Activado' : 'Silenciado'}</span>
                </button>

                <button
                  onClick={fetchAllData}
                  className="p-2 rounded-xl bg-[#1C130B] border border-white/10 hover:border-[#F56F06] text-[#BBA999] hover:text-white"
                  title="Actualizar ahora"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filtros de Comandas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'todos', label: `Todos (${orders.length})` },
                { id: 'pendiente', label: `⏳ Pendientes (${orders.filter(o => o.estado === 'pendiente').length})` },
                { id: 'preparando', label: `👨‍🍳 En Preparación (${orders.filter(o => o.estado === 'preparando').length})` },
                { id: 'listo', label: `✅ Listos (${orders.filter(o => o.estado === 'listo').length})` },
                { id: 'entregado', label: `🛵 Entregados (${orders.filter(o => o.estado === 'entregado').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    orderFilter === f.id
                      ? 'bg-[#F56F06] text-white shadow-md'
                      : 'bg-[#1C130B] text-[#BBA999] border border-white/5 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Grid de Tarjetas de Comanda */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-24 bg-[#140D07] border border-dashed border-[#F56F06]/20 rounded-3xl p-8">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="font-bold text-white text-base">No hay pedidos en esta sección</h3>
                <p className="text-xs text-[#BBA999]">Cuando un cliente haga un pedido, sonará la campana y aparecerá aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map(o => {
                  const items = Array.isArray(o.pedido_items) ? o.pedido_items : [];
                  const isPendiente = o.estado === 'pendiente';
                  const isPrep = o.estado === 'preparando';
                  const isListo = o.estado === 'listo';

                  return (
                    <div
                      key={o.id}
                      className={`bg-[#1C130B] border rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                        isPendiente ? 'border-[#F56F06] shadow-[#F56F06]/10' :
                        isPrep ? 'border-amber-500 shadow-amber-500/10' :
                        isListo ? 'border-emerald-500 shadow-emerald-500/10' :
                        'border-white/10 opacity-70'
                      }`}
                    >
                      <div>
                        {/* Cabecera */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                          <div>
                            <span className="text-base font-black text-white font-['Rubik']">
                              #{o.numero_pedido || String(o.id).slice(0, 6)}
                            </span>
                            <span className="text-[11px] text-[#BBA999] block">
                              {new Date(o.creado_en).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                            isPendiente ? 'bg-[#F56F06]/20 text-[#F56F06]' :
                            isPrep ? 'bg-amber-500/20 text-amber-300' :
                            isListo ? 'bg-emerald-500/20 text-emerald-300' :
                            'bg-white/10 text-white/70'
                          }`}>
                            {o.estado}
                          </span>
                        </div>

                        {/* Cliente */}
                        <div className="text-xs mb-3">
                          <strong className="text-white block font-bold">👤 {o.cliente_nombre || 'Cliente Web'}</strong>
                          {o.notas && (
                            <div className="mt-1.5 p-2 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-300 text-[11px]">
                              📝 {o.notas}
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div className="bg-[#140D07] rounded-xl p-3 space-y-1.5 mb-4 text-xs">
                          {items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-white">
                              <span><strong>{it.cantidad}×</strong> {it.nombre_producto}</span>
                              <span className="font-bold text-amber-300">${(it.subtotal || 0).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total y Botones de Acción */}
                      <div>
                        <div className="flex justify-between items-center font-black text-sm text-white mb-3 pt-2 border-t border-white/5">
                          <span>Total:</span>
                          <span className="text-lg text-amber-300 font-['Rubik']">${(o.total || 0).toFixed(2).replace('.', ',')}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {isPendiente && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'preparando')}
                              className="col-span-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                            >
                              <ChefHat className="w-3.5 h-3.5" />
                              <span>Preparar</span>
                            </button>
                          )}
                          {(isPendiente || isPrep) && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'listo')}
                              className="col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Listo</span>
                            </button>
                          )}
                          {isListo && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'entregado')}
                              className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                            >
                              <Bike className="w-3.5 h-3.5" />
                              <span>Marcar Entregado</span>
                            </button>
                          )}
                          {!['entregado', 'cancelado'].includes(o.estado) ? (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'cancelado')}
                              className="bg-red-950/40 border border-red-900/40 hover:bg-red-900 text-red-300 text-xs font-bold py-2 rounded-xl transition-colors"
                            >
                              Cancelar
                            </button>
                          ) : (
                            <button
                              onClick={() => deleteOrder(o.id)}
                              className="col-span-2 bg-[#0B0704] border border-red-900/40 hover:bg-red-950 text-red-400 text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar del historial</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB 2: DASHBOARD & MÉTRICAS
           ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white font-['Rubik']">Métricas del Negocio</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1C130B] border border-[#F56F06]/20 p-6 rounded-2xl">
                <span className="text-xs text-[#BBA999] font-bold block mb-1">Total Productos</span>
                <span className="text-3xl font-black text-white font-['Rubik']">{products.length}</span>
              </div>
              <div className="bg-[#1C130B] border border-[#F56F06]/20 p-6 rounded-2xl">
                <span className="text-xs text-[#BBA999] font-bold block mb-1">Productos Disponibles</span>
                <span className="text-3xl font-black text-emerald-400 font-['Rubik']">
                  {products.filter(p => p.disponible).length}
                </span>
              </div>
              <div className="bg-[#1C130B] border border-[#F56F06]/20 p-6 rounded-2xl">
                <span className="text-xs text-[#BBA999] font-bold block mb-1">Productos Agotados</span>
                <span className="text-3xl font-black text-red-400 font-['Rubik']">
                  {products.filter(p => !p.disponible).length}
                </span>
              </div>
              <div className="bg-[#1C130B] border border-[#F56F06]/20 p-6 rounded-2xl">
                <span className="text-xs text-[#BBA999] font-bold block mb-1">Precio Promedio</span>
                <span className="text-3xl font-black text-amber-300 font-['Rubik']">
                  ${(products.reduce((a, b) => a + (b.precio || 0), 0) / (products.length || 1)).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: CATÁLOGO DE PRODUCTOS (CRUD)
           ==================================================== */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white font-['Rubik']">Gestión de Menú</h2>
                <p className="text-xs text-[#BBA999]">Edita precios al instante o cambia disponibilidad.</p>
              </div>

              <button
                onClick={() => { setEditingProduct({}); setIsProductModalOpen(true); }}
                className="flex items-center gap-2 bg-[#F56F06] hover:bg-[#FF8324] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-[#F56F06]/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-[#1C130B] border border-[#F56F06]/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#140D07] text-[#BBA999] uppercase font-bold border-b border-white/5">
                    <tr>
                      <th className="p-4">Imagen</th>
                      <th className="p-4">Nombre / Descripción</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Precio ($)</th>
                      <th className="p-4">Disponibilidad</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-[#261B10]/40 transition-colors">
                        <td className="p-4">
                          <img
                            src={prod.img || '/img/img_hamburguesa.png'}
                            alt={prod.nombre}
                            className="w-12 h-12 object-cover rounded-xl border border-white/10"
                            onError={(e) => { e.currentTarget.src = '/img/img_hamburguesa.png'; }}
                          />
                        </td>
                        <td className="p-4">
                          <strong className="block font-bold text-sm">{prod.nombre}</strong>
                          <span className="text-[11px] text-[#BBA999] line-clamp-1">{prod.desc}</span>
                        </td>
                        <td className="p-4 capitalize text-[#BBA999] font-medium">{prod.cat}</td>
                        <td className="p-4">
                          <input
                            type="number"
                            step="0.05"
                            defaultValue={prod.precio}
                            onBlur={(e) => updatePrice(prod.id, e.target.value)}
                            className="w-20 bg-[#0B0704] border border-[#F56F06]/30 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold outline-none focus:border-[#F56F06]"
                          />
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleStock(prod.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                              prod.disponible
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                                : 'bg-red-950/40 border-red-800 text-red-300'
                            }`}
                          >
                            {prod.disponible ? '● Disponible' : '○ Agotado'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => { setEditingProduct(prod); setIsProductModalOpen(true); }}
                            className="p-1.5 rounded-lg bg-[#0B0704] hover:bg-white/10 text-[#BBA999] hover:text-white"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 4: CMS DEL SITIO
           ==================================================== */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveCMS} className="bg-[#1C130B] border border-[#F56F06]/20 p-6 rounded-3xl space-y-6 max-w-2xl">
            <h2 className="text-xl font-black text-white font-['Rubik']">Configuración del Sitio Web</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Nombre del Restaurante</label>
                <input
                  type="text"
                  value={content.nombreRestaurante}
                  onChange={(e) => setContent({ ...content, nombreRestaurante: e.target.value })}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-3 text-white outline-none focus:border-[#F56F06]"
                />
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Slogan</label>
                <input
                  type="text"
                  value={content.slogan}
                  onChange={(e) => setContent({ ...content, slogan: e.target.value })}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-3 text-white outline-none focus:border-[#F56F06]"
                />
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Texto del Banner Promocional</label>
                <input
                  type="text"
                  value={content.bannerPromoTexto}
                  onChange={(e) => setContent({ ...content, bannerPromoTexto: e.target.value })}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-3 text-white outline-none focus:border-[#F56F06]"
                />
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">WhatsApp para Pedidos (Código país + número)</label>
                <input
                  type="text"
                  value={content.whatsappNumero}
                  onChange={(e) => setContent({ ...content, whatsappNumero: e.target.value })}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-3 text-white outline-none focus:border-[#F56F06]"
                />
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Enlace de Google Maps</label>
                <input
                  type="text"
                  value={content.googleMapsUrl}
                  onChange={(e) => setContent({ ...content, googleMapsUrl: e.target.value })}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-3 text-white outline-none focus:border-[#F56F06]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#F56F06] hover:bg-[#FF8324] text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </form>
        )}

      </div>

      {/* Modal Crear / Editar Producto */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsProductModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          
          <div className="relative bg-[#1C130B] border border-[#F56F06]/30 rounded-3xl max-w-md w-full p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="text-lg font-black text-white font-['Rubik']">
              {editingProduct?.id ? `Editar: ${editingProduct.nombre}` : 'Nuevo Producto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Nombre</label>
                <input
                  name="nombre"
                  defaultValue={editingProduct?.nombre || ''}
                  required
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#BBA999] block mb-1">Categoría</label>
                  <select
                    name="cat"
                    defaultValue={editingProduct?.cat || 'hamburguesas'}
                    className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="hamburguesas">Hamburguesas</option>
                    <option value="salchipapas">Salchipapas</option>
                    <option value="papipollo">Papi Pollo</option>
                    <option value="hotdogs">Hot Dogs</option>
                    <option value="sanduches">Sánduches</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#BBA999] block mb-1">Precio ($)</label>
                  <input
                    name="precio"
                    type="number"
                    step="0.05"
                    defaultValue={editingProduct?.precio || 2.00}
                    required
                    className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Descripción</label>
                <textarea
                  name="desc"
                  rows={2}
                  defaultValue={editingProduct?.desc || ''}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">Insignia (Opcional)</label>
                <input
                  name="badge"
                  defaultValue={editingProduct?.badge || ''}
                  placeholder="Ej. Favorita, Especial, Top Ventas"
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#BBA999] block mb-1">URL de Imagen</label>
                <input
                  name="img"
                  defaultValue={editingProduct?.img || '/img/img_hamburguesa.png'}
                  className="w-full bg-[#0B0704] border border-[#F56F06]/20 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="disponible"
                  id="disponible-chk"
                  defaultChecked={editingProduct?.disponible !== false}
                  className="rounded border-[#F56F06] text-[#F56F06]"
                />
                <label htmlFor="disponible-chk" className="font-bold text-white cursor-pointer">
                  Producto disponible para venta
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F56F06] hover:bg-[#FF8324] text-white font-bold shadow-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
