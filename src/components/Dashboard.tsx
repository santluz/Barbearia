import React, { useState } from 'react';
import { DollarSign, Calendar, Clock, Scissors, ChevronRight, Check, X, Trash2, ArrowRight, Sparkles, Plus, Search } from 'lucide-react';
import { Booking, User, Haircut, Professional } from '../types';

interface DashboardProps {
  currentUser: User;
  bookings: Booking[];
  haircuts: Haircut[];
  professionals: Professional[];
  onUpdateBookings: (newBookings: Booking[]) => void;
  onNavigateToBook: () => void;
}

export default function Dashboard({
  currentUser,
  bookings,
  haircuts,
  professionals,
  onUpdateBookings,
  onNavigateToBook
}: DashboardProps) {
  const isAdmin = currentUser.role === 'admin';
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Admin custom addition
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(haircuts[0]?.id || '');
  const [selectedProId, setSelectedProId] = useState(professionals[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-10-12');
  const [bookingTime, setBookingTime] = useState('11:00');

  // Filter bookings: admin sees all, client sees theirs
  const visibleBookings = bookings.filter(b => {
    // Role checks
    if (!isAdmin) {
      return b.clientEmail === currentUser.email;
    }
    return true;
  }).filter(b => {
    // Status filters
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    // Search queries
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        b.clientName.toLowerCase().includes(query) ||
        b.serviceName.toLowerCase().includes(query) ||
        b.professionalName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Calculate metrics
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0);

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const totalCount = bookings.length;

  // Find next client (closest booking in future / nearest time)
  const sortedBookings = [...bookings]
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => {
      // Basic time comparison assuming same day or combining with date
      return a.timeSlot.localeCompare(b.timeSlot);
    });
  const nextBooking = sortedBookings[0] || null;

  // Status handlers
  const updateStatus = (bookingId: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    onUpdateBookings(updated);
  };

  const deleteBooking = (bookingId: string) => {
    if (confirm('Tem certeza de que deseja excluir este agendamento永久amente?')) {
      const filtered = bookings.filter(b => b.id !== bookingId);
      onUpdateBookings(filtered);
    }
  };

  const handleAdminAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const service = haircuts.find(h => h.id === selectedServiceId) || haircuts[0];
    const professional = professionals.find(p => p.id === selectedProId) || professionals[0];

    const newBooking: Booking = {
      id: 'b_' + Date.now(),
      clientName,
      clientEmail: `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      clientPhone,
      serviceId: service.id,
      serviceName: service.title,
      professionalId: professional.id,
      professionalName: professional.name,
      date: bookingDate,
      timeSlot: bookingTime,
      status: 'confirmed',
      price: service.price,
      duration: service.duration
    };

    onUpdateBookings([...bookings, newBooking]);
    setShowAddModal(false);
    // Reset fields
    setClientName('');
    setClientPhone('');
  };

  return (
    <div className="space-y-10 py-6 animate-fade-in relative font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase">
            {isAdmin ? 'MÓDULO DE CONTROLE ADMINISTRATIVO' : `BOM DIA, ${currentUser.name.toUpperCase()}`}
          </p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Hoje
          </h2>
        </div>
        <div className="self-start md:self-auto bg-[#16161D] border border-[#2D2D39] backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold text-blue-400">
          12 DE OUTUBRO DE 2026
        </div>
      </div>

      {/* Admin Panel Badge */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-500/10 to-transparent border-l-4 border-l-blue-500 p-4 rounded-r-2xl rounded-l-md flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              Você é Administrador
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Acesso total habilitado: adicione, edite ou exclua qualquer agendamento, profissional ou estilo de corte.
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Incluir Presencial
          </button>
        </div>
      )}

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Revenue */}
        <div className="bg-[#16161D] backdrop-blur-xl border border-[#2D2D39] p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-600/15 p-2 rounded-xl text-blue-400">
              <DollarSign className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            {isAdmin ? 'Faturamento Total Est.' : 'Valor Estimado'}
          </p>
          <p className="text-3xl font-extrabold text-white">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Metric 2: Appointments */}
        <div className="bg-[#16161D] backdrop-blur-xl border border-[#2D2D39] p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-purple-500/10 p-2 rounded-xl text-purple-400">
              <Calendar className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              {confirmedCount} / {totalCount}
            </span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            {isAdmin ? 'Capacidade de Hoje' : 'Seus Agendamentos'}
          </p>
          <p className="text-3xl font-extrabold text-white">
            {visibleBookings.length} {visibleBookings.length === 1 ? 'Cliente' : 'Clientes'}
          </p>
        </div>

        {/* Metric 3: Next Client */}
        <div className="bg-[#16161D] backdrop-blur-xl border border-[#2D2D39] p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-600/15 p-2 rounded-xl text-blue-400">
              <Clock className="w-6 h-6" />
            </span>
            {nextBooking && (
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full animate-pulse uppercase">
                EM 15 MIN
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            {isAdmin ? 'Próximo Cliente' : 'Seu Próximo Serviço'}
          </p>
          <p className="text-3xl font-extrabold text-white truncate">
            {nextBooking ? nextBooking.clientName : 'Sem agendamentos'}
          </p>
        </div>
      </div>

      {/* Appointment Listings Section */}
      <div className="bg-[#16161D] border border-[#2D2D39] p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            {isAdmin ? 'Agendamentos Gerais' : 'Seu Histórico'}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#1C1C24] border border-[#2D2D39] text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'confirmed'
                  ? 'bg-green-600 text-white'
                  : 'bg-[#1C1C24] border border-[#2D2D39] text-gray-400 hover:text-white'
              }`}
            >
              Confirmados
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-[#1C1C24] border border-[#2D2D39] text-gray-400 hover:text-white'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#1C1C24] border border-[#2D2D39] text-gray-400 hover:text-white'
              }`}
            >
              Cancelados
            </button>
          </div>
        </div>

        {/* Search Input bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50" />
          <input
            type="text"
            placeholder={isAdmin ? "Buscar por cliente, serviço ou profissional..." : "Buscar seus serviços..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
          />
        </div>

        {/* Render actual Booking items */}
        {visibleBookings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#2D2D39] rounded-xl bg-[#1C1C24]/30">
            <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">Nenhum agendamento encontrado.</p>
            {!isAdmin && (
              <button
                onClick={onNavigateToBook}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Agende Seu Primeiro Horário
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleBookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-[#1C1C24] p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4 transition-all hover:translate-x-1 border ${
                  booking.status === 'confirmed'
                    ? 'border-l-4 border-l-blue-500 border-[#2D2D39]'
                    : booking.status === 'cancelled'
                    ? 'border-l-4 border-l-red-500 border-[#2D2D39]'
                    : 'border-l-4 border-l-yellow-500 border-[#2D2D39]'
                }`}
              >
                {/* Time Indicator */}
                <div className={`flex flex-col items-center justify-center min-w-[75px] py-2 rounded-lg font-bold ${
                  booking.status === 'confirmed'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-[#16161D] text-gray-500'
                }`}>
                  <span className="text-lg leading-none">{booking.timeSlot}</span>
                  <span className="text-[9px] uppercase mt-1 tracking-wider">
                    {parseInt(booking.timeSlot) >= 12 ? 'PM' : 'AM'}
                  </span>
                </div>

                {/* Patient/Service Details */}
                <div className="flex-1 min-w-0 font-sans">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-extrabold text-white text-base">
                      {booking.clientName} {isAdmin && <span className="text-xs text-blue-400/80 font-mono">({booking.clientPhone})</span>}
                    </h4>
                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      booking.status === 'confirmed'
                        ? 'bg-blue-900/10 text-blue-400 border border-blue-500/30'
                        : booking.status === 'cancelled'
                        ? 'bg-red-950/20 text-red-400 border border-red-500/20'
                        : 'bg-yellow-950/20 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Scissors className="w-3.5 h-3.5 text-blue-400" />
                      {booking.serviceName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {booking.duration} min
                    </span>
                    <span className="text-purple-400 font-medium">
                      Profissional: {booking.professionalName}
                    </span>
                    <span className="text-blue-400 font-bold ml-auto md:ml-0">
                      R$ {booking.price}
                    </span>
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center gap-2 border-t border-[#2D2D39] md:border-t-0 pt-3 md:pt-0 justify-end">
                  {isAdmin ? (
                    <>
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          title="Confirmar Agendamento"
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status !== 'pending' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'pending')}
                          title="Marcar como Pendente"
                          className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 transition-colors cursor-pointer"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          title="Cancelar Agendamento"
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Critical Delete Capability Requested explicitly by customer */}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        title="Deletar Agendamento Permanente"
                        className="p-2 bg-[#1C1C24] hover:bg-red-600 hover:text-white border border-[#2D2D39] text-red-400 hover:border-red-600 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    // Customer Client actions
                    booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-450 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Modal for ADMIN quick walk-in addition */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-lg bg-[#16161D] border border-[#2D2D39] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white">Novo Agendamento Presencial</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAdminAddBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silveira"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Celular do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98888-7777"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Serviço</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-3 text-white text-sm cursor-pointer"
                  >
                    {haircuts.map(h => (
                      <option key={h.id} value={h.id} className="bg-[#16161D] text-white">{h.title} (R$ {h.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Barbeiro</label>
                  <select
                    value={selectedProId}
                    onChange={(e) => setSelectedProId(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-3 text-[#E2E8F0] text-sm cursor-pointer"
                  >
                    {professionals.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#16161D] text-white">{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A0AEC0] text-xs font-bold uppercase tracking-wider block mb-1">Data</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[#A0AEC0] text-xs font-bold uppercase tracking-wider block mb-1">Horário</label>
                  <input
                    type="text"
                    placeholder="10:30"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#1C1C24] border border-[#2D2D39] rounded-xl py-2.5 px-4 text-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm mt-4 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Confirmar Agendamento Direto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
