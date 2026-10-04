'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_DATA } from '@/lib/data';
import PromoBanner from '@/components/PromoBanner';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';
import RestaurantInfo from '@/components/RestaurantInfo';
import Footer from '@/components/Footer';
import { ShoppingBag } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState(DEFAULT_DATA.productos);
  const [categories, setCategories] = useState(DEFAULT_DATA.categorias);
  const [content, setContent] = useState(DEFAULT_DATA.contenido);
  const [config, setConfig] = useState(DEFAULT_DATA.config);

  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);

  // 1. Cargar datos desde Supabase
  const loadDataFromSupabase = async () => {
    if (!supabase) return;

    try {
      // Categorías
      const { data: catData } = await supabase
        .from('categorias')
        .select('*')
        .order('orden', { ascending: true });

      let catMap = {};
      if (catData && catData.length > 0) {
        catData.forEach(c => { catMap[c.id] = c.nombre; });
        setCategories(catData.map(c => ({
          id: c.id,
          nombre: c.nombre,
          icon: c.icono || 'Burger',
          activa: c.activa
        })));
      }

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
          catNombre: catMap[p.categoria_id] || (p.categoria_id && !p.categoria_id.includes('-') ? p.categoria_id : ''),
          nombre: p.nombre,
          desc: p.descripcion || '',
          precio: parseFloat(p.precio) || 0,
          img: p.imagen_url || '/img/img_hamburguesa.png',
          badge: p.insignia || '',
          disponible: !!p.disponible,
          popular: !!p.popular
        })));
      }

      // CMS
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
          bannerPromoTexto: configData.banner_promo_texto || prev.bannerPromoTexto,
          beneficios: Array.isArray(configData.beneficios) ? configData.beneficios : prev.beneficios
        }));
        setConfig(prev => ({
          ...prev,
          modoHorario: configData.modo_horario || prev.modoHorario,
          envioNota: configData.nota_pedido || prev.envioNota
        }));
      }
    } catch (e) {
      console.warn('Cargando con datos locales de respaldo:', e);
    }
  };

  useEffect(() => {
    loadDataFromSupabase();

    if (!supabase) return;

    // Suscripción en tiempo real
    const channel = supabase
      .channel('home-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        loadDataFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracion_sitio' }, () => {
        loadDataFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Horario Abierto / Cerrado
  const { isOpenNow, statusText } = useMemo(() => {
    if (config.modoHorario === 'manual_abierto') {
      return { isOpenNow: true, statusText: 'Abierto ahora (Atendiendo)' };
    }
    if (config.modoHorario === 'manual_cerrado') {
      return { isOpenNow: false, statusText: 'Cerrado por ahora' };
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const day = now.getDay(); // 0 domingo, 1 lunes...

    const sched = (content.horarios || []).find(h => {
      if (day >= 1 && day <= 5) return h.dias.includes('Lunes');
      if (day === 6) return h.dias.includes('Sábado');
      return h.dias.includes('Domingo');
    });

    if (!sched) return { isOpenNow: true, statusText: 'Abierto ahora' };

    const [openH, openM] = (sched.apertura || '17:00').split(':').map(Number);
    const [closeH, closeM] = (sched.cierre || '23:00').split(':').map(Number);
    const openVal = openH * 60 + openM;
    const closeVal = closeH * 60 + closeM;

    const open = currentMinutes >= openVal && currentMinutes <= closeVal;
    return {
      isOpenNow: open,
      statusText: open ? `Abierto · ${sched.texto || `${sched.apertura} – ${sched.cierre}`}` : `Cerrado · Abre a las ${sched.apertura}`
    };
  }, [config.modoHorario, content.horarios]);

  // 3. Modificación del carrito
  const handleModifyCart = (productId, delta) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: Math.min(99, next) };
    });
  };

  const handleAddToCart = (productId, qty) => {
    setCart(prev => ({
      ...prev,
      [productId]: Math.min(99, (prev[productId] || 0) + qty)
    }));
  };

  const handleClearCart = () => setCart({});

  // 4. Lista de items del carrito desglosados
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const prod = products.find(p => String(p.id) === String(id));
        if (!prod) return null;
        return { ...prod, quantity };
      })
      .filter(Boolean);
  }, [cart, products]);

  const totalUnitsInCart = useMemo(() => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }, [cart]);

  const totalCartAmount = useMemo(() => {
    return cartItems.reduce((sum, it) => sum + (it.precio * it.quantity), 0);
  }, [cartItems]);

  // 5. Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'todos' || p.cat === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        p.nombre.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-[#0B0704] flex flex-col justify-between">
      
      {/* 1. Banner Promo */}
      <PromoBanner
        active={content.bannerPromoActivo}
        text={content.bannerPromoTexto}
      />

      {/* 2. Barra de Navegación */}
      <Navbar
        restaurantName={content.nombreRestaurante}
        logoUrl={content.apariencia?.logoImagen}
        isOpenNow={isOpenNow}
        statusText={statusText}
        cartCount={totalUnitsInCart}
        cartTotal={totalCartAmount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. Hero Principal */}
      <Hero
        restaurantName={content.nombreRestaurante}
        slogan={content.slogan}
        desc={content.descripcionCorta}
        badge={content.badgeHero}
        logoUrl={content.apariencia?.mostrarLogo !== false ? content.apariencia?.logoImagen : null}
        onExploreMenu={() => {
          document.getElementById('catalogo-menu')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Selector de Categorías y Buscador */}
      <div id="catalogo-menu">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          totalAvailableCount={products.filter(p => p.disponible).length}
        />
      </div>

      {/* 5. Catálogo Grid de Productos */}
      <section className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 flex-1 w-full relative z-10">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#1C130B] border border-[#F56F06]/15 rounded-3xl p-8 max-w-md mx-auto">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-black text-white mb-1 font-['Rubik']">No se encontraron productos</h3>
            <p className="text-xs text-[#BBA999] mb-4">Intenta con otra palabra clave o selecciona otra categoría.</p>
            <button
              onClick={() => { setActiveCategory('todos'); setSearchQuery(''); }}
              className="bg-[#F56F06] hover:bg-[#FF8324] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                quantityInCart={cart[prod.id] || 0}
                onModifyCart={handleModifyCart}
                onOpenDetail={setSelectedDetailProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Información del Restaurante, Horarios y Ubicación */}
      <RestaurantInfo
        content={content}
        isOpenNow={isOpenNow}
        statusText={statusText}
      />

      {/* 7. Footer */}
      <Footer
        restaurantName={content.nombreRestaurante}
        slogan={content.slogan}
        whatsappDisplay={content.whatsappDisplay}
        whatsappNumber={content.whatsappNumero}
      />

      {/* 8. Modal Detalle de Producto */}
      <ProductDetailModal
        product={selectedDetailProduct}
        isOpen={!!selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 9. Carrito Lateral (Slide-over Drawer) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onModifyCart={handleModifyCart}
        onClearCart={handleClearCart}
        totalAmount={totalCartAmount}
        whatsappNumber={content.whatsappNumero}
        friesNote={config.envioNota}
      />

      {/* 10. Botón Flotante de Carrito en Móvil (FAB) */}
      {totalUnitsInCart > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="md:hidden fixed bottom-5 right-5 z-40 bg-gradient-to-r from-[#D95F00] to-[#F56F06] text-white font-black px-5 py-3.5 rounded-full shadow-2xl shadow-[#F56F06]/50 flex items-center gap-3 border-2 border-white/20 animate-bounce"
          aria-label="Abrir Carrito Flotante"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-sm">{totalUnitsInCart} ítems</span>
          <span className="text-sm font-black border-l border-white/20 pl-2 text-amber-200">
            ${totalCartAmount.toFixed(2).replace('.', ',')}
          </span>
        </button>
      )}

    </main>
  );
}
