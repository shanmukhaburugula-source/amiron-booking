
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';

interface TimezonePickerProps {
  current: string;
  onSelect: (tz: string) => void;
}

const TimezonePicker: React.FC<TimezonePickerProps> = ({ current, onSelect }) => {
  const [search, setSearch] = useState('');
  
  const timezones = useMemo(() => {
    return (Intl as any).supportedValuesOf('timeZone').map((tz: string) => ({
      value: tz,
      label: tz.replace(/_/g, ' ')
    }));
  }, []);

  const fuzzyMatch = (str: string, pattern: string) => {
    const s = str.toLowerCase();
    const p = pattern.toLowerCase();
    if (!p) return true;
    
    if (s.includes(p)) return true;
    
    let n = -1;
    for (let l = 0; l < p.length; l++) {
      if (!~(n = s.indexOf(p[l], n + 1))) return false;
    }
    return true;
  };

  const filtered = useMemo(() => {
    if (!search) return timezones.slice(0, 50);
    return timezones.filter((tz: any) => fuzzyMatch(tz.label, search)).slice(0, 50);
  }, [search, timezones]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 transition-colors">
      <div className="p-5 border-b border-zinc-50 dark:border-zinc-800">
        <div className="relative group">
          <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search timezone..."
            className="w-full pl-11 pr-5 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[350px] p-3 space-y-1.5 custom-scrollbar">
        {filtered.map((tz: any) => (
          <button
            key={tz.value}
            onClick={() => onSelect(tz.value)}
            className={`w-full text-left px-5 py-4 rounded-2xl text-sm transition-all duration-300 ${
              current === tz.value 
                ? 'bg-purple-600 text-white font-bold shadow-lg dark:shadow-none' 
                : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            {tz.label}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-3xl mb-4">🌍</div>
            <p className="text-zinc-400 dark:text-zinc-600 text-xs font-black uppercase tracking-widest italic">
              Region Not Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezonePicker;
