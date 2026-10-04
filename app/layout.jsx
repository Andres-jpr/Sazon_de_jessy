import './globals.css';

export const metadata = {
  title: 'La Sazón de Jessy | Menú Digital & Pedidos en Muey',
  description: 'Las mejores hamburguesas, salchipapas, papi pollo y sánduches de Muey con auténtico sabor casero y papas fritas de cortesía.',
  keywords: 'hamburguesas muey, la sazon de jessy, comida rapida santa elena, salchipapas, papi pollo',
  openGraph: {
    title: 'La Sazón de Jessy | Menú Digital & Pedidos',
    description: 'Pide las mejores hamburguesas y comida rápida de Muey directo a WhatsApp.',
    images: ['/img/logo_hamburguesa.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Rubik:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased bg-[#0B0704] text-[#FAF5F0] selection:bg-[#F56F06] selection:text-white">
        {children}
      </body>
    </html>
  );
}
