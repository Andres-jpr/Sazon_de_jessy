export const DEFAULT_DATA = {
  config: {
    adminPin: "1234",
    modoHorario: "auto",
    moneda: "$",
    envioNota: "Todas nuestras órdenes incluyen papas fritas adicionales!"
  },
  contenido: {
    nombreRestaurante: "La Sazón de Jessy",
    slogan: "Comida rápida con auténtico sabor casero",
    descripcionCorta: "Hamburguesas, hot dogs, papi pollo, salchipapas y sánduches con ingredientes frescos y la mejor sazón de Muey.",
    badgeHero: "📍 Muey, Santa Elena",
    whatsappNumero: "593998446974",
    whatsappDisplay: "+593 998-446-974",
    direccion: "Av. José Luis Tamayo, a 9 calles de la Av. Principal (Calles 14)",
    referencia: "Muey, Península de Santa Elena",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-2.235771%2C-80.9309066",
    bannerPromoActivo: true,
    bannerPromoTexto: "¡Pide hoy! Todas las hamburguesas y sánduches incluyen papas fritas crocantes de cortesía.",
    horarios: [
      { dias: "Lunes a Viernes", apertura: "17:00", cierre: "23:00", texto: "5:00 pm – 11:00 pm" },
      { dias: "Sábados", apertura: "17:00", cierre: "23:00", texto: "5:00 pm – 11:00 pm" },
      { dias: "Domingos", apertura: "17:00", cierre: "23:00", texto: "5:00 pm – 11:00 pm" }
    ],
    metodosPago: [
      { nombre: "Efectivo", icon: "💵", detalle: "Al retirar tu pedido en el local" },
      { nombre: "Transferencia Bancaria", icon: "🏦", detalle: "Banco Pichincha / Banco Guayaquil" },
      { nombre: "DeUna! / Pichincha", icon: "📱", detalle: "Pago rápido por código QR o número" }
    ],
    beneficios: [
      { icon: "🍟", titulo: "Papas Fritas de Regalo", desc: "Todos los platos vienen acompañados de papas fritas recién preparadas." },
      { icon: "🥩", titulo: "Ingredientes Frescos", desc: "Carne de primera, salsas de la casa y panes suaves horneados al día." },
      { icon: "⚡", titulo: "Atención Rápida", desc: "Tomamos tu pedido al instante y te lo preparamos al momento." }
    ],
    apariencia: {
      colorPrimario: "#F56F06",
      colorFondo: "#0B0704",
      colorSuperficie: "#140D07",
      colorTarjeta: "#1C130B",
      colorTexto: "#FAF5F0",
      logoImagen: "/img/logo_oficial.png",
      mostrarLogo: true,
      mostrarBeneficios: true,
      mostrarInformacion: true
    }
  },
  categorias: [
    { id: "hamburguesas", nombre: "Hamburguesas", icon: "Burger", orden: 1 },
    { id: "salchipapas", nombre: "Salchipapas", icon: "Flame", orden: 2 },
    { id: "papipollo", nombre: "Papi Pollo", icon: "Drumstick", orden: 3 },
    { id: "hotdogs", nombre: "Hot Dogs", icon: "Sandwich", orden: 4 },
    { id: "sanduches", nombre: "Sánduches", icon: "Layers", orden: 5 }
  ],
  productos: [
    { id: 1, cat: "hamburguesas", nombre: "Hamburguesa Sencilla", desc: "Nuestra clásica hamburguesa con carne sazonada al grill, lechuga fresca, tomate y salsas de la casa. Incluye papas fritas.", precio: 2.00, img: "/img/img_hamburguesa.png", badge: "Clásica", disponible: true, popular: false },
    { id: 2, cat: "hamburguesas", nombre: "Hamburguesa con Huevo y Queso", desc: "Hamburguesa clásica acompañada de huevo frito tierno y queso fundido. Incluye papas fritas.", precio: 2.25, img: "/img/img_hamburguesa.png", badge: "", disponible: true, popular: true },
    { id: 3, cat: "hamburguesas", nombre: "Hamburguesa con Huevo y Jamón", desc: "Carne jugosa al grill con huevo frito y jamón seleccionado. Incluye papas fritas adicionales.", precio: 2.25, img: "/img/img_hamburguesa.png", badge: "", disponible: true, popular: false },
    { id: 4, cat: "hamburguesas", nombre: "Hamburguesa con Huevo, Queso y Jamón", desc: "La combinación favorita de la casa: carne, huevo, queso derretido y jamón. Con papas fritas crujientes.", precio: 2.75, img: "/img/img_hamburguesa.png", badge: "Favorita", disponible: true, popular: true },
    { id: 5, cat: "hamburguesas", nombre: "Hamburguesa con Huevo y Tocino", desc: "Huevo frito y tocino crujiente dorado a la perfección. Viene con papas fritas incluidas.", precio: 2.75, img: "/img/img_hamburguesa.png", badge: "", disponible: true, popular: false },
    { id: 6, cat: "hamburguesas", nombre: "Hamburguesa con Huevo, Queso y Tocino", desc: "Una explosión de sabor con carne, huevo frito, queso fundido y tocino crujiente. Con papas fritas.", precio: 3.00, img: "/img/img_hamburguesa.png", badge: "Recomendada", disponible: true, popular: true },
    { id: 7, cat: "hamburguesas", nombre: "Hamburguesa Completa", desc: "La reina indiscutible del menú: carne, huevo frito, queso fundido, tocino crujiente y jamón. Con papas fritas.", precio: 3.50, img: "/img/img_hamburguesa.png", badge: "La Especial", disponible: true, popular: true },
    { id: 8, cat: "hamburguesas", nombre: "Hamburguesa Hawaiana", desc: "Delicioso contraste dulce y salado: queso fundido, tocino crujiente y dulce jalea de piña artesanal. Con papas fritas.", precio: 2.75, img: "/img/img_hamburguesa.png", badge: "Hawaiana", disponible: true, popular: false },
    { id: 9, cat: "salchipapas", nombre: "Salchipapa Tradicional", desc: "Papas fritas bien doradas con abundantes trozos de salchicha parrillera y salsas al gusto.", precio: 1.75, img: "/img/img_salchipapa.png", badge: "Económica", disponible: true, popular: false },
    { id: 10, cat: "papipollo", nombre: "Papi Pollo Broster", desc: "Presa de pollo broster crocante por fuera y jugoso por dentro, servido sobre una generosa porción de papas fritas.", precio: 3.75, img: "/img/img_papipollo.png", badge: "Top Ventas", disponible: true, popular: true },
    { id: 11, cat: "hotdogs", nombre: "Hot Dog Clásico", desc: "Pan suave y fresco, salchicha premium, papas al hilo, salsas especiales de la casa. Incluye papas fritas.", precio: 1.60, img: "/img/img_hotdog.png", badge: "", disponible: true, popular: false },
    { id: 12, cat: "sanduches", nombre: "Sánduche de Lomo de Res", desc: "Tierno lomo de res marinado al grill en pan baguette suave con vegetales frescos. Incluye papas fritas.", precio: 2.50, img: "/img/img_sanduche.png", badge: "", disponible: true, popular: false },
    { id: 13, cat: "sanduches", nombre: "Sánduche de Pollo", desc: "Filete de pechuga de pollo a la plancha con especias caseras y vegetales. Con papas fritas adicionales.", precio: 2.50, img: "/img/img_sanduche.png", badge: "", disponible: true, popular: false },
    { id: 14, cat: "sanduches", nombre: "Sánduche de Lomo Tejano", desc: "Lomo de res premium, tocino crujiente, queso derretido y auténtica salsa BBQ ahumada. Con papas fritas.", precio: 3.50, img: "/img/img_sanduche.png", badge: "Tejano", disponible: true, popular: true },
    { id: 15, cat: "sanduches", nombre: "Sánduche de Pollo Tejano", desc: "Pechuga de pollo a la plancha, tocino crujiente, queso derretido y baño de salsa BBQ ahumada. Con papas fritas.", precio: 3.50, img: "/img/img_sanduche.png", badge: "Tejano", disponible: true, popular: true }
  ]
};
