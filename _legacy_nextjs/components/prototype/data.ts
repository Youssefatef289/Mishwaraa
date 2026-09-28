// بيانات معاينة سياراتاا — تجربة تفاعلية (المسار /demo)
// أرقام ولوحات ومسافات وهمية بغرض عرض تجربة المنتج.

export type Device = 'desktop' | 'phone';
export type ScreenId = 'home' | 'checkout' | 'boarding-pass' | 'bookings' | 'dealer';

export type Car = {
  id: string;
  name: string;
  brand: string;
  type: string;
  typeLabel: string;
  plate: string;
  pricePerDay: number;
  perKm: number;
  seats: number;
  transmission: string;
  fuel: string;
  features: string[];
  city: string;
  dealer: string;
  color: string;
  rating: number;
  year: number;
};

export const CITIES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الساحل الشمالي', 'الغردقة', 'شرم الشيخ'];

export const DESTINATIONS = [
  { name: 'الساحل الشمالي', km: 580 },
  { name: 'الجونة', km: 920 },
  { name: 'الإسكندرية', km: 440 },
  { name: 'شرم الشيخ', km: 1020 },
  { name: 'السخنة', km: 260 },
  { name: 'الغردقة', km: 460 },
];

export const FLEET: Car[] = [
  {
    id: 'tucson', name: 'هيونداي توسان 2024', brand: 'HYUNDAI', type: 'suv', typeLabel: 'SUV',
    plate: 'س ج د 9418', pricePerDay: 1900, perKm: 4, seats: 5,
    transmission: 'أوتوماتيك 7 سرعات', fuel: 'بنزين',
    features: ['مكيف هواء', 'كاميرا خلفية وركن 360°', 'شاشة 10.25 بوصة', 'سقف بانوراما', 'شاحن لاسلكي'],
    city: 'القاهرة', dealer: 'معرض النخبة موتورز', color: 'أسود معدني', rating: 4.9, year: 2024,
  },
  {
    id: 'corolla', name: 'تويوتا كورولا 2023', brand: 'TOYOTA', type: 'sedan', typeLabel: 'سيدان',
    plate: 'ن ص أ 5201', pricePerDay: 1200, perKm: 3.5, seats: 5,
    transmission: 'أوتوماتيك CVT', fuel: 'بنزين',
    features: ['مكيف هواء', 'شاشة 9 بوصة', 'نظام أمان TSS', 'حساسات ركن', 'مقاعد جلد'],
    city: 'الجيزة', dealer: 'معرض النخبة موتورز', color: 'أبيض لؤلؤي', rating: 4.8, year: 2023,
  },
  {
    id: 'sportage', name: 'كيا سبورتاج 2024', brand: 'KIA', type: 'suv', typeLabel: 'SUV',
    plate: 'ق ل د 7742', pricePerDay: 1700, perKm: 4, seats: 5,
    transmission: 'أوتوماتيك 6 سرعات', fuel: 'بنزين',
    features: ['مكيف أوتوماتيك', 'كاميرا 360°', 'فتحة سقف', 'تحكم ذكي بالثبات', 'مقاعد جلد'],
    city: 'الإسكندرية', dealer: 'معرض النخبة موتورز', color: 'رمادي فحمي', rating: 4.7, year: 2024,
  },
  {
    id: 'sunny', name: 'نيسان صني 2023', brand: 'NISSAN', type: 'sedan', typeLabel: 'سيدان',
    plate: 'ب ج ر 6463', pricePerDay: 900, perKm: 3, seats: 5,
    transmission: 'أوتوماتيك 4 سرعات', fuel: 'بنزين',
    features: ['مكيف هواء', 'شاشة 8 بوصة', 'حساسات ركن خلفية', 'استهلاك اقتصادي'],
    city: 'الغردقة', dealer: 'معرض النخبة موتورز', color: 'فضي', rating: 4.6, year: 2023,
  },
];

