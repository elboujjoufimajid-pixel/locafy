"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  checkin: string;
  checkout: string;
  onCheckin: (v: string) => void;
  onCheckout: (v: string) => void;
  days?: string[];
  months?: string[];
  disabledDates?: string[];
}

const DEFAULT_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const DEFAULT_MONTHS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

type Flex = 0 | 1 | 2 | 3 | 7;

function toDate(s: string) { return s ? new Date(s + "T00:00:00") : null; }
function toStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function addDays(s: string, n: number) {
  const d = new Date(s + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toStr(d);
}

function MonthGrid({
  year, month, checkin, checkout, hovered,
  onSelect, onHover, days: DAYS = DEFAULT_DAYS, months: MONTHS = DEFAULT_MONTHS, disabledDates = [],
}: {
  year: number; month: number;
  checkin: string; checkout: string; hovered: string;
  onSelect: (s: string) => void;
  onHover: (s: string) => void;
  days?: string[];
  months?: string[];
  disabledDates?: string[];
}) {
  const today = toStr(new Date());
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert Sunday=0 to Monday=0
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function dateStr(day: number) {
    return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }

  function inRange(ds: string) {
    const a = checkin;
    const b = checkout || hovered;
    if (!a || !b) return false;
    const [lo, hi] = a < b ? [a, b] : [b, a];
    return ds > lo && ds < hi;
  }

  return (
    <div className="w-full">
      <p className="text-center font-bold text-gray-900 mb-4">
        {MONTHS[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const ds = dateStr(day);
          const isPast = ds < today;
          const isBlocked = disabledDates.includes(ds);
          const isStart = ds === checkin;
          const isEnd = ds === checkout;
          const isToday = ds === today;
          const isInRange = inRange(ds);
          const isHovered = ds === hovered;

          let cls = "relative h-9 w-full flex items-center justify-center text-sm cursor-pointer transition-colors select-none ";

          if (isPast || isBlocked) {
            cls += isBlocked
              ? "text-red-300 cursor-not-allowed line-through "
              : "text-gray-300 cursor-not-allowed ";
          } else if (isStart || isEnd) {
            cls += "bg-[#003580] text-white font-bold rounded-full z-10 ";
          } else if (isInRange) {
            cls += "bg-blue-100 text-gray-900 ";
            // Round left edge if previous cell is not in range
            if (i % 7 === 0 || cells[i-1] === null) cls += "rounded-l-full ";
            if (i % 7 === 6 || cells[i+1] === null) cls += "rounded-r-full ";
          } else if (isHovered && checkin && !checkout) {
            cls += "bg-blue-50 text-gray-900 rounded-full ";
          } else if (isToday) {
            cls += "text-[#0071c2] font-bold hover:bg-blue-50 rounded-full ";
          } else {
            cls += "text-gray-800 hover:bg-gray-100 rounded-full ";
          }

          return (
            <div
              key={i}
              className={cls}
              onClick={() => !isPast && !isBlocked && onSelect(ds)}
              onMouseEnter={() => !isPast && !isBlocked && onHover(ds)}
              onMouseLeave={() => onHover("")}
            >
              {isToday && !isStart && !isEnd && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0071c2]" />
              )}
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ checkin, checkout, onCheckin, onCheckout, days: DAYS = DEFAULT_DAYS, months: MONTHS = DEFAULT_MONTHS, disabledDates = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const [flex, setFlex] = useState<Flex>(0);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function prevMonth() {
    const now2 = new Date();
    if (viewYear === now2.getFullYear() && viewMonth === now2.getMonth()) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  // Second month
  const month2 = viewMonth === 11 ? 0 : viewMonth + 1;
  const year2 = viewMonth === 11 ? viewYear + 1 : viewYear;

  function handleSelect(ds: string) {
    if (!checkin || (checkin && checkout)) {
      onCheckin(ds);
      onCheckout("");
    } else {
      if (ds < checkin) {
        onCheckin(ds);
        onCheckout("");
      } else if (ds === checkin) {
        onCheckin("");
      } else {
        onCheckout(ds);
        setOpen(false);
      }
    }
  }

  function clear() {
    onCheckin("");
    onCheckout("");
    setFlex(0);
  }

  function applyFlex(days: Flex) {
    setFlex(days);
    if (checkin && days > 0) {
      onCheckout(addDays(checkin, days));
    }
  }

  const label = checkin && checkout
    ? `${checkin} — ${checkout}`
    : checkin
    ? `${checkin} — Départ`
    : "Date arrivée — Date départ";

  const isPastMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  return (
    <div ref={ref} className="relative flex-1">
      {/* Trigger */}
      <div
        className="flex items-center gap-3 bg-white px-4 py-3 cursor-pointer h-full"
        onClick={() => setOpen(o => !o)}
      >
        <CalendarDays className="w-5 h-5 text-gray-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">Dates</p>
          <p className={`text-sm truncate ${checkin ? "text-gray-900 font-medium" : "text-gray-400"}`}>
            {label}
          </p>
        </div>
        {(checkin || checkout) && (
          <button
            onClick={e => { e.stopPropagation(); clear(); }}
            className="text-gray-300 hover:text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 w-[320px] sm:w-auto sm:min-w-[640px]">

          {/* Navigation */}
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              onClick={prevMonth}
              disabled={isPastMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* One month on mobile, two on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MonthGrid
              year={viewYear} month={viewMonth}
              checkin={checkin} checkout={checkout} hovered={hovered}
              onSelect={handleSelect} onHover={setHovered}
              days={DAYS} months={MONTHS} disabledDates={disabledDates}
            />
            <div className="hidden sm:block">
              <MonthGrid
                year={year2} month={month2}
                checkin={checkin} checkout={checkout} hovered={hovered}
                onSelect={handleSelect} onHover={setHovered}
                days={DAYS} months={MONTHS} disabledDates={disabledDates}
              />
            </div>
          </div>

          {/* Flex pills */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
            {([0, 1, 2, 3, 7] as Flex[]).map(d => (
              <button
                key={d}
                onClick={() => applyFlex(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  flex === d
                    ? "border-[#0071c2] text-[#0071c2] bg-blue-50"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {d === 0 ? "Dates exactes" : `+${d}j`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
