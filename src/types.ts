export interface Car {
  id: string;
  name: string;
  year: number;
  category: string;
  categoryAr: string;
  plateLetters: string;
  plateNumbers: string;
  dailyPrice: number;
  dealerName: string;
  location: string;
  mileage: string;
  transmission: string;
  seats: number;
  fuel: string;
  status: 'available' | 'rented' | 'maintenance' | 'reserved';
  statusAr: string;
  image: string;
  isFeatured?: boolean;
  deposit: number;
  insurancePrice: number;
  serviceFee: number;
  routeAllowanceKm: number;
}

export interface Booking {
  id: string;
  code: string;
  car: Car;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  days: number;
  distanceKm: number;
  dailyPrice: number;
  rentalSubtotal: number;
  insuranceFee: number;
  serviceFee: number;
  deposit: number;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  statusAr: string;
  officerName: string;
  officerPhone: string;
  officerAvatar: string;
  insurancePolicyNumber: string;
  notes?: string;
  createdAt: string;
}

export interface DealerRequest {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  carName: string;
  route: string;
  period: string;
  days: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'declined';
  statusAr: string;
  pickupTime: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  roadName: string;
}

export interface Profile {
  id: string;
  role: 'customer' | 'dealer' | 'super_admin';
  full_name?: string;
  phone?: string;
}