export const HIGHWAYS = [
  'EG-HIGHWAY // 2025', 'مصر – الإسكندرية الصحراوي', 'القاهرة – السخنة', 'الجونة – الغردقة',
  'شرم الشيخ – دهب', 'طريق سيناء الساحلي', 'بوابة مارينا 5', 'الطريق الدائري الإقليمي', 'محور 26 يوليو',
];

export const SAFETY = [
  { icon: 'shield', title: 'تأمين شامل للطرق السريعة', text: 'نسبة تحمل صفرية وونش طرق 19822 على مدار الساعة' },
  { icon: 'check', title: 'فحص فني 260 نقطة', text: 'فحص ميكانيكي وإلكتروني معتمد قبل كل تسليم' },
  { icon: 'plate', title: 'لوحات مرور مصرية', text: 'لوحات معدنية معتمدة وتسجيل إلكتروني للعقد' },
  { icon: 'clock', title: 'استلام في دقيقتين', text: 'من بوابة المعرض بتصريح القيادة الرقمي' },
];

export const QUALITY = [
  { label: 'مطابقة السيارات', value: 99.8, sub: 'فحص فني 260 نقطة لكل سيارة عند التسليم' },
  { label: 'سرعة التسليم', value: 96.2, sub: 'متوسط زمن الاستلام من بوابة المعرض' },
  { label: 'استرداد الودائع', value: 98.9, sub: 'رد الوديعة خلال 48 ساعة من الإرجاع' },
];

export const INSURANCE_PER_DAY = 120;
export const PACKAGE_KM = 800;
export const DEPOSIT = 3000;
export type Trip = {
  code: string;
  car: Car;
  from: string;
  to: string;
  start: string;
  end: string;
  days: number;
  distanceKm: number;
  packageKm: number;
  rentCost: number;
  insuranceCost: number;
  extraKmCost: number;
  deposit: number;
  total: number;
};

export function computeTrip(car: Car, destinationName: string, start: string, days: number): Trip {
  const dest = DESTINATIONS.find((d) => d.name === destinationName) ?? DESTINATIONS[0];
  const extraKm = Math.max(0, dest.km - PACKAGE_KM);
  const rentCost = Math.round(days * car.pricePerDay);
  const insuranceCost = Math.round(days * INSURANCE_PER_DAY);
  const extraKmCost = Math.round(extraKm * car.perKm);
  const total = rentCost + insuranceCost + extraKmCost + DEPOSIT;
  const startD = new Date(`${start}T00:00:00`);
  const endD = new Date(startD.getTime());
  endD.setDate(endD.getDate() + days - 1);
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const fmt = (d: Date) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const numeric = ((car.id.length * 977 + days * 131 + dest.km * 7) % 9000) + 1000;
  return {
    code: `MSH-${numeric}-TCK`,
    car,
    from: `تجمع المعارض، ${car.city}`,
    to: `${destinationName} — طريق مصر الساحلي`,
    start: fmt(startD),
    end: fmt(endD),
    days,
    distanceKm: dest.km,
    packageKm: PACKAGE_KM,
    rentCost,
    insuranceCost,
    extraKmCost,
    deposit: DEPOSIT,
    total,
  };
}

export const DEFAULT_TRIP: Trip = {
  code: 'MSH-8841-TCK',
  car: FLEET[0],
  from: 'التجمع الخامس، القاهرة',
  to: 'مارينا 5، الساحل الشمالي',
  start: '12 أكتوبر 2026',
  end: '19 أكتوبر 2026',
  days: 7,
  distanceKm: 580,
  packageKm: PACKAGE_KM,
  rentCost: 13300,
  insuranceCost: 840,
  extraKmCost: 0,
  deposit: DEPOSIT,
  total: 17140,
};

export const ACTIVE_BOOKING = {
  id: 'MSH-8841-TCK',
  car: FLEET[0],
  route: 'التجمع الخامس → مارينا 5 بالساحل الشمالي',
  start: '12 أكتوبر 2026',
  end: '19 أكتوبر 2026',
  days: 7,
  distanceKm: 580,
  coords: '30.0325°N, 31.4365°E · بوابة 2',
  paid: 17140,
  status: 'confirmed',
};

