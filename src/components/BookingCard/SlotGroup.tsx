type SlotGroupProps = {
  title: string;
  slots: string[];
  selected: string | null;
  onSelect: (v: string) => void;
};

export default function SlotGroup({
  title,
  slots,
  selected,
  onSelect,
}: SlotGroupProps) {
  if (!slots?.length) return null;

  return (
    <div>
      <p className="font-semibold text-slate-700 mb-2">{title}</p>

      <div className="flex flex-wrap gap-3">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`rounded-xl px-4 py-2 whitespace-nowrap border 
  transition-all duration-300 ease-out
  active:scale-95
  ${selected === slot
    ? "bg-[#E5F7F9] border-[#00838F] text-[#00838F] font-semibold shadow-md scale-105"
    : "bg-white border-[#00838F] text-slate-500 hover:bg-[#E5F7F9] hover:scale-105"
  }`}
	
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
