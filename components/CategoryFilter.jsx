'use client';
import { Search, X, Flame, Utensils, Drumstick, Sandwich, Layers, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Burger: Utensils,
  Flame: Flame,
  Drumstick: Drumstick,
  Sandwich: Sandwich,
  Layers: Layers,
  Sparkles: Sparkles
};

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalAvailableCount
}) {
  return (
    <div className="sticky top-16 z-20 bg-[#0B0704]/95 backdrop-blur-md border-b border-[#F56F06]/15 py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Barra de Búsqueda */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BBA999]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, queso, tocino, broster, lomo..."
            className="w-full bg-[#1C130B] border border-[#F56F06]/20 focus:border-[#F56F06] focus:ring-1 focus:ring-[#F56F06] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#7E6F62] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#BBA999] hover:text-white rounded-full hover:bg-white/10"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chips de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-start md:justify-center">
          
          {/* Botón Todos */}
          <button
            onClick={() => onSelectCategory('todos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'todos'
                ? 'bg-gradient-to-r from-[#D95F00] to-[#F56F06] text-white shadow-lg shadow-[#F56F06]/30 scale-105'
                : 'bg-[#1C130B] text-[#BBA999] border border-[#F56F06]/15 hover:border-[#F56F06]/40 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Todos</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeCategory === 'todos' ? 'bg-white/20 text-white' : 'bg-[#0B0704] text-[#BBA999]'
            }`}>
              {totalAvailableCount}
            </span>
          </button>

          {/* Lista de categorías */}
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Utensils;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D95F00] to-[#F56F06] text-white shadow-lg shadow-[#F56F06]/30 scale-105'
                    : 'bg-[#1C130B] text-[#BBA999] border border-[#F56F06]/15 hover:border-[#F56F06]/40 hover:text-white'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 text-amber-400" />
                <span>{cat.nombre}</span>
              </button>
            );
          })}

        </div>

      </div>
    </div>
  );
}
