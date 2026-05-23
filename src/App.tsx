import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  User as UserIcon, 
  Scissors, 
  ShieldAlert, 
  ArrowRightLeft, 
  CheckCircle,
  HelpCircle,
  X,
  RefreshCw
} from 'lucide-react';

import { User, Booking, Haircut, Professional } from './types';
import { 
  INITIAL_HAIRCUTS, 
  INITIAL_PROFESSIONALS, 
  INITIAL_BOOKINGS, 
  GENERAL_MOCK_CLIENTS 
} from './data';

import {
  fetchUsersFromDb,
  saveUserToDb,
  fetchHaircutsFromDb,
  saveHaircutToDb,
  deleteHaircutFromDb,
  fetchBarbersFromDb,
  saveBarberToDb,
  deleteBarberFromDb,
  fetchBookingsFromDb,
  saveBookingToDb,
  deleteBookingFromDb
} from './firebase';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import Book from './components/Book';
import Profile from './components/Profile';

export default function App() {
  // 1. Core States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('glacier_curr_user');
    if (saved) return JSON.parse(saved);
    // Start with default logged-in Client Marcos de Souza
    return GENERAL_MOCK_CLIENTS[0];
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [clientsList, setClientsList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'book' | 'profile'>('dashboard');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  // Sync current user preference to localStorage
  useEffect(() => {
    localStorage.setItem('glacier_curr_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  // Load and seed Firestore database on startup (Cold-start Auto-Seeder)
  useEffect(() => {
    async function loadAndSeedData() {
      try {
        setDbLoading(true);

        // 1. Load & Seed Haircuts Catalogue
        let dbHaircuts = await fetchHaircutsFromDb();
        if (dbHaircuts.length === 0) {
          for (const item of INITIAL_HAIRCUTS) {
            await saveHaircutToDb(item);
          }
          dbHaircuts = INITIAL_HAIRCUTS;
        }
        setHaircuts(dbHaircuts);

        // 2. Load & Seed Active Barbers
        let dbBarbers = await fetchBarbersFromDb();
        if (dbBarbers.length === 0) {
          for (const barber of INITIAL_PROFESSIONALS) {
            await saveBarberToDb(barber);
          }
          dbBarbers = INITIAL_PROFESSIONALS;
        }
        setProfessionals(dbBarbers);

        // 3. Load & Seed Bookings list
        let dbBookings = await fetchBookingsFromDb();
        if (dbBookings.length === 0) {
          for (const booking of INITIAL_BOOKINGS) {
            await saveBookingToDb(booking);
          }
          dbBookings = INITIAL_BOOKINGS;
        }
        setBookings(dbBookings);

        // 4. Load & Seed Clients registered
        let dbUsers = await fetchUsersFromDb();
        if (dbUsers.length === 0) {
          for (const clientUser of GENERAL_MOCK_CLIENTS) {
            await saveUserToDb(clientUser);
          }
          dbUsers = GENERAL_MOCK_CLIENTS;
        }
        setClientsList(dbUsers);

      } catch (err) {
        console.error("Erro ao sincronizar banco de dados Firestore: ", err);
      } finally {
        setDbLoading(false);
      }
    }
    loadAndSeedData();
  }, []);

  // --- Dynamic Sync Event Wrappers ---

  // Handle addition of a new booking from the Booking widget or Admin quick include
  const handleConfirmBooking = async (newBooking: Booking) => {
    await saveBookingToDb(newBooking);
    setBookings((prev) => [newBooking, ...prev]);
    setActiveTab('dashboard');
  };

  // Handle booking roster updates (state updates, deletes, confirms)
  const handleUpdateBookings = async (updatedList: Booking[]) => {
    try {
      // Find updated or added items
      for (const item of updatedList) {
        const found = bookings.find((b) => b.id === item.id);
        if (!found || JSON.stringify(found) !== JSON.stringify(item)) {
          await saveBookingToDb(item);
        }
      }
      // Find deleted items
      for (const oldItem of bookings) {
        if (!updatedList.some((ob) => ob.id === oldItem.id)) {
          await deleteBookingFromDb(oldItem.id);
        }
      }
      setBookings(updatedList);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle haircut catalogue updates (additions, deletions, edits)
  const handleAddHaircut = async (newH: Haircut) => {
    await saveHaircutToDb(newH);
    setHaircuts((prev) => [newH, ...prev]);
  };

  const handleUpdateHaircut = async (updated: Haircut) => {
    await saveHaircutToDb(updated);
    setHaircuts((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleDeleteHaircut = async (id: string) => {
    await deleteHaircutFromDb(id);
    setHaircuts((prev) => prev.filter((h) => h.id !== id));
  };

  // Handle professionals/barbers list updates
  const handleUpdateProfessionals = async (updatedList: Professional[]) => {
    try {
      for (const item of updatedList) {
        const found = professionals.find((p) => p.id === item.id);
        if (!found || JSON.stringify(found) !== JSON.stringify(item)) {
          await saveBarberToDb(item);
        }
      }
      for (const oldItem of professionals) {
        if (!updatedList.some((op) => op.id === oldItem.id)) {
          await deleteBarberFromDb(oldItem.id);
        }
      }
      setProfessionals(updatedList);
    } catch (err) {
      console.error(err);
    }
  };

  // Switch role simulator (maintains active reactive user syncing too)
  const toggleRoleSimulator = async () => {
    if (!currentUser) return;
    if (currentUser.role === 'client') {
      const adminUser: User = {
        id: 'admin_id',
        name: 'Administrador Glacier',
        email: 'admin@glacierbarber.com.br',
        phone: '(11) 99999-9999',
        role: 'admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaBBIkrt-EBoYQW40EWsFTx8ITTKf0iP48jDUZ8CKZOEB8BHlhdYR8EtIm_Htgikk_JfrZCMILW2deMS1mIswVmMOFFYmWHeJsJUesbpuR7STbNJc4vthisReMB_EFZ9GXX6zhJo8zL-ZitfZQoS4hGOOUV5eS7yaryZruR8-MAFDhdcY4jO2D6GY32AZ62jxyTI3HDl3J3EFgFio6PCaohjGzOQZMuRduYsS-zBpyBIJawHZWaEttdpxkhzsB_gAtM_EfjYq52U4'
      };
      await saveUserToDb(adminUser);
      setCurrentUser(adminUser);
    } else {
      setCurrentUser(GENERAL_MOCK_CLIENTS[0]);
    }
    setActiveTab('dashboard');
  };

  const currentBarberPhoto = currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFR11Vg6lkCQyuDFDlYvqxjTfUcmHO9Go-kTATuzgFJolrLcZEDolKCpej8OgfyafeiNC3RCxarhq-_3bmTad0CrVlMMGyuuy-D6b0w2pn5BZfRbnP17yPaoacBpAurzQYT0goh2nWh-158T2S4_hoaLV9B80cgM_zi_XC-SX6NTsR8-rxtSkFpC1YZqoLcL65PI1AVyqiVkXLo_evuK6-mszt09RzMMTkIQyxkugttkVWhm1KThnjiomdN_fOzoG5NDr2MhRkTA';

  // Rendering a elegant loading state spinner while connection handles seeding
  if (dbLoading) {
    return (
      <div className="bg-[#0F0F12] text-[#E2E8F0] min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="bg-[#16161D] border border-[#2D2D39] p-8 rounded-3xl max-w-sm w-full mx-4 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
          <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">Glacier Barber</h3>
          <p className="text-gray-400 font-medium text-sm">sincronizando banco de dados...</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-100"></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-200"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0F12] text-[#E2E8F0] min-h-screen pb-32 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background Atmosphere Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Floating simulator pill for fast testing both roles */}
      {currentUser && (
        <div className="fixed bottom-26 left-6 z-40">
          <button
            onClick={toggleRoleSimulator}
            className="flex items-center gap-2 bg-[#16161D] border border-[#2D2D39] backdrop-blur-md px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-400 hover:text-white transition-all shadow-lg hover:bg-[#1C1C24] active:scale-95 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Alternar para {currentUser.role === 'client' ? 'ADMINISTRADOR' : 'CLIENTE'}
          </button>
        </div>
      )}

      {/* Top Main App Bar */}
      <header className="fixed top-0 w-full z-40 bg-[#16161D]/90 backdrop-blur-xl border-b border-[#2D2D39] flex justify-between items-center px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#2D2D39] ring-2 ring-blue-500/20">
            <img 
              alt="Glacier Barber Profile Logo" 
              src={currentBarberPhoto} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Glacier Barber</h1>
            {currentUser && (
              <span className="text-[10px] font-bold text-blue-400 font-mono tracking-wider block -mt-1 uppercase">
                {currentUser.role === 'admin' ? 'Painel Admin' : 'Painel Cliente'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="text-blue-400 hover:bg-blue-500/10 transition-colors p-2 rounded-xl active:scale-95 duration-200 relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
          </button>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="pt-26 px-6 max-w-5xl mx-auto min-h-[75vh]">
        {!currentUser ? (
          <Auth onLogin={async (user) => {
            await saveUserToDb(user);
            if (!clientsList.some(c => c.id === user.id)) {
              setClientsList((prev) => [user, ...prev]);
            }
            setCurrentUser(user);
            setActiveTab('dashboard');
          }} />
        ) : (
          <>
            {/* Navigational Tabs routing */}
            {activeTab === 'dashboard' && (
              <Dashboard 
                currentUser={currentUser}
                bookings={bookings}
                haircuts={haircuts}
                professionals={professionals}
                onUpdateBookings={handleUpdateBookings}
                onNavigateToBook={() => setActiveTab('book')}
              />
            )}

            {activeTab === 'catalog' && (
              <Catalog 
                currentUser={currentUser}
                haircuts={haircuts}
                onAddHaircut={handleAddHaircut}
                onUpdateHaircut={handleUpdateHaircut}
                onDeleteHaircut={handleDeleteHaircut}
              />
            )}

            {activeTab === 'book' && (
              <Book 
                currentUser={currentUser}
                haircuts={haircuts}
                professionals={professionals}
                onConfirmBooking={handleConfirmBooking}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'profile' && (
              <Profile 
                currentUser={currentUser}
                professionals={professionals}
                clientsList={clientsList}
                onLogout={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('glacier_curr_user');
                }}
                onUpdateProfessionals={handleUpdateProfessionals}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Quick Action Reservation Button (FAB) - For Client Users */}
      {currentUser && currentUser.role === 'client' && activeTab !== 'book' && (
        <button
          onClick={() => setActiveTab('book')}
          className="fixed bottom-26 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center z-40 active:scale-95 transition-all cursor-pointer font-bold hover:scale-105"
        >
          <span className="text-3xl">+</span>
        </button>
      )}

      {/* Fixed Navigation Bottom Bar */}
      {currentUser && (
        <nav className="fixed bottom-0 w-full z-40 rounded-t-2xl bg-[#16161D]/95 backdrop-blur-2xl border-t border-[#2D2D39] shadow-[0_-5px_25px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 px-4 pb-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-blue-400 bg-blue-500/10 scale-105'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'text-blue-400 bg-blue-500/10 scale-105'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans">Catálogo</span>
          </button>

          <button
            onClick={() => setActiveTab('book')}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'text-blue-400 bg-blue-500/10 scale-105'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans">Agendar</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-blue-400 bg-blue-500/10 scale-105'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans">Perfil</span>
          </button>
        </nav>
      )}

      {/* Notification Toast Alert dialog */}
      {showNotificationPopup && (
        <div className="fixed inset-x-4 top-20 md:inset-x-auto md:right-8 md:top-20 z-50 p-4 max-w-sm rounded-2xl bg-[#16161D] border border-[#2D2D39] shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] tracking-wider uppercase font-extrabold text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Avisos Recentes
            </span>
            <button onClick={() => setShowNotificationPopup(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-[#1C1C24] border border-[#2D2D39]">
              <p className="text-xs text-white font-bold">Promoção do Mês de Outubro</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">Selecione o Combo "The Glacier Treatment" e receba massagem facial premium inclusa gratuitamente.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#1C1C24] border border-[#2D2D39]">
              <p className="text-xs text-white font-bold">Novo Barbeiro Contratado</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">Elena agora integra nossa tripulação trazendo as últimas tendências europeias em cortes de cabelo.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
