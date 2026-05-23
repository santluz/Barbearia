export interface Haircut {
  id: string;
  title: string;
  price: number;
  duration: number; // in minutes
  description: string;
  image: string;
  category: 'classic' | 'fade' | 'beard' | 'long_hair';
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30"
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  duration: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
  preferredStyle?: string;
  avatar?: string;
}
