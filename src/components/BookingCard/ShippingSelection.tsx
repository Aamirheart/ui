"use client";
import { useState, useEffect } from "react";
// Ensure these imports match the functions we just added
import { getShippingOptions, addShippingMethod } from "@/actions/booking";

export default function ShippingSelection({ cartId, onSuccess, onBack }: any) {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { shipping_options } = await getShippingOptions(cartId);
        setOptions(shipping_options);
        if (shipping_options.length > 0) setSelectedId(shipping_options[0].id);
      } catch (err) {
        console.error("Error fetching shipping:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cartId]);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    try {
      await addShippingMethod(cartId, selectedId);
      onSuccess(); // This moves the BookingCard to the "summary" step
    } catch (err) {
      console.error("Error setting shipping:", err);
      alert("Failed to set shipping method. Please check your network or backend logs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading options...</div>;

  return (
    <div className="space-y-4 animate-slot-fade p-2">
      <h3 className="text-lg font-bold text-center">Select Shipping/Service</h3>
      {options.map((opt) => (
        <div 
          key={opt.id} 
          onClick={() => setSelectedId(opt.id)}
          className={`p-4 border rounded-xl cursor-pointer transition-all ${
            selectedId === opt.id ? 'border-[#01818C] bg-cyan-50' : 'border-slate-200'
          }`}
        >
          <div className="flex justify-between">
            <span className="font-medium">{opt.name}</span>
            <span className="font-bold">₹{(opt.amount / 100).toFixed(2)}</span>
          </div>
        </div>
      ))}
      
      <button 
        onClick={handleConfirm} 
        disabled={submitting || !selectedId}
        className="w-full bg-[#01818C] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {submitting ? "Applying..." : "Continue to Payment"}
      </button>
      <button onClick={onBack} className="w-full text-slate-400 text-sm">Back</button>
    </div>
  );
}