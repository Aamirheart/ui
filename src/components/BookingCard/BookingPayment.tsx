"use client";

import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { sdk } from "@/lib/medusa";
import { completeBookingOrder } from "@/actions/booking";
import { initPaymentSession, retrieveCart } from "@/actions/cart";

export default function BookingPayment({ cartId, onBack, onSuccess }: any) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await retrieveCart(cartId);
        setCart(data.cart);
      } catch (error) {
        console.error("Failed to load cart for payment:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [cartId]);

const handlePayment = async (providerId: string) => {
    try {
      // 1. Initialize the session
      await initPaymentSession(cartId, providerId);
      
      // 2. Get the session data (needed for the gateway)
      const refreshedData = await retrieveCart(cartId);
      const session = refreshedData.cart.payment_collection.payment_sessions.find(
        (s: any) => s.provider_id === providerId
      );

      if (!session) {
        throw new Error(`${providerId} session not found`);
      }

      // 3. Redirect to Gateway
      if (providerId === "cashfree") {
        const cashfree = await load({ mode: "sandbox" });
        // After this call, the user LEAVES your app. 
        // They will come back to the returnUrl after paying.
        await cashfree.checkout({
          paymentSessionId: session.data.payment_session_id,
          returnUrl: `${window.location.origin}/booking/success?cart_id=${cartId}`,
        });
      } 
    } catch (err) {
      alert(`Payment failed: ${err}`);
    }
  };
  if (loading) return <div className="p-8 text-center">Loading payment options...</div>;
  if (!cart) return <div className="p-8 text-center">Cart not found.</div>;

  // Identify available providers from the backend
  // Note: Your backend log shows 'cashfree' is resolving correctly.
  const availableSessions = cart.payment_collection?.payment_sessions || [];

  return (
    <div className="space-y-6 animate-slot-fade p-2">
      <h2 className="text-center font-semibold text-lg">Confirm & Pay</h2>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
         <div className="flex justify-between text-sm">
            <span className="text-slate-500">Service</span>
            <span className="font-medium">Therapy Session</span>
         </div>
         <div className="flex justify-between text-lg font-bold text-[#01818C]">
            <span>Total</span>
            <span>₹{(cart.total / 100).toFixed(2)}</span>
         </div>
      </div>

      <div className="space-y-3">
        {/* Only render buttons for providers that the backend successfully initialized */}
        {availableSessions.map((session: any) => (
          <button 
            key={session.id}
            onClick={() => handlePayment(session.provider_id)}
            className={`w-full text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all ${
              session.provider_id === 'cashfree' ? 'bg-[#7D38DC]' : 'bg-slate-700'
            }`}
          >
            Pay with {session.provider_id.charAt(0).toUpperCase() + session.provider_id.slice(1)}
          </button>
        ))}

        {availableSessions.length === 0 && (
          <p className="text-center text-red-500 text-sm">No payment methods available.</p>
        )}
      </div>

      <button onClick={onBack} className="w-full text-slate-400 text-sm mt-4 hover:text-slate-600">
        Back to Details
      </button>
    </div>
  );
}