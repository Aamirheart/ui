import { Suspense } from "react";
import BookingCard from "@/components/BookingCard/BookingCard";
import TherapistCard from "@/components/TherapistCard/TherapistCard";

export default function Home() {
  return (
    <main className=" bg-[#f7fbfc]">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <TherapistCard />
          <Suspense fallback={<div />}>
      <BookingCard />
    </Suspense>
        </div>

      </div>
    </main>
  );
}
