import React, { useState } from 'react';
import { User, Scissors, Mail, Phone, LogOut, ShieldCheck, Sparkles, Plus, Trash2, X, Star } from 'lucide-react';
import { User as UserType, Professional } from '../types';

interface ProfileProps {
  currentUser: UserType;
  professionals: Professional[];
  clientsList: UserType[];
  onLogout: () => void;
  onUpdateProfessionals: (pros: Professional[]) => void;
}

export default function Profile({
  currentUser,
  professionals,
  clientsList,
  onLogout,
  onUpdateProfessionals
}: ProfileProps) {
  const isAdmin = currentUser.role === 'admin';
  const [showAddBarberModal, setShowAddBarberModal] = useState(false);
  
  // Barber Fields
  const [barberName, setBarberName] = useState('');
  const [barberRole, setBarberRole] = useState('Senior Stylist');
  const [barberAvatar, setBarberAvatar] = useState('');

  const handleAddBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberName) return;

    const newBarber: Professional = {
      id: 'p_' + Date.now(),
      name: barberName,
      role: barberRole,
      avatar: barberAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDraxgZdvmEUem5HFMqIRpvGQQQzsh60qucgOEh6RP7Zkwbbqd6yLFIbANGVPRCvN0YjRNOighh3qZZfdQMjLSH-Kh9RhgbOSb-9ZvPfcBBI_CMf6R57IEwGIfgc6RkjokVjs0l-_Jk4T5TaoB_jOx0_mU8gK69NJIayUwGLrwAXBq9HUtiJr9sYjPNTbnoJSk--dQgfUGAARw1qhdTzf8Mm-V8cHO6RA4qxAyz3-eJf5-93bHc9K6aqAGyeQa18QZ1XF9xoHY2wg0'
    };

    onUpdateProfessionals([...professionals, newBarber]);
    setShowAddBarberModal(false);
    setBarberName('');
    setBarberAvatar('');
  };

  const handleDeleteBarber = (id: string) => {
    if (professionals.length <= 1) {
      alert('Você deve manter pelo menos um barbeiro ativo no sistema.');
      return;
    }
    if (confirm('Tem certeza de que deseja demitir/excluir este profissional do estabelecimento?')) {
      const filtered = professionals.filter(p => p.id !== id);
      onUpdateProfessionals(filtered);
    }
  };

  return (
    <div className="space-y-10 py-6 animate-fade-in relative pb-12 font-sans">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[#16161D] backdrop-blur-xl border border-[#2D2D39] rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
          <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
            isAdmin ? 'bg-purple-900/40 text-purple-300 border border-purple-500/20' : 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
          }`}>
            {isAdmin ? 'ADMINISTRADOR MASTER' : 'CONTA CLIENTE'}
          </span>
        </div>

        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2D2D39]/80 shrink-0">
          <img 
            alt="Profile Avatar" 
            src={currentUser.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFR11Vg6lkCQyuDFDlYvqxjTfUcmHO9Go-kTATuzgFJolrLcZEDolKCpej8OgfyafeiNC3RCxarhq-_3bmTad0CrVlMMGyuuy-D6b0w2pn5BZfRbnP17yPaoacBpAurzQYT0goh2nWh-158T2S4_hoaLV9B80cgM_zi_XC-SX6NTsR8-rxtSkFpC1YZqoLcL65PI1AVyqiVkXLo_evuK6-mszt09RzMMTkIQyxkugttkVWhm1KThnjiomdN_fOzoG5NDr2MhRkTA'} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center md:text-left space-y-1">
          <h3 className="text-2xl font-black text-white">{currentUser.name}</h3>
          <p className="text-gray-400 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-blue-400" /> {currentUser.email}
          </p>
          <p className="text-gray-400 text-xs font-mono flex items-center justify-center md:justify-start gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-400" /> {currentUser.phone || '(11) 98844-3211'}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="md:ml-auto shrink-0 px-4 py-2.5 bg-red-500/15 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>

      {/* ADMIN LEVEL MANAGEMENT SECTION */}
      {isAdmin ? (
        <div className="space-y-10">
          {/* Barber Professional Manager */}
          <section className="bg-[#16161D] border border-[#2D2D39] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-blue-400" />
                Gerenciar Equipe de Barbeiros
              </h4>
              <button
                onClick={() => setShowAddBarberModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Barbeiro
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {professionals.map(pro => (
                <div 
                  key={pro.id} 
                  className="bg-[#1C1C24] p-4 border border-[#2D2D39] rounded-2xl text-center relative group"
                >
                  <button
                    onClick={() => handleDeleteBarber(pro.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/30 text-red-500 border border-red-500/10 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Excluir Colaborador"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#2D2D39] mx-auto mb-3">
                    <img 
                      alt={pro.name} 
                      src={pro.avatar} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h5 className="font-extrabold text-white text-sm">{pro.name}</h5>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">{pro.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Roster list of Registered Clients */}
          <section className="bg-[#16161D] border border-[#2D2D39] p-6 rounded-2xl">
            <h4 className="text-lg font-extrabold text-white flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-400" />
              Relação de Clientes Cadastrados ({clientsList.length})
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-black/20 rounded-xl overflow-hidden">
                <thead className="bg-[#1C1C24] text-blue-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nome Completo</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Celular</th>
                    <th className="py-3 px-4">Estilo Preferido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D39]/60 text-gray-300 font-sans">
                  {clientsList.map(client => (
                    <tr key={client.id} className="hover:bg-[#1C1C24]/50">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center font-mono font-black text-blue-400 text-[10px]">
                          {client.name.substring(0,2).toUpperCase()}
                        </div>
                        {client.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono">{client.email}</td>
                      <td className="py-3.5 px-4 font-mono">{client.phone || '(Não informado)'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-blue-600/15 text-blue-400 rounded font-bold uppercase text-[9px] tracking-wider">
                          {client.preferredStyle || 'não definido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        /* CLIENT USER PREFERENCE SECTION */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-[#16161D] border border-[#2D2D39] p-6 rounded-2xl space-y-4">
            <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-400" />
              Sua Preferência Definida
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              O estilo que você preferer ajuda nossa equipe a preparar as melhores técnicas antes mesmo de você sentar na cadeira.
            </p>
            <div className="bg-blue-600/5 border border-[#2D2D39] p-4 rounded-xl flex items-center gap-3">
              <div className="text-blue-400 shrink-0">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-purple-300 block">ESTILO DE SINAL DE IDENTIDADE</span>
                <span className="font-extrabold text-white text-base uppercase font-sans tracking-wide">
                  {currentUser.preferredStyle === 'fade' ? 'Degradê Skin Fade' : currentUser.preferredStyle === 'social' ? 'Social Clássico' : currentUser.preferredStyle === 'beard' ? 'Barboterapia Completa' : 'Estilo Personalizado Glacier'}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-[#16161D] border border-[#2D2D39] p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-extrabold text-white flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Vantagens de Cliente VIP
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Você possui acesso à reserva de horários premium prioritária, visualização de catálogo de tendências e histórico de serviços.
              </p>
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold border-t border-[#2D2D39] pt-4">
              GLACIER ELITE MEMBRO DESDE 2026
            </div>
          </section>
        </div>
      )}

      {/* Modal to Register a new professional Barber */}
      {showAddBarberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#16161D] border border-[#2D2D39] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white font-sans">Adicionar Colaborador</h3>
              <button 
                onClick={() => setShowAddBarberModal(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddBarber} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Alencar"
                  value={barberName}
                  onChange={(e) => setBarberName(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Especialidade / Cargo</label>
                <select
                  value={barberRole}
                  onChange={(e) => setBarberRole(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-3 text-white text-xs"
                >
                  <option value="Master Barber" className="bg-[#16161D]">Master Barber (Especialista em Navalha)</option>
                  <option value="Senior Stylist" className="bg-[#16161D]">Senior Stylist (Cortes de Tendência)</option>
                  <option value="Beard Expert" className="bg-[#16161D]">Beard Expert (Design de Barba)</option>
                  <option value="Creative Director" className="bg-[#16161D]">Creative Director (Visagismo)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">URL do Avatar</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={barberAvatar}
                  onChange={(e) => setBarberAvatar(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none"
                />
                <span className="text-[10px] text-gray-500 mt-1 block leading-normal">
                  Deixe em branco para usar uma imagem padrão estilizada de demonstração da Glacier Barber.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm mt-4 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                Confirmar Admissão
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
