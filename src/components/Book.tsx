import React, { useState } from 'react';
import { Scissors, User, Calendar, Clock, Check, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Haircut, Professional, Booking, User as UserType } from '../types';

interface BookProps {
  currentUser: UserType;
  haircuts: Haircut[];
  professionals: Professional[];
  onConfirmBooking: (booking: Booking) => void;
  onCancel: () => void;
}

export default function Book({
  currentUser,
  haircuts,
  professionals,
  onConfirmBooking,
  onCancel
}: BookProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<Haircut>(haircuts[0] || null);
  const [selectedPro, setSelectedPro] = useState<Professional>(professionals[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-12'); // matching screenshot
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const timeSlots = [
    { label: '09:00 AM', available: true },
    { label: '10:30 AM', available: true },
    { label: '11:45 AM', available: true },
    { label: '02:15 PM', available: true },
    { label: '03:30 PM', available: true },
    { label: '05:00 PM', available: false } // crossed out like screenshot
  ];

  // Simulated calendar days for October 2026
  const calendarDays = [
    { dayNum: '25', inactive: true },
    { dayNum: '26', inactive: true },
    { dayNum: '27', inactive: true },
    { dayNum: '28', inactive: true },
    { dayNum: '29', inactive: true },
    { dayNum: '30', inactive: true },
    { dayNum: '1', active: true, selected: true }, // 1st of October (selected)
    { dayNum: '2' },
    { dayNum: '3' },
    { dayNum: '4' },
    { dayNum: '5' },
    { dayNum: '6' },
    { dayNum: '7' },
    { dayNum: '8' }
  ];

  const handleConfirm = () => {
    if (!selectedService || !selectedPro) return;

    // Convert PM/AM to standard format
    const cleanTime = selectedTimeSlot.replace(' AM', '').replace(' PM', '');

    const newBooking: Booking = {
      id: 'b_' + Date.now(),
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone || '(11) 99123-4567',
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      professionalId: selectedPro.id,
      professionalName: selectedPro.name,
      date: selectedDate,
      timeSlot: cleanTime,
      status: 'pending', // Starts pending like in real life
      price: selectedService.price,
      duration: selectedService.duration
    };

    setShowSuccessOverlay(true);
    setTimeout(() => {
      onConfirmBooking(newBooking);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 space-y-8 animate-fade-in pb-28 relative font-sans">
      {/* Top Banner Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="p-2 bg-[#16161D] border border-[#2D2D39] text-blue-400 hover:text-white rounded-xl active:scale-95 duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-white">Agendar Estilo</h2>
          <p className="text-xs text-gray-400">Simples, rápido e exclusivo</p>
        </div>
      </div>

      {/* Progress Steps Indicators */}
      <div className="flex justify-between items-center px-4 bg-[#16161D] p-4 border border-[#2D2D39] rounded-2xl">
        <button
          onClick={() => setStep(1)}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none cursor-pointer ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
            step === 1 ? 'bg-blue-600 text-white font-extrabold ring-4 ring-blue-500/20' : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39]'
          }`}>
            1
          </div>
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-400">Serviço</span>
        </button>

        <div className="h-[1px] flex-1 bg-[#2D2D39] mx-4"></div>

        <button
          onClick={() => selectedService && setStep(2)}
          disabled={!selectedService}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
            step === 2 ? 'bg-blue-600 text-white font-extrabold ring-4 ring-blue-500/20' : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39]'
          }`}>
            2
          </div>
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">Barbeiro</span>
        </button>

        <div className="h-[1px] flex-1 bg-[#2D2D39] mx-4"></div>

        <button
          onClick={() => selectedService && selectedPro && setStep(3)}
          disabled={!selectedService || !selectedPro}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none ${step === 3 ? 'opacity-100' : 'opacity-40'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
            step === 3 ? 'bg-blue-600 text-white font-extrabold ring-4 ring-blue-500/20' : 'bg-[#1C1C24] text-gray-400 border border-[#2D2D39]'
          }`}>
            3
          </div>
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">Horário</span>
        </button>
      </div>

      {/* 1. SELECT SERVICE STEP */}
      {step === 1 && (
        <section className="space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-blue-400" />
            Selecione o Serviço Desejado
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {haircuts.map((haircut) => (
              <label 
                key={haircut.id} 
                onClick={() => setSelectedService(haircut)}
                className="relative cursor-pointer group block"
              >
                <input 
                  type="radio" 
                  name="service-select"
                  checked={selectedService?.id === haircut.id}
                  onChange={() => {}}
                  className="sr-only" 
                />
                <div className={`p-5 rounded-2xl transition-all duration-300 bg-[#1C1C24] border hover:bg-blue-500/5 ${
                  selectedService?.id === haircut.id
                    ? 'border-blue-500 bg-blue-600/10 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                    : 'border-[#2D2D39]'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                      <Scissors className="text-blue-450 w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-3 py-1 rounded-full font-mono">
                      R$ {haircut.price}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-base">{haircut.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{haircut.description}</p>
                  <p className="text-[10px] uppercase tracking-wide text-blue-400/70 font-mono font-bold mt-2">
                    DURAÇÃO: {haircut.duration} MINUTOS
                  </p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 mt-6 active:scale-95 transition-transform hover:bg-blue-700 cursor-pointer"
          >
            <span>Prosseguir para Barbeiro</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      )}

      {/* 2. SELECT PROFESSIONAL */}
      {step === 2 && (
        <section className="space-y-6 animate-fade-in">
          <h3 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Escolha o Seu Barbeiro Especialista
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
            {professionals.map((pro) => (
              <button
                key={pro.id}
                onClick={() => setSelectedPro(pro)}
                className="relative flex-shrink-0 focus:outline-none outline-none group text-left cursor-pointer"
              >
                <div className="w-36 flex flex-col items-center gap-3">
                  <div className={`relative w-28 h-28 rounded-full p-1 border-2 transition-all overflow-hidden ${
                    selectedPro?.id === pro.id 
                      ? 'border-blue-500 scale-105 shadow-[0_4px_20px_rgba(37,99,235,0.15)]' 
                      : 'border-transparent group-hover:border-blue-500/40'
                  }`}>
                    <img 
                      alt={pro.name} 
                      src={pro.avatar} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full" 
                    />
                    {selectedPro?.id === pro.id && (
                      <div className="absolute inset-0 bg-blue-500/35 backdrop-blur-[1px] flex items-center justify-center">
                        <Check className="w-8 h-8 text-white stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-white text-sm">{pro.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{pro.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-14 bg-[#1C1C24] border border-[#2D2D39] text-blue-400 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#252531] cursor-pointer"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 h-14 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-blue-700 cursor-pointer font-sans"
            >
              Escolher Horário
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. DATE & TIME SELECTION */}
      {step === 3 && (
        <section className="space-y-6 animate-fade-in">
          <h3 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Data &amp; Horários Disponíveis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Calendar panel */}
            <div className="bg-[#1C1C24] border border-[#2D2D39] p-5 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-5 px-1">
                <span className="font-black text-white">Outubro de 2026</span>
                <div className="flex gap-1.5">
                  <button type="button" className="p-2 bg-[#16161D] border border-[#2D2D39] text-blue-400 rounded-lg hover:text-white cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" className="p-2 bg-[#16161D] border border-[#2D2D39] text-blue-400 rounded-lg hover:text-white cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Week header */}
              <div className="grid grid-cols-7 gap-2 text-center mb-3">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(w => (
                  <span key={w} className="text-[10px] uppercase font-bold text-gray-500 font-mono">{w}</span>
                ))}
              </div>

              {/* Grid calendar items */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, dIdx) => (
                  <button
                    key={dIdx}
                    type="button"
                    disabled={day.inactive}
                    onClick={() => setSelectedDate('2026-10-01')}
                    className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      day.inactive 
                        ? 'text-gray-700 pointer-events-none' 
                        : day.selected 
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg ring-4 ring-blue-500/25 scale-105' 
                        : 'text-white hover:bg-blue-600/15 cursor-pointer border border-[#2D2D39]/40'
                    }`}
                  >
                    {day.dayNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Slots selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">HORÁRIOS DISPONÍVEIS</h4>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.label}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTimeSlot(slot.label)}
                    className={`text-center py-3.5 rounded-xl font-bold text-xs transition-all pointer-events-auto cursor-pointer border ${
                      !slot.available
                        ? 'text-gray-550 border-transparent text-gray-750 line-through pointer-events-none'
                        : selectedTimeSlot === slot.label
                        ? 'bg-blue-600 border-blue-500 text-white font-extrabold shadow-md shadow-blue-500/15'
                        : 'bg-[#1C1C24] border border-[#2D2D39] text-white hover:border-blue-500'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2D2D39]">
            <div className="bg-[#16161D] p-4 rounded-xl border border-[#2D2D39] mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">RESUMO DE AGENDAMENTO</span>
                <p className="text-sm font-extrabold text-white">{selectedService?.title} com {selectedPro?.name}</p>
                <p className="text-[11px] text-gray-400 font-sans">Data: 12 de Outubro de 2026 às {selectedTimeSlot}</p>
              </div>
              <div className="text-right">
                <span className="text-blue-400 font-extrabold text-lg block font-mono">R$ {selectedService?.price}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono block">Pago no Local</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 h-16 bg-[#1C1C24] border border-[#2D2D39] text-blue-400 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#252531] cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-3 h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer font-sans"
              >
                <span>Confirmar Agendamento</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SUCCESS CONFIRMATION MODAL TRANSITION OVERLAY */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="text-center space-y-6 max-w-sm font-sans">
            <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Sparkles className="w-10 h-10 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Estilo Solicitado!</h3>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                Seu agendamento foi encaminhado com sucesso. Você pode acompanhar o status ("Pendente" ou "Confirmado") no seu painel.
              </p>
            </div>
            <div className="pt-4 font-mono text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-pulse">
              REDIRECIONANDO AO PAINEL...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
