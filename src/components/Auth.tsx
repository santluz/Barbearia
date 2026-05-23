import React, { useState } from 'react';
import { User, ShieldCheck, Lock, Star, Sparkles, Scissors, Mail, Phone, ArrowRight, Upload } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<'client' | 'admin'>('client');
  const [message, setMessage] = useState('');

  const [avatar, setAvatar] = useState('/placeholder-avatar.jpg');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!agreeTerms) {
      setMessage('Você deve concordar com os Termos de Serviço.');
      return;
    }

    const newUser: UserType = {
      id: 'u_' + Date.now(),
      name,
      email,
      phone,
      role: 'client',
      preferredStyle,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFR11Vg6lkCQyuDFDlYvqxjTfUcmHO9Go-kTATuzgFJolrLcZEDolKCpej8OgfyafeiNC3RCxarhq-_3bmTad0CrVlMMGyuuy-D6b0w2pn5BZfRbnP17yPaoacBpAurzQYT0goh2nWh-158T2S4_hoaLV9B80cgM_zi_XC-SX6NTsR8-rxtSkFpC1YZqoLcL65PI1AVyqiVkXLo_evuK6-mszt09RzMMTkIQyxkugttkVWhm1KThnjiomdN_fOzoG5NDr2MhRkTA'
    };

    setMessage('Conta criada com sucesso! Redirecionando...');
    setTimeout(() => {
      onLogin(newUser);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Por favor, digite seu e-mail.');
      return;
    }

    // Default simulation based on input
    if (email.toLowerCase().includes('admin')) {
      const adminUser: UserType = {
        id: 'admin_id',
        name: 'Administrador Glacier',
        email: email,
        phone: '(11) 99999-9999',
        role: 'admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaBBIkrt-EBoYQW40EWsFTx8ITTKf0iP48jDUZ8CKZOEB8BHlhdYR8EtIm_Htgikk_JfrZCMILW2deMS1mIswVmMOFFYmWHeJsJUesbpuR7STbNJc4vthisReMB_EFZ9GXX6zhJo8zL-ZitfZQoS4hGOOUV5eS7yaryZruR8-MAFDhdcY4jO2D6GY32AZ62jxyTI3HDl3J3EFgFio6PCaohjGzOQZMuRduYsS-zBpyBIJawHZWaEttdpxkhzsB_gAtM_EfjYq52U4'
      };
      setMessage('Entrando como Admin...');
      setTimeout(() => onLogin(adminUser), 800);
    } else {
      const clientUser: UserType = {
        id: 'demo_client_1',
        name: name || 'Marcos de Souza',
        email: email,
        phone: phone || '(11) 99123-4567',
        role: 'client',
        preferredStyle: 'fade',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFR11Vg6lkCQyuDFDlYvqxjTfUcmHO9Go-kTATuzgFJolrLcZEDolKCpej8OgfyafeiNC3RCxarhq-_3bmTad0CrVlMMGyuuy-D6b0w2pn5BZfRbnP17yPaoacBpAurzQYT0goh2nWh-158T2S4_hoaLV9B80cgM_zi_XC-SX6NTsR8-rxtSkFpC1YZqoLcL65PI1AVyqiVkXLo_evuK6-mszt09RzMMTkIQyxkugttkVWhm1KThnjiomdN_fOzoG5NDr2MhRkTA'
      };
      setMessage('Entrando...');
      setTimeout(() => onLogin(clientUser), 800);
    }
  };

  const loginAsDemo = (role: 'client' | 'admin') => {
    if (role === 'admin') {
      const adminUser: UserType = {
        id: 'admin_id',
        name: 'Administrador Glacier',
        email: 'admin@glacierbarber.com.br',
        phone: '(11) 99999-9999',
        role: 'admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaBBIkrt-EBoYQW40EWsFTx8ITTKf0iP48jDUZ8CKZOEB8BHlhdYR8EtIm_Htgikk_JfrZCMILW2deMS1mIswVmMOFFYmWHeJsJUesbpuR7STbNJc4vthisReMB_EFZ9GXX6zhJo8zL-ZitfZQoS4hGOOUV5eS7yaryZruR8-MAFDhdcY4jO2D6GY32AZ62jxyTI3HDl3J3EFgFio6PCaohjGzOQZMuRduYsS-zBpyBIJawHZWaEttdpxkhzsB_gAtM_EfjYq52U4'
      };
      setMessage('Entrando como Administrador de Demonstração...');
      setTimeout(() => onLogin(adminUser), 600);
    } else {
      const clientUser: UserType = {
        id: 'demo_client_1',
        name: 'Marcos de Souza',
        email: 'marcos@gmail.com',
        phone: '(11) 99123-4567',
        role: 'client',
        preferredStyle: 'fade',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFR11Vg6lkCQyuDFDlYvqxjTfUcmHO9Go-kTATuzgFJolrLcZEDolKCpej8OgfyafeiNC3RCxarhq-_3bmTad0CrVlMMGyuuy-D6b0w2pn5BZfRbnP17yPaoacBpAurzQYT0goh2nWh-158T2S4_hoaLV9B80cgM_zi_XC-SX6NTsR8-rxtSkFpC1YZqoLcL65PI1AVyqiVkXLo_evuK6-mszt09RzMMTkIQyxkugttkVWhm1KThnjiomdN_fOzoG5NDr2MhRkTA'
      };
      setMessage('Entrando como Cliente de Demonstração...');
      setTimeout(() => onLogin(clientUser), 600);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-4 relative z-10 animate-fade-in">
      <div className="bg-[#16161D] border border-[#2D2D39] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden font-sans">
        {/* Subtle luminous highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 font-display">
            Glacier Barber
          </h1>
          <p className="text-gray-400 font-medium">
            {isRegister 
              ? 'Crie sua conta para agendar seu estilo exclusivo.' 
              : 'Seja bem-vindo de volta ao estilo Frozen premium.'}
          </p>
        </header>

        {message && (
          <div className="mb-6 px-4 py-3 bg-blue-500/15 border border-blue-500/30 text-blue-200 text-sm font-medium rounded-xl text-center font-sans">
            {message}
          </div>
        )}

        {isRegister ? (
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Custom Avatar Upload Placeholders */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-28 h-28 rounded-full bg-[#1C1C24] border border-dashed border-[#2D2D39] flex flex-col items-center justify-center overflow-hidden hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                  <span className="text-[10px] text-gray-400 mt-1 font-mono uppercase">Add Foto</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-400 mt-3 tracking-widest uppercase">FOTO DE PERFIL</span>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              {/* Nome Completo */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gabriel Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C24] border border-[#2D2D39] py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C24] border border-[#2D2D39] py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Celular */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Celular</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C24] border border-[#2D2D39] py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Estilo Preferido */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Estilo Preferido</label>
                <div className="relative">
                  <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C24] border border-[#2D2D39] py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-sans text-gray-300"
                  >
                    <option value="" className="bg-[#16161D] text-gray-400">Selecione seu estilo...</option>
                    <option value="fade" className="bg-[#16161D] text-white">Degradê (Fade)</option>
                    <option value="social" className="bg-[#16161D] text-white">Social Clássico</option>
                    <option value="beard" className="bg-[#16161D] text-white">Barba completa</option>
                    <option value="long_hair" className="bg-[#16161D] text-white">Long Texture / Corte moderno</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-3 pt-2 font-sans">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 rounded border-[#2D2D39] bg-[#1C1C24] text-blue-500 focus:ring-blue-500/35 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-snug cursor-pointer font-sans">
                Aceito os <a href="#" className="text-blue-400 hover:underline">Termos de Serviço</a> e a <a href="#" className="text-blue-400 hover:underline">Política de Privacidade</a> da Glacier Barber.
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-900/20 cursor-pointer font-sans"
            >
              <span>Criar Conta</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <footer className="text-center pt-4 font-sans">
              <p className="text-sm text-gray-400">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  Entrar
                </button>
              </p>
            </footer>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 font-sans">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">E-mail ou Usuário</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="seu@email.com ou 'admin'"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C24] border border-[#2D2D39] py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C24] border border-[#2D2D39] py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Custom role selection indicator helper */}
            <div className="text-xs text-blue-400/80 bg-[#1C1C24] p-3 rounded-lg border border-[#2D2D39] font-sans">
              <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-gray-300">Dica de Login:</span>
              Digite <span className="font-mono text-gray-200 font-semibold">'admin'</span> no e-mail para simular o painel administrativo completo. Qualquer outro e-mail entrará como Cliente normal.
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-900/20 cursor-pointer font-sans"
            >
              <span>Entrar</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* DEMO SHORTCUTS SECTION */}
            <div className="pt-4 border-t border-[#2D2D39] font-sans">
              <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">CONECTAR COMO DEMONSTRAÇÃO</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => loginAsDemo('client')}
                  className="py-2.5 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 text-xs font-bold text-blue-400 transition-all cursor-pointer"
                >
                  Cliente Demo
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('admin')}
                  className="py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-xs font-bold text-purple-400 transition-all cursor-pointer"
                >
                  Administrador Demo
                </button>
              </div>
            </div>

            <footer className="text-center font-sans">
              <p className="text-sm text-gray-400">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  Registrar-se
                </button>
              </p>
            </footer>
          </form>
        )}
      </div>

      {/* Decorative footer elements matching screenshot */}
      <div className="mt-8 flex justify-center gap-12 opacity-30 font-sans">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-6 h-6 mb-1 text-white" />
          <span className="text-[10px] font-bold tracking-widest text-[#E2E8F0]">SECURE</span>
        </div>
        <div className="flex flex-col items-center">
          <Lock className="w-6 h-6 mb-1 text-white" />
          <span className="text-[10px] font-bold tracking-widest text-[#E2E8F0]">PRIVATE</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="w-6 h-6 mb-1 text-white" />
          <span className="text-[10px] font-bold tracking-widest text-[#E2E8F0]">PREMIUM</span>
        </div>
      </div>
    </div>
  );
}
