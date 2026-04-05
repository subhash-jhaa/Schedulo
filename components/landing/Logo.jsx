import { Calendar } from 'lucide-react';

export default function Logo({ variant = 'default' }) {
  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-slate-900 p-2 rounded-xl">
          <Calendar className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">Schedulr.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="bg-slate-900 p-2 rounded-xl">
        <Calendar className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-semibold tracking-tight text-slate-900">Schedulr</span>
    </div>
  );
}
