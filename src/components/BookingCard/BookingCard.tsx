"use client";

import { useState, useMemo } from "react";
import SlotGroup from "./SlotGroup";
import BookingSkeleton from "./BookingSkeleton";
import { mockSlots } from "./mockSlots";
import { useFetchSlots } from "@/hooks/useFetchSlots";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useSearchParams } from "next/navigation";

import "./local.css";

import "swiper/css";
import "swiper/css/navigation";
import BookingForm from "./BookingForm";

// 👇 Toggle this when needed
const USE_MOCK = false;

export default function BookingCard() {
	// Always call hook (to respect hooks rules)
	const searchParams = useSearchParams();

// read params (with fallbacks)
const therapistId =
  searchParams.get("therapist_id") ||
  searchParams.get("therapiest_id") || // fallback for typo
  "48";

const locationId = searchParams.get("location") || "2";
const therapyForId = searchParams.get("therapy_for_id") || "13";

// optional (for form prefilling later)
const phoneFromUrl = searchParams.get("phone") || "";
const fnameFromUrl = searchParams.get("fname") || "";

	const api = useFetchSlots({
  therapist_id: therapistId,
  loc_id: locationId,
  service_id: therapyForId,
});



	// Decide which data source to use
	const data = USE_MOCK ? mockSlots : api.data;
	const loading = USE_MOCK ? false : api.loading;
	const error = USE_MOCK ? null : api.error;

	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	// const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [step, setStep] = useState<"slot" | "form">("slot");


	const dates: string[] = data?.dates ?? [];
	const slots: string[] = data?.Slots ?? [];

	const activeDate = selectedDate ?? dates[0];
	const activeSlot = selectedSlot;


	const filteredSlots = useMemo(() => {
		if (!activeDate) return [];
		return slots
			.filter((s) => s.startsWith(activeDate))
			.map((s) => s.split(" ")[1]);
	}, [slots, activeDate]);

	const grouped = useMemo(() => {
		const groups = {
  morning: [] as string[],
  afternoon: [] as string[],
  evening: [] as string[],
};


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
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
};


	return (
		<div className="bg-white rounded-[51px] shadow-[0_0_12px_rgba(0,0,0,0.15)] p-6 space-y-5 relative">

{step === "slot" && (		
		<>
			{/* Dates */}
			<div className="flex justify-between items-center ">
				<div className="swiper-button-prev-custom cursor-pointer">
					<div className="md:block hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
							<path d="M37.8347 19.8026C37.8347 9.59296 29.5581 1.31641 19.3485 1.31641C9.13886 1.31641 0.862305 9.59296 0.862305 19.8026C0.862305 30.0122 9.13886 38.2888 19.3485 38.2888C29.5581 38.2888 37.8347 30.0122 37.8347 19.8026Z" fill="#E4E6EA" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M12.3057 19.8021C12.3057 19.316 12.6998 18.9219 13.186 18.9219H25.5101C25.9963 18.9219 26.3904 19.316 26.3904 19.8021C26.3904 20.2883 25.9963 20.6825 25.5101 20.6825H13.186C12.6998 20.6825 12.3057 20.2883 12.3057 19.8021Z" fill="#043953" fill-opacity="0.88" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M19.9704 13.0176C20.3143 13.3614 20.3143 13.9187 19.9704 14.2625L14.4309 19.8021L19.9704 25.3418C20.3143 25.6855 20.3143 26.2429 19.9704 26.5867C19.6268 26.9304 19.0694 26.9304 18.7255 26.5867L12.5635 20.4246C12.2197 20.0808 12.2197 19.5234 12.5635 19.1797L18.7255 13.0176C19.0694 12.6738 19.6268 12.6738 19.9704 13.0176Z" fill="#043953" fill-opacity="0.88" />
						</svg>
					</div>

					<div className="md:hidden block">
						<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
							<path d="M24.1643 12.6476C24.1643 6.12688 18.8782 0.84082 12.3575 0.84082C5.83684 0.84082 0.550781 6.12688 0.550781 12.6476C0.550781 19.1683 5.83684 24.4543 12.3575 24.4543C18.8782 24.4543 24.1643 19.1683 24.1643 12.6476Z" fill="#E4E6EA" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M7.85938 12.6472C7.85938 12.3367 8.11109 12.085 8.4216 12.085H16.2928C16.6033 12.085 16.855 12.3367 16.855 12.6472C16.855 12.9577 16.6033 13.2095 16.2928 13.2095H8.4216C8.11109 13.2095 7.85938 12.9577 7.85938 12.6472Z" fill="#043953" fill-opacity="0.88" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7547 8.31409C12.9743 8.53365 12.9743 8.88963 12.7547 9.1092L9.21671 12.6472L12.7547 16.1853C12.9743 16.4048 12.9743 16.7608 12.7547 16.9804C12.5352 17.1999 12.1792 17.1999 11.9596 16.9804L8.02405 13.0448C7.80448 12.8252 7.80448 12.4692 8.02405 12.2497L11.9596 8.31409C12.1792 8.09452 12.5352 8.09452 12.7547 8.31409Z" fill="#043953" fill-opacity="0.88" />
						</svg>
					</div>
				</div>
				<Swiper
					modules={[Navigation]}
					// spaceBetween={12}
					navigation={{
						prevEl: ".swiper-button-prev-custom",
						nextEl: ".swiper-button-next-custom",
					}}
					breakpoints={{
						0: {
							slidesPerView: 3,
						},
						768: {
							slidesPerView: 5,
						},
					}}
					className="flex-1 py-4"
				>

					{dates.map((date) => {
								const { day, date: dayNumber, month } = getDayDate(date);


						return (
							<SwiperSlide key={date} className="py-4 px-2" >
								<button
									onClick={() => {
										setSelectedDate(date);
									}}
									className={`rounded-xl px-4 py-2 whitespace-nowrap border 
  transition-all duration-300 ease-out
  active:scale-95
  ${activeDate === date
											? "bg-[#E5F7F9] border-[#00838F] text-[#00838F] font-semibold shadow-md scale-105"
											: "bg-white border-[#00838F] text-slate-500 hover:bg-[#E5F7F9] hover:scale-105"
										}`}

								>

									{/* <p className="f-18-16-auto leading-none">{day}</p>
									<p className="f-18-16-auto font-semibold leading-tight">{dayNumber}</p> */}
									<p className="f-18-16-auto leading-none">{day}</p>
<p className="text-sm font-semibold leading-tight">
  {month} {dayNumber}
</p>

								</button>
							</SwiperSlide>
						);
					})}
				</Swiper>
				<div className="swiper-button-next-custom cursor-pointer">
					<div className="md:block hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
							<path d="M37.9387 19.8026C37.9387 9.59296 29.6621 1.31641 19.4525 1.31641C9.24286 1.31641 0.966309 9.59296 0.966309 19.8026C0.966309 30.0122 9.24286 38.2888 19.4525 38.2888C29.6621 38.2888 37.9387 30.0122 37.9387 19.8026Z" fill="#E4E6EA" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M12.4097 19.8023C12.4097 19.3161 12.8038 18.9219 13.29 18.9219H25.6141C26.1003 18.9219 26.4944 19.3161 26.4944 19.8023C26.4944 20.2884 26.1003 20.6825 25.6141 20.6825H13.29C12.8038 20.6825 12.4097 20.2884 12.4097 19.8023Z" fill="#043953" fill-opacity="0.88" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M18.8266 13.0176C19.1704 12.6738 19.7278 12.6738 20.0717 13.0176L26.2336 19.1796C26.5774 19.5235 26.5774 20.0809 26.2336 20.4246L20.0717 26.5866C19.7278 26.9305 19.1704 26.9305 18.8266 26.5866C18.4829 26.243 18.4829 25.6856 18.8266 25.3417L24.3663 19.8022L18.8266 14.2625C18.4829 13.9188 18.4829 13.3614 18.8266 13.0176Z" fill="#043953" fill-opacity="0.88" />
						</svg>
					</div>

					<div className="md:hidden block">
						<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
							<path d="M24.2307 12.6476C24.2307 6.12688 18.9446 0.84082 12.4239 0.84082C5.90325 0.84082 0.617188 6.12688 0.617188 12.6476C0.617188 19.1683 5.90325 24.4543 12.4239 24.4543C18.9446 24.4543 24.2307 19.1683 24.2307 12.6476Z" fill="#E4E6EA" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M7.92578 12.6473C7.92578 12.3368 8.1775 12.085 8.48801 12.085H16.3592C16.6697 12.085 16.9214 12.3368 16.9214 12.6473C16.9214 12.9578 16.6697 13.2095 16.3592 13.2095H8.48801C8.1775 13.2095 7.92578 12.9578 7.92578 12.6473Z" fill="#043953" fill-opacity="0.88" />
							<path fill-rule="evenodd" clip-rule="evenodd" d="M12.024 8.31408C12.2436 8.09452 12.5996 8.09452 12.8192 8.31408L16.7547 12.2497C16.9743 12.4693 16.9743 12.8253 16.7547 13.0448L12.8192 16.9804C12.5996 17.2 12.2436 17.2 12.024 16.9804C11.8045 16.7609 11.8045 16.4049 12.024 16.1853L15.5621 12.6473L12.024 9.10919C11.8045 8.88963 11.8045 8.53364 12.024 8.31408Z" fill="#043953" fill-opacity="0.88" />
						</svg>
					</div>
				</div>
			</div>
			<div>
				<div
					key={activeDate}
					className="animate-slot-fade space-y-4"
				>
					<SlotGroup
						title="Morning Slots"
						slots={grouped.morning}
						selected={selectedSlot}
						onSelect={setSelectedSlot}
					/>

					<SlotGroup
						title="Afternoon Slots"
						slots={grouped.afternoon}
						selected={selectedSlot}
						onSelect={setSelectedSlot}
					/>

					<SlotGroup
						title="Evening Slots"
						slots={grouped.evening}
						selected={selectedSlot}
						onSelect={setSelectedSlot}
					/>

				</div>

				<div className="grow  mt-5">
					<button
						disabled={!activeSlot}
						onClick={() => setStep("form")}
						className="w-full bg-[#01818C] text-white py-3 rounded-xl font-semibold disabled:opacity-40"
					>
						{activeSlot ? `Confirm ${activeSlot}` : "Select a Slot"}
					</button>

				

				</div>
			</div>
		</>
			)}
			{step === "form" && (
  <BookingForm
    date={activeDate}
    slot={activeSlot}
    onBack={() => setStep("slot")}
    defaultPhone={phoneFromUrl}
    defaultFirstName={fnameFromUrl}
  />
)}

		</div>
	);
}
