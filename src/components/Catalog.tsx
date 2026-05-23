import React, { useState } from 'react';
import { Search, PlusCircle, Edit2, Trash2, Clock, DollarSign, Sparkles, X, ChevronRight } from 'lucide-react';
import { Haircut, User } from '../types';

interface CatalogProps {
  currentUser: User;
  haircuts: Haircut[];
  onAddHaircut: (haircut: Haircut) => void;
  onUpdateHaircut: (haircut: Haircut) => void;
  onDeleteHaircut: (id: string) => void;
}

export default function Catalog({
  currentUser,
  haircuts,
  onAddHaircut,
  onUpdateHaircut,
  onDeleteHaircut
}: CatalogProps) {
  const isAdmin = currentUser.role === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Modals / Form State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingHaircut, setEditingHaircut] = useState<Haircut | null>(null);
  
  // Fields state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(40);
  const [duration, setDuration] = useState(45);
  const [category, setCategory] = useState<'classic' | 'fade' | 'beard' | 'long_hair'>('fade');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Map category code to translation label
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'fade': return 'Modern Fade / Degradê';
      case 'classic': return 'Clássico';
      case 'beard': return 'Beard Care / Barba';
      case 'long_hair': return 'Cabelos Longos';
      default: return cat;
    }
  };

  const filteredHaircuts = haircuts.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || h.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingHaircut(null);
    setTitle('');
    setPrice(40);
    setDuration(45);
    setCategory('fade');
    setDescription('');
    setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBezVMnuGpME9Qbat04obvNgPJyJ145_fQ4bgN9oq5nCVh1V6iSeVa0RIwkEYoUrX68cCRgCxhyZNx2MRrhiQKHaFSzBRTSkWeOWgxJGtgVX24Qmje1qQOyc3YHus1m3q-Tt56VVJ7mggOzwyuxIg84iaQFNxi3SqSDzaHjsvn7ghc_EhyCRd3B5eU2-mwXhWjIjQ1AXGaUAUZvDl45aY10v1KVVKtmqUsS_YIaRbaVW9YrQzIetZbRL_zD10Uxv6R28g5vSXRNAZI'); // default
    setShowFormModal(true);
  };

  const openEditModal = (haircut: Haircut) => {
    setEditingHaircut(haircut);
    setTitle(haircut.title);
    setPrice(haircut.price);
    setDuration(haircut.duration);
    setCategory(haircut.category);
    setDescription(haircut.description);
    setImage(haircut.image);
    setShowFormModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este estilo do catálogo永久amente?')) {
      onDeleteHaircut(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editingHaircut) {
      const updated: Haircut = {
        ...editingHaircut,
        title,
        price,
        duration,
        category,
        description,
        image: image || editingHaircut.image
      };
      onUpdateHaircut(updated);
    } else {
      const added: Haircut = {
        id: 'h_' + Date.now(),
        title,
        price,
        duration,
        category,
        description,
        image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBezVMnuGpME9Qbat04obvNgPJyJ145_fQ4bgN9oq5nCVh1V6iSeVa0RIwkEYoUrX68cCRgCxhyZNx2MRrhiQKHaFSzBRTSkWeOWgxJGtgVX24Qmje1qQOyc3YHus1m3q-Tt56VVJ7mggOzwyuxIg84iaQFNxi3SqSDzaHjsvn7ghc_EhyCRd3B5eU2-mwXhWjIjQ1AXGaUAUZvDl45aY10v1KVVKtmqUsS_YIaRbaVW9YrQzIetZbRL_zD10Uxv6R28g5vSXRNAZI'
      };
      onAddHaircut(added);
    }

    setShowFormModal(false);
  };

  return (
    <div className="space-y-8 py-6 animate-fade-in relative font-sans">
      {/* Catalog Title Area */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase">CATÁLOGO EXCLUSIVO</p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Estilos</h2>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Cadastrar Novo Estilo
          </button>
        )}
      </div>

      {/* Search Input and Filter tag pills */}
      <section className="space-y-4">
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Pesquisar estilos (Ex: Fade, Pompadour, Barba...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-[#1C1C24] border border-[#2D2D39] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-500 text-white font-sans text-sm"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39] hover:text-white hover:bg-[#252531]'
            }`}
          >
            Todos os Modelos
          </button>
          <button
            onClick={() => setActiveCategory('classic')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === 'classic'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39] hover:text-white hover:bg-[#252531]'
            }`}
          >
            Clássico
          </button>
          <button
            onClick={() => setActiveCategory('fade')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === 'fade'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39] hover:text-white hover:bg-[#252531]'
            }`}
          >
            Modern Fade / Degradê
          </button>
          <button
            onClick={() => setActiveCategory('beard')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === 'beard'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39] hover:text-white hover:bg-[#252531]'
            }`}
          >
            Design de Barba
          </button>
          <button
            onClick={() => setActiveCategory('long_hair')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === 'long_hair'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39] hover:text-white hover:bg-[#252531]'
            }`}
          >
            Cabelos Longos
          </button>
        </div>
      </section>

      {/* Bento Grid catalog styles list */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {filteredHaircuts.length === 0 ? (
          <div className="col-span-full text-center py-16 border border-dashed border-[#2D2D39] rounded-3xl bg-[#1C1C24]/35">
            <Sparkles className="w-10 h-10 text-blue-400/30 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-400 text-sm font-medium">Nenhum estilo ou corte correspondente no catálogo.</p>
          </div>
        ) : (
          filteredHaircuts.map((haircut, index) => {
            // Let's make the FIRST item in the list HUGE (Featured) like the screenshot layout!
            const isFirstFeatured = index === 0 && activeCategory === 'all' && !searchQuery;

            if (isFirstFeatured) {
              return (
                <div 
                  key={haircut.id}
                  className="md:col-span-2 group relative overflow-hidden rounded-3xl aspect-[16/10] md:h-[450px] border border-[#2D2D39] bg-[#1C1C24] transition-all duration-550 shadow-xl"
                >
                  <img
                    alt={haircut.title}
                    src={haircut.image}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/20 to-transparent"></div>

                  {/* Absolute control button triggers for admin */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => openEditModal(haircut)}
                        className="p-2.5 bg-[#16161D]/90 backdrop-blur-md rounded-xl text-blue-450 hover:bg-blue-600 hover:text-white shadow-lg transition-all"
                        title="Editar Estilo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(haircut.id)}
                        className="p-2.5 bg-[#16161D]/90 backdrop-blur-md rounded-xl text-red-450 hover:bg-red-650 hover:text-white shadow-lg transition-all"
                        title="Deletar Estilo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#16161D]/90 backdrop-blur-md rounded-2xl border border-[#2D2D39] flex justify-between items-end transform transition-transform group-hover:-translate-y-1 duration-300 shadow-2xl">
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] uppercase tracking-widest text-blue-400 font-extrabold mb-1 block font-sans">Destaque da Glacier</span>
                      <h3 className="text-2xl font-black text-white truncate font-sans">{haircut.title}</h3>
                      <p className="text-gray-400 text-xs mt-1 truncate max-w-md hidden sm:block font-sans">{haircut.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-blue-400 font-extrabold text-xl font-mono">R$ {haircut.price}</span>
                      <span className="text-[10px] text-blue-400/60 uppercase tracking-widest font-mono block mt-1">{haircut.duration} MIN</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={haircut.id}
                className="group relative overflow-hidden rounded-3xl aspect-square border border-[#2D2D39] bg-[#1C1C24] transition-all duration-500 shadow-md transform hover:-translate-y-1"
              >
                <img
                  alt={haircut.title}
                  src={haircut.image}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-750 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/10 to-transparent"></div>

                {/* Absolute control button triggers for admin */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={() => openEditModal(haircut)}
                      className="p-2 bg-[#16161D]/90 backdrop-blur-md rounded-xl text-blue-400 hover:bg-blue-600 hover:text-white shadow-md transition-all cursor-pointer"
                      title="Editar Estilo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(haircut.id)}
                      className="p-2 bg-[#16161D]/90 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-650 hover:text-white shadow-md transition-all cursor-pointer"
                      title="Deletar Estilo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#16161D]/90 backdrop-blur-md rounded-xl border border-[#2D2D39] shadow-lg">
                  <span className="text-[9px] uppercase tracking-wider text-purple-400 font-extrabold block mb-0.5">
                    {getCategoryLabel(haircut.category)}
                  </span>
                  <h3 className="font-extrabold text-[#F8FAFC] text-base truncate font-sans">{haircut.title}</h3>
                  <p className="text-gray-400 text-[11px] mt-1 line-clamp-1 max-w-full font-sans">{haircut.description}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#2D2D39]">
                    <span className="text-blue-400 text-sm font-black font-mono">R$ {haircut.price}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {haircut.duration} MIN
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Aesthetic bottom trademark credit from screenshot */}
      <div className="mt-16 mb-8 text-center opacity-25">
        <Sparkles className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
        <p className="text-[11px] tracking-[0.3em] uppercase mt-4 text-gray-400 font-mono">PRECISION CRAFTED BY GLACIER</p>
      </div>

      {/* Form Overlay Modal (Add / Edit style) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-lg bg-[#16161D] border border-[#2D2D39] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white">
                {editingHaircut ? 'Editar Modelo de Corte' : 'Cadastrar Novo Modelo'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Título do Estilo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Razor Skin Bob"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Categoria de Estilo</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-3 text-white text-sm"
                  >
                    <option value="fade" className="bg-[#16161D]">Modern Fade / Degradê</option>
                    <option value="classic" className="bg-[#16161D]">Clássico / Social</option>
                    <option value="beard" className="bg-[#16161D]">Design de Barba</option>
                    <option value="long_hair" className="bg-[#16161D]">Cabelos Longos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Duração (Minutos)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">URL da Imagem do Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Descrição</label>
                <textarea
                  required
                  placeholder="Escreva uma breve descrição das técnicas e resultados obtidos neste modelo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="bg-[#1C1C24] p-3 rounded-lg border border-[#2D2D39] text-[11px] text-gray-400 leading-relaxed font-sans">
                Observe que qualquer modificação se propaga de imediato ao formulário de agendamento e telas associadas do aplicativo.
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm mt-4 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {editingHaircut ? 'Salvar Alterações' : 'Confirmar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
