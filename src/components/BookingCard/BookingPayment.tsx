"use client";

import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useRazorpay } from "react-razorpay";
import { sdk } from "@/lib/medusa";
import { completeBookingOrder } from "@/actions/booking";
import { retrieveCart } from "@/actions/cart";

export default function BookingPayment({ cartId, onBack, onSuccess }: any) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { Razorpay } = useRazorpay();

  // Load Cart Data
// src/components/BookingCard/BookingPayment.tsx

useEffect(() => {
  async function loadData() {
    try {
      // Use the correct retrieval function that has the expanded fields
      const data = await retrieveCart(cartId);
      // retrieveCart returns res.json() which in Medusa is usually { cart: ... }
      setCart(data.cart); 
    } catch (error) {
      console.error("Failed to load cart for payment:", error);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, [cartId]);
  // Handle Cashfree
  const handleCashfree = async () => {
    const session = cart.payment_collection.payment_sessions.find((s: any) => s.provider_id === "cashfree");
    if (!session) return alert("Cashfree session not found");

    const cashfree = await load({ mode: "sandbox" }); // Change to production for live
    cashfree.checkout({
      paymentSessionId: session.data.payment_session_id,
      returnUrl: `${window.location.origin}/booking/success?cart_id=${cartId}`,
    });
  };

  // Handle Razorpay
  const handleRazorpay = async () => {
    // 1. Init Razorpay Session on Backend if not present
    let session = cart.payment_collection.payment_sessions.find((s: any) => s.provider_id === "razorpay");
    
    if (!session) {
      // Create session specifically for Razorpay if it wasn't the default
      await sdk.store.payment.initiatePaymentSession(cart.id, { provider_id: "razorpay" });
      const refreshed = await getCart(cartId);
      session = refreshed.cart.payment_collection.payment_sessions.find((s: any) => s.provider_id === "razorpay");
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_...",
      amount: session.amount,
      currency: "INR",
      name: "Heart It Out",
      description: "Therapy Session",
      order_id: session.data.id, // Razorpay Order ID from backend
      handler: async (response: any) => {
        await completeBookingOrder(cart.id);
        onSuccess(response);
      },
      prefill: {
        email: cart.email,
        contact: cart.shipping_address?.phone,
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  if (loading) return <div className="p-8 text-center">Loading payment options...</div>;

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
        <button 
            onClick={handleRazorpay}
            className="w-full bg-[#3399cc] text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all"
        >
          Pay with Razorpay
        </button>
        
        <button 
            onClick={handleCashfree}
            className="w-full bg-[#7D38DC] text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all"
        >
          Pay with Cashfree
        </button>
      </div>

      <button onClick={onBack} className="w-full text-slate-400 text-sm mt-4 hover:text-slate-600">
        Back to Details
      </button>
    </div>
  );
}