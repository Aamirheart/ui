"use client";

import { useState, useMemo } from "react";
import SlotGroup from "./SlotGroup";
import BookingSkeleton from "./BookingSkeleton";
import { useFetchSlots } from "@/hooks/useFetchSlots";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSearchParams } from "next/navigation";
import BookingForm from "./BookingForm";
import BookingSummary from "./BookingSummary";
// 1. Import your Shipping Selection component
import ShippingSelection from "./ShippingSelection"; 

import "./local.css";
import "swiper/css";
import "swiper/css/navigation";

export default function BookingCard() {
  const searchParams = useSearchParams();
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

  const { data, loading, error } = api;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // 2. Updated steps to include 'shipping'
  const [step, setStep] = useState<"slot" | "form" | "shipping" | "summary">("slot");
  const [cartId, setCartId] = useState<string | null>(null);

  const dates: string[] = data?.dates ?? [];
  const slots: string[] = data?.Slots ?? [];
  const activeDate = selectedDate ?? dates[0];
  const activeSlot = selectedSlot;

  const filteredSlots = useMemo(() => {
    if (!activeDate) return [];
    return slots.filter((s) => s.startsWith(activeDate)).map((s) => s.split(" ")[1]);
  }, [slots, activeDate]);

  const grouped = useMemo(() => {
    const groups = { morning: [], afternoon: [], evening: [] };
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

  return (
    <div className="bg-white rounded-[51px] shadow-[0_0_12px_rgba(0,0,0,0.15)] p-6 space-y-5 relative min-h-[500px]">
      
      {/* STEP 1: SLOTS */}
      {step === "slot" && (
        <>
          {/* ... Swiper and SlotGroup UI ... */}
          <div key={activeDate} className="animate-slot-fade space-y-4">
             <SlotGroup title="Morning" slots={grouped.morning} selected={selectedSlot} onSelect={setSelectedSlot} />
             <SlotGroup title="Afternoon" slots={grouped.afternoon} selected={selectedSlot} onSelect={setSelectedSlot} />
             <SlotGroup title="Evening" slots={grouped.evening} selected={selectedSlot} onSelect={setSelectedSlot} />
          </div>
          <button
            disabled={!activeSlot}
            onClick={() => setStep("form")}
            className="w-full bg-[#01818C] text-white py-3 rounded-xl font-semibold disabled:opacity-40"
          >
            {activeSlot ? `Confirm ${activeSlot}` : "Select a Slot"}
          </button>
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
            setStep("shipping"); // 3. Move to shipping selection after form
          }}
        />
      )}

      {/* STEP 3: SHIPPING SELECTION */}
      {step === "shipping" && cartId && (
        <ShippingSelection 
          cartId={cartId}
          onBack={() => setStep("form")}
          onSuccess={() => setStep("summary")} // 4. Move to summary/payment only after shipping is set
        />
      )}

      {/* STEP 4: SUMMARY & PAYMENT */}
      {step === "summary" && cartId && (
        <BookingSummary 
            cartId={cartId} 
            onBack={() => setStep("shipping")} 
        />
      )}
    </div>
  );
}