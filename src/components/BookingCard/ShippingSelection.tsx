"use client";
import { useState, useEffect } from "react";
// Import getShippingOptions, addShippingMethod, and initPaymentSessions from your actions
import { getShippingOptions, addShippingMethod, initPaymentSessions } from "@/actions/booking";

export default function ShippingSelection({ cartId, onSuccess, onBack }: any) {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Fetch available shipping options for the current cart
        const { shipping_options } = await getShippingOptions(cartId);
        setOptions(shipping_options);
        if (shipping_options.length > 0) {
          setSelectedId(shipping_options[0].id);
        }
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
      // 1. Add the selected shipping method to the cart
      // This satisfies the "shipping profile" requirement in Medusa
      await addShippingMethod(cartId, selectedId);
      
      // 2. Initialize payment sessions ONLY after shipping is applied
      // This prevents the 400 Bad Request error during payment initialization
      await initPaymentSessions(cartId);
      
      // 3. Move the BookingCard to the "summary" step
      onSuccess(); 
    } catch (err) {
      console.error("Error setting shipping or initializing payment:", err);
      alert("Failed to proceed. Please check your network or backend logs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading options...</div>;

  return (
    <div className="space-y-4 animate-slot-fade p-2">
      <h3 className="text-lg font-bold text-center">Select Shipping/Service</h3>
      
      <div className="space-y-3">
        {options.length > 0 ? (
          options.map((opt) => (
            <div 
              key={opt.id} 
              onClick={() => setSelectedId(opt.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                selectedId === opt.id ? 'border-[#01818C] bg-cyan-50' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium block">{opt.name}</span>
                  {opt.data?.arrival_date && (
                    <span className="text-xs text-slate-500">Expected: {opt.data.arrival_date}</span>
                  )}
                </div>
                <span className="font-bold text-[#01818C]">
                  ₹{(opt.amount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-slate-500 border rounded-xl border-dashed">
            No shipping options available for this location.
          </div>
        )}
      </div>
      
      <div className="pt-4 space-y-3">
        <button 
          onClick={handleConfirm} 
          disabled={submitting || !selectedId}
          className="w-full bg-[#01818C] text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-opacity"
        >
          {submitting ? "Processing..." : "Continue to Summary"}
        </button>
        
        <button 
          onClick={onBack} 
          disabled={submitting}
          className="w-full text-slate-400 text-sm font-medium"
        >
          Back to Details
        </button>
      </div>
    </div>
  );
}