"use client";

import { useState, useMemo } from "react";
import SlotGroup from "./SlotGroup";
import BookingSkeleton from "./BookingSkeleton";
import { mockSlots } from "./mockSlots";
import { useFetchSlots } from "@/hooks/useFetchSlots";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useSearchParams } from "next/navigation";
import BookingForm from "./BookingForm";
// 1. Import the new Summary Component
import BookingSummary from "./BookingSummary";

import "./local.css";
import "swiper/css";
import "swiper/css/navigation";

export default function BookingCard() {
  const searchParams = useSearchParams();
  // ... (keep existing params logic)
  const therapistId = searchParams.get("therapist_id") || "48";
  const locationId = searchParams.get("location") || "2";
  const therapyForId = searchParams.get("therapy_for_id") || "13";
  const phoneFromUrl = searchParams.get("phone") || "";
  const fnameFromUrl = searchParams.get("fname") || "";

  const api = useFetchSlots({
    therapist_id: therapistId,
    loc_id: locationId,
    service_id: therapyForId,
  });

  const data = api.data; 
  const loading = api.loading;
  const error = api.error;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // 2. State for Step and Cart ID
  const [step, setStep] = useState<"slot" | "form" | "summary">("slot");
  const [cartId, setCartId] = useState<string | null>(null);

  // ... (keep existing date/slot logic)
  const dates: string[] = data?.dates ?? [];
  const slots: string[] = data?.Slots ?? [];
  const activeDate = selectedDate ?? dates[0];
  const activeSlot = selectedSlot;

  const filteredSlots = useMemo(() => {
    if (!activeDate) return [];
    return slots.filter((s) => s.startsWith(activeDate)).map((s) => s.split(" ")[1]);
  }, [slots, activeDate]);

  const grouped = useMemo(() => {
    // ... (keep grouping logic)
    const groups = { morning: [], afternoon: [], evening: [] };
    filteredSlots.forEach((time) => {
        const hour = parseInt(time.split(":")[0]);
        if (hour < 12) groups.morning.push(time);
        else if (hour < 17) groups.afternoon.push(time);
        else groups.evening.push(time);
    });
    return groups;
  }, [filteredSlots]);

  // ... (keep helper functions)
  const getDayDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return {
        day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      };
  };

  if (loading) return <BookingSkeleton />;
  if (error) return <div className="text-red-500">Failed to load slots</div>;

  return (
    <div className="bg-white rounded-[51px] shadow-[0_0_12px_rgba(0,0,0,0.15)] p-6 space-y-5 relative min-h-[500px]">
      
      {/* STEP 1: SLOTS */}
      {step === "slot" && (
        <>
          {/* ... (Keep existing Swiper and SlotGroup code exactly as is) ... */}
          
          <div className="flex justify-between items-center ">
             {/* ... Copy your existing Swiper Code here ... */}
             <div className="swiper-button-prev-custom cursor-pointer">...</div>
             <Swiper>...</Swiper>
             <div className="swiper-button-next-custom cursor-pointer">...</div>
          </div>

          <div key={activeDate} className="animate-slot-fade space-y-4">
             <SlotGroup title="Morning Slots" slots={grouped.morning} selected={selectedSlot} onSelect={setSelectedSlot} />
             <SlotGroup title="Afternoon Slots" slots={grouped.afternoon} selected={selectedSlot} onSelect={setSelectedSlot} />
             <SlotGroup title="Evening Slots" slots={grouped.evening} selected={selectedSlot} onSelect={setSelectedSlot} />
          </div>

          <div className="grow mt-5">
            <button
              disabled={!activeSlot}
              onClick={() => setStep("form")}
              className="w-full bg-[#01818C] text-white py-3 rounded-xl font-semibold disabled:opacity-40 transition-all"
            >
              {activeSlot ? `Confirm ${activeSlot}` : "Select a Slot"}
            </button>
          </div>
        </>
      )}

      {/* STEP 2: DETAILS FORM */}
      {step === "form" && (
        <BookingForm
          date={activeDate}
          slot={activeSlot}
          onBack={() => setStep("slot")}
          defaultPhone={phoneFromUrl}
          defaultFirstName={fnameFromUrl}
          onSuccess={(id) => {
            setCartId(id);
            setStep("summary"); // Move to summary instead of payment directly
          }}
        />
      )}

      {/* STEP 3: SUMMARY & PAYMENT (New) */}
      {step === "summary" && cartId && (
        <BookingSummary 
            cartId={cartId} 
            onBack={() => setStep("form")} 
        />
      )}

    </div>
  );
}