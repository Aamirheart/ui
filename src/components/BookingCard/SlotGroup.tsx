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
            className={`rounded-xl px-4 py-2 text-sm whitespace-nowrap border transition-all f-18-14-auto
    ${
      selected === slot
        ? "bg-[#E5F7F9] border-[#00838F] text-[#00838F] font-semibold"
        : "bg-white border-[#00838F] text-slate-500 hover:bg-[#E5F7F9]"
    }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
