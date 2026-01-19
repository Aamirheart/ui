"use client";

import { useState, useMemo } from "react";
import SlotGroup from "./SlotGroup";
import BookingSkeleton from "./BookingSkeleton";
import { mockSlots } from "./mockSlots";
import { useFetchSlots } from "@/hooks/useFetchSlots";

// 👇 Toggle this when needed
const USE_MOCK = true;

export default function BookingCard() {
  // Always call hook (to respect hooks rules)
  const api = useFetchSlots({
    therapist_id: "48",
    loc_id: "2",
    service_id: "13",
  });
  

  // Decide which data source to use
  const data = USE_MOCK ? mockSlots : api.data;
  const loading = USE_MOCK ? false : api.loading;
  const error = USE_MOCK ? null : api.error;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const dates: string[] = data?.dates ?? [];
  const slots: string[] = data?.Slots ?? [];

  const activeDate = selectedDate ?? dates[0];

  const filteredSlots = useMemo(() => {
    if (!activeDate) return [];
    return slots
      .filter((s) => s.startsWith(activeDate))
      .map((s) => s.split(" ")[1]);
  }, [slots, activeDate]);

  const grouped = useMemo(() => {
    const groups = { morning: [] as string[], afternoon: [], evening: [] };

    filteredSlots.forEach((time) => {
      const hour = parseInt(time.split(":")[0]);
      if (hour < 12) groups.morning.push(time);
      else if (hour < 17) groups.afternoon.push(time);
      else groups.evening.push(time);
    });

    return groups;
  }, [filteredSlots]);

  if (loading) return <BookingSkeleton />;
  if (error) return <div className="text-red-500">Failed to load slots</div>;

  const getDayDate = (dateStr: string) => {
  const d = new Date(dateStr);

  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    date: d.getDate(),
  };
};

  return (
    <div className="bg-white rounded-[51px] shadow-[0_0_12px_rgba(0,0,0,0.15)] p-6 space-y-5">

      {/* Dates */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {dates.map((date) => {
  const { day, date: dayNumber } = getDayDate(date);

  return (
    <button
      key={date}
      onClick={() => {
        setSelectedDate(date);
        setSelectedSlot(null);
      }}
      className={`rounded-xl px-4 py-2 whitespace-nowrap border transition-all 
        ${
          activeDate === date
            ? "bg-[#E5F7F9] border-[#00838F] text-[#00838F] font-semibold"
            : "bg-white border-[#00838F] text-slate-500 hover:bg-[#E5F7F9]"
        }`}
    >
      <p className="f-18-16-auto leading-none">{day}</p>
      <p className="f-18-16-auto font-semibold leading-tight">{dayNumber}</p>
    </button>
  );
})}

      </div>

      <SlotGroup title="Morning Slots" slots={grouped.morning} selected={selectedSlot} onSelect={setSelectedSlot} />
      <SlotGroup title="Afternoon Slots" slots={grouped.afternoon} selected={selectedSlot} onSelect={setSelectedSlot} />
      <SlotGroup title="Evening Slots" slots={grouped.evening} selected={selectedSlot} onSelect={setSelectedSlot} />

      <button
        disabled={!selectedSlot}
        className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold disabled:opacity-40"
      >
        {selectedSlot ? `Confirm ${selectedSlot}` : "Select a Slot"}
      </button>
    </div>
  );
}