export const UPCOMING_BOOKING = {
  id: 'MSH-9102-PKT',
  car: FLEET[2],
  route: 'القاهرة ← الإسكندرية',
  start: '02 نوفمبر 2026',
  end: '05 نوفمبر 2026',
  days: 3,
  distanceKm: 440,
  paid: 7620,
  status: 'upcoming',
};

export const COMPLETED_TRIPS = [
  { id: 'MSH-5521', car: FLEET[1], route: 'الجيزة ← مرسى مطروح', start: '08 سبتمبر 2026', end: '11 سبتمبر 2026', paid: 5240, inspected: true, depositRefunded: true },
  { id: 'MSH-4477', car: FLEET[3], route: 'الغردقة ← شرم الشيخ', start: '22 أغسطس 2026', end: '26 أغسطس 2026', paid: 4120, inspected: true, depositRefunded: true },
  { id: 'MSH-3904', car: FLEET[0], route: 'القاهرة ← الغردقة', start: '10 يوليو 2026', end: '16 يوليو 2026', paid: 14890, inspected: true, depositRefunded: true },
  { id: 'MSH-3688', car: FLEET[1], route: 'القاهرة ← الأقصر', start: '28 يونيو 2026', end: '02 يوليو 2026', paid: 6730, inspected: true, depositRefunded: false },
];
export const OFFICER = {
  name: 'كابتن عصام منصور',
  role: 'مسؤول التسليم المعتمد',
  phone: '+20 100 123 4567',
  whatsapp: '+20 100 123 4567',
  badge: 'CAPT. ESSAM · EG-HIGHWAY',
};

export const INSURANCE_DOC = {
  policy: 'MSH-INR-2026-8841',
  title: 'وثيقة التأمين الشامل للطرق السريعة',
  deductible: 'تحمل صفري (Zero Deductible)',
  emergency: '19822',
  bullet: ['تغطية الأضرار الناتجة عن الحوادث', 'مساعدات برية وونش طرق 24/7', 'بديل فوري خلال ساعتين', 'سيارة بديلة مجانًا طوال المدة'],
};

export const DEALER = {
  name: 'معرض النخبة موتورز',
  status: 'approved',
  available: 14,
  underReview: 3,
  trips: 27,
  revenue: 84250,
};

export const REQUEST_POOL = [
  { id: 'R-2210', customer: 'أحمد سمير', carId: 'sportage', route: 'الإسكندرية ← مرسى علم', days: 5, total: 12450 },
  { id: 'R-2209', customer: 'مريم عصام', carId: 'tucson', route: 'القاهرة ← شرم الشيخ', days: 6, total: 17760 },
  { id: 'R-2208', customer: 'كريم فتحي', carId: 'sunny', route: 'الغردقة ← الجونة', days: 4, total: 4620 },
];

export const FLEET_MANAGEMENT: { id: string; name: string; plate: string; status: 'available' | 'maintenance' | 'approved' }[] = [
  { id: 'FM-1', name: 'هيونداي توسان 2024', plate: 'س ج د 9418', status: 'available' },
  { id: 'FM-2', name: 'تويوتا كورولا 2023', plate: 'ن ص أ 5201', status: 'available' },
  { id: 'FM-3', name: 'كيا سبورتاج 2024', plate: 'ق ل د 7742', status: 'maintenance' },
  { id: 'FM-4', name: 'نيسان صني 2023', plate: 'ب ج ر 6463', status: 'available' },
  { id: 'FM-5', name: 'هيونداي أزيرا 2024', plate: 'س د م 2135', status: 'maintenance' },
  { id: 'FM-6', name: 'تويوتا هايلاندر 2023', plate: 'ع م ر 8842', status: 'available' },
];

export const SETTLEMENTS = [
  { week: 'الأسبوع الأول', label: '1 – 7 أكتوبر', value: 18200 },
  { week: 'الأسبوع الثاني', label: '8 – 14 أكتوبر', value: 23450 },
  { week: 'الأسبوع الثالث', label: '15 – 21 أكتوبر', value: 21600 },
  { week: 'الأسبوع الرابع', label: '22 – 31 أكتوبر', value: 21000 },
];