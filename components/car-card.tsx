import Link from 'next/link';
import StatusChip from '@/components/status-chip';
import { CarIcon } from '@/components/icons';

const TYPE_LABELS: Record<string, string> = { economy: 'اقتصادي', family: 'عائلي', suv: 'SUV', luxury: 'فاخر', minibus: 'ميني باص' };

export default function CarCard({ car }: { car: { id: string; name: string; type: string; price_per_day: number; extra_per_km: number; photo_url?: string | null; status?: string; dealers: { name: string; city: string } } }) {
  return (
    <article className="surface overflow-hidden">
      <div className="flex h-40 items-center justify-center bg-surface-2">
        {car.photo_url ? <img src={car.photo_url} alt={car.name} className="h-full w-full object-cover" /> : <CarIcon className="h-10 w-20 text-dim" />}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{car.name}</h3>
          <StatusChip status={car.status || 'available'} />
        </div>
        <p className="text-sm text-dim">{TYPE_LABELS[car.type] || car.type} · {car.dealers.name} · {car.dealers.city}</p>
        <p className="mt-1">
          <span className="font-bold text-amber"><span className="digital">{car.price_per_day} ج/اليوم</span></span>
          <span className="text-dim"> + <span className="digital">{car.extra_per_km} ج/كم</span></span>
        </p>
        <Link href={`/cars/${car.id}/book`} className="primary mt-3 inline-block w-full rounded-lg px-4 py-2 text-center text-sm font-bold">احجز الآن</Link>
      </div>
    </article>
  );
}